import React, { Component } from 'react';
import {
    SafeAreaView, View, Text,
    Image, ScrollView, Dimensions, KeyboardAvoidingView,
    TouchableOpacity, FlatList,
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { COLORS, API_URL } from '../Constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Entypo'
import Axios from 'axios';
import { loadingChange } from '../Actions';
import TabBar from './TabBar';
class Garbagecan extends Component {

    constructor(props) {
        super(props)
        this.state = {
            garbage: []
        }
    }
    garbagedata = () => {
        this.props.LoadingStatusChange(true);
        let { userData } = this.props.reducer;
        Axios.get(`${API_URL}garbagecan.php?action=getList&DistrictId=1&ProviderId=${userData.UserId}&lang=ar`)
            .then(res => {

                this.setState({ garbage: res.data.result },()=>{
                    this.props.LoadingStatusChange(false);
                });

            })
            .catch(err => {
                this.props.LoadingStatusChange(false);
                console.log('District Error', err);
            });
    }
    componentDidMount() {
        this.garbagedata();
    }
    render() {
        return (
            <View style={styles.main}>
                <FlatList
                    data={this.state.garbage}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ borderBottomWidth: 0.7, paddingVertical: 5, paddingHorizontal: 15, marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', paddingBottom: 5 }}>
                                    <View style={{ width: '60%' }}>
                                        <Text style={{ fontSize: 17, color: '#555555', paddingBottom: 3 }}>{index + 1}.{item.UserFName} {item.UserLName}</Text>
                                        <Text style={{ fontSize: 17, color: '#666666', paddingBottom: 3 }}>{item.UserPhone}</Text>
                                        <Text style={{ fontSize: 17, color: '#666666', }}>{item.UserHome},{item.UserDistrictName}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', width: '35%', marginHorizontal: 35 }}>
                                        <TouchableOpacity>
                                            <Icon name='check-circle' size={47} color='#1cc749' />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ paddingLeft: 30 }}>
                                            <Icon1 name='circle-with-cross' size={47} color='#e83134' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                    keyExtractor={(item, index) => 'key-' + index}
                />
                <TabBar navigation={this.props.navigation} />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    button: {
        textAlign: 'center', backgroundColor: COLORS.Primary,
        width: 175,
        paddingVertical: 10,
        borderRadius: 20,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold'
    }

});
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Garbagecan);