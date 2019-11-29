import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import TabBar from './TabBar';
import { COLORS, API_URL } from '../Constants';
import Toast from 'react-native-simple-toast';
import { loadingChange } from '../Actions';
import Axios from 'axios';
class Notification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            notificationdata: [],
            isRefreshing: false,
        }
    }
    curProps = this.props
    componentDidMount() {
        this.curProps.navigation.addListener('didFocus',()=>{
            this.curProps.LoadingStatusChange(true);
            this.fetchNotification();
        })
    }
    fetchNotification = async () => {
        let { userData } = this.curProps.reducer;
        await Axios.get(`${API_URL}notification.php?action=notification&UserId=${userData.UserId}`)
            .then((res1) => {
                if (res1.data.success == 1) {
                    this.setState({ notificationdata: res1.data.notification });
                }
                else {
                    Toast.show(res1.data.message, Toast.LONG)
                }
                this.curProps.LoadingStatusChange(false);
                this.setState({ isRefreshing: false });
            })
            .catch((error) => {
                console.log('Category List Error: ', error);
                this.setState({ isRefreshing: false });
                this.curProps.LoadingStatusChange(false);
            });
    }
    render() {
        let { navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this.state.notificationdata}
                    contentContainerStyle={{ paddingVertical: 10 }}
                    ItemSeparatorComponent={() => (
                        <View style={{ borderBottomColor: '#999999', borderBottomWidth: 1, marginBottom: 10 }}></View>
                    )}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ paddingBottom: 10, paddingHorizontal: 15 }}>
                                <Text style={{ color: COLORS.Primary, fontSize: 16, paddingBottom: 7 }}>{item.NotificationTitle}</Text>
                                <Text style={{ fontSize: 14, paddingLeft: 5 }}>{item.NotificationText}</Text>
                            </View>
                        )
                    }}
                    keyExtractor={(item, index) => 'Notification-' + index}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => { this.setState({ isRefreshing: true }), this.fetchNotification() }}
                            title="Pull to refresh"
                            tintColor={COLORS.Primary}
                            titleColor={COLORS.Primary}
                        />
                    }
                />
                <TabBar navigation={navigation} />
            </View>
        )
    }
}
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Notification);