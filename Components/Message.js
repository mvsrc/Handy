import React, { Component } from 'react';
import { View, Text, FlatList,RefreshControl } from 'react-native';
import { COLORS, API_URL } from '../Constants';
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import { loadingChange } from '../Actions';
import Axios from 'axios';
import TabBar from './TabBar';
class Message extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messagedata: [],
            isRefreshing:false
        }
    }
    curProps = this.props
    componentDidMount() {
        this.curProps.navigation.addListener('didFocus',()=>{
            this.curProps.LoadingStatusChange(true);
            this.fetchMessages();
        })
    }
    fetchMessages = async () => {
        let { userData } = this.curProps.reducer;
        await Axios.get(`${API_URL}feedback.php?action=feedback&UserId=${userData.UserId}`)
            .then((res1) => {
                if (res1.data.success == 1) {
                    this.setState({ messagedata: res1.data.results });
                }
                else {
                    Toast.show(res1.data.message, Toast.LONG)
                }
                this.curProps.LoadingStatusChange(false);
                this.setState({isRefreshing:false});
            })
            .catch((error) => {
                console.log('Message Error: ', error);
                this.setState({isRefreshing:false});
                this.curProps.LoadingStatusChange(false);
            });
    }
    render() {
        let { navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    contentContainerStyle={{ paddingVertical: 10 }}
                    data={this.state.messagedata}
                    ItemSeparatorComponent={() => (
                        <View style={{ borderBottomColor: '#999999', borderBottomWidth: 1, marginBottom: 10 }}></View>
                    )}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ paddingBottom: 10, paddingHorizontal: 15 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 2, marginVertical: 10 }}>
                                    <Text style={{ fontSize: 16, color: COLORS.Primary, fontWeight: 'bold' }}>{item.FeedcomType}-</Text>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.FeedcomDate}</Text>
                                </View>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', paddingVertical: 5 }}>{item.FeedcomTitle}</Text>
                                <Text style={{ fontSize: 14 }}>{item.FeedcomBody}</Text>

                            </View>
                        )
                    }}
                    keyExtractor={(item, index) => 'message-' + index}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={()=>{this.setState({isRefreshing:true}),this.fetchMessages()}}
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
export default connect(mapStateToProps, mapDispatchToProps)(Message);