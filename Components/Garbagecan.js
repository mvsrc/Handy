import React, { Component } from 'react';
import {
    View, Text,
    TouchableOpacity, FlatList,
    StyleSheet,RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import { COLORS, API_URL } from '../Constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Entypo'
import Axios from 'axios';
import { loadingChange } from '../Actions';
import TabBar from './TabBar';
import SimpleToast from 'react-native-simple-toast';
import Geolocation from 'react-native-geolocation-service';
class Garbagecan extends Component {

    constructor(props) {
        super(props)
        this.state = {
            garbage: [],
            isRefreshing:false
        }
    }
    garbagedata = () => {
        this.props.LoadingStatusChange(true);
        let { userData,proDistrictId } = this.props.reducer;
        let queryUrl = `${API_URL}garbagecan.php?action=getList&DistrictId=${proDistrictId}&ProviderId=${userData.UserId}&lang=${this.props.reducer.lang}`;
        Axios.get(queryUrl)
            .then(res => {
                let {success,message,result} = res.data;
                let newResponses = [];
                if(success == 1){
                    for (let i = 0; i < result.length; i++) {
                        if(!result[i].GarbageCanStatus){
                            let [latitude,longitude] = result[i].UserLocation.split(',');
                            result[i]["distance"] = this.calculateDistance(this.state.UserLat, this.state.UserLng, latitude, longitude, "K");
                            newResponses.push({...result[i]});
                        }
                    }
                    newResponses.sort(function(a, b) { 
                        return a.distance - b.distance;
                      });
                    this.setState({ garbage: newResponses,isRefreshing:false }, () => {
                        this.props.LoadingStatusChange(false);
                    });
                }
                
                setTimeout(()=>{SimpleToast.show(message,SimpleToast.SHORT)},100);
            })
            .catch(err => {
                this.props.LoadingStatusChange(false);
                console.log('District Error', err);
            });
    }
    componentDidMount() {
        this.props.LoadingStatusChange(true);
        Geolocation.getCurrentPosition(
            (position) => {
                let { latitude, longitude } = position.coords;
                
                this.setState({ UserLat: latitude, UserLng: longitude }, () => {
                    this.garbagedata();
                });

            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
                Toast.show(error.message, Toast.SHORT);
                this.props.LoadingStatusChange(false);
            },
            { enableHighAccuracy: true }
        );
    }
    updateGarbageStatus = (status,sId)=>{
        Axios.get(`${API_URL}garbagecan.php?action=UpdateGarbageStatus&GarbageCanStatus=${status}&SubscriptionId=${sId}&lang=${this.props.reducer.lang}`)
            .then(res => {
                setTimeout(()=>{SimpleToast.show(res.data.message,SimpleToast.SHORT)},100);
                this.garbagedata();
            })
            .catch(err => {
                this.props.LoadingStatusChange(false);
                console.log('District Error', err);
            });
    }
    calculateDistance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1 / 180
        var radlat2 = Math.PI * lat2 / 180
        var radlon1 = Math.PI * lon1 / 180
        var radlon2 = Math.PI * lon2 / 180
        var theta = lon1 - lon2
        var radtheta = Math.PI * theta / 180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180 / Math.PI
        dist = dist * 60 * 1.1515
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist
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
                                        <TouchableOpacity onPress={()=>{this.updateGarbageStatus('Y',item.SubscriptionId)}}>
                                            <Icon name='check-circle' size={47} color='#1cc749' />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ paddingLeft: 30 }} onPress={()=>{this.updateGarbageStatus('N',item.SubscriptionId)}}>
                                            <Icon1 name='circle-with-cross' size={47} color='#e83134' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                    keyExtractor={(item, index) => 'key-' + index}
                    refreshing={this.state.isRefreshing}
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.isRefreshing}
                          onRefresh={()=>{this.setState({isRefreshing:true},()=>{this.garbagedata()})}}
                          tintColor={COLORS.Primary}
                          title="Refreshing....."
                          titleColor={COLORS.Primary}
                        />
                      }
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