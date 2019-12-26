import React, { Component } from 'react';
import {
    View, Text,
    Image, ScrollView, KeyboardAvoidingView,
    TouchableOpacity, FlatList, StyleSheet
} from 'react-native';
import { COLORS, API_URL } from '../Constants';
import Axios from 'axios';
import TabBar from './TabBar';
import { connect } from 'react-redux';
import { loadingChange } from '../Actions';
import SimpleToast from 'react-native-simple-toast';
import Geolocation from 'react-native-geolocation-service';
class ProGastWaterList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            garbage: [],
            districtId: this.props.navigation.getParam('districtId'),
            product_type: this.props.navigation.getParam('productType'),
        }
    }
    garbagedata = () => {
        let { lang, userData } = this.props.reducer;
        this.props.LoadingStatusChange(true);
        Axios.get(`${API_URL}orderlistgw.php?action=gaswater&UserDistrict=${this.state.districtId}&lang=${lang}&ProviderId=${userData.UserId}`)
            .then(res => {
                let { success, message, Order } = res.data;
                if (success == 1) {
                    for (let i = 0; i < Order.length; i++) {
                        let [latitude, longitude] = Order[i].UserLocation.split(',');
                        Order[i]["distance"] = this.calculateDistance(this.state.UserLat, this.state.UserLng, latitude, longitude, "K");
                    }
                    Order.sort(function (a, b) {
                        return a.distance - b.distance;
                    });
                    this.setState({ garbage: Order }, () => {
                        this.props.LoadingStatusChange(false);
                    });
                }
                else {
                    this.props.LoadingStatusChange(false);
                }
                setTimeout(() => { SimpleToast.show(message, SimpleToast.SHORT) }, 100);
            })
            .catch(err => {
                this.props.LoadingStatusChange(false);
                console.log('Wastage Order List Error', err);
            })
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
                    contentContainerStyle={{ paddingHorizontal: 5 }}
                    renderItem={({ item, index }) => {
                        let haveWater = false;
                        let haveGas = false;
                        item.product.map((pItem, pIndex) => {
                            if (pItem.ProductType == 'gas') {
                                haveGas = true;
                            }
                            else if (pItem.ProductType == 'water') {
                                haveWater = true;
                            }
                        });
                        let ProductType = this.state.product_type;
                        if (haveWater == true && haveGas == false && ProductType == 'water') {
                            return (
                                <View style={{ borderBottomWidth: 0.8, borderColor: '#F1F1F1', paddingHorizontal: 5, marginBottom: 8, paddingLeft: 16 }}>
                                    <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', width: '100%' }}>
                                        <View style={{ width: '61%' }}>
                                            <Text style={{ fontSize: 15, color: '#555555', marginBottom: 8, textAlign: 'left' }}>{index + 1}.{item.UserFName} {item.UserLName}</Text>

                                            <Text style={{ fontSize: 13, color: '#666666', textAlign: 'left' }}>{item.UserHome},{item.UserDistrictName}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: "space-around", width: '33%', marginHorizontal: 30, alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => {
                                                this.props.navigation.navigate('OrderLocation', { orderLocation: item.UserLocation, itemdata: item, type: 'gaswater' });
                                            }}>

                                                <Image source={require('../assets/all-order-map-icon.png')} style={{ width: 20, height: 17 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('ProOrderDetails', { itemdata: item, productList: item.product, type: 'gaswater' }) }}><Image source={require('../assets/all-order-view-icon.png')} style={{ width: 22, height: 22 }} /></TouchableOpacity>
                                            <Image source={require('../assets/water-gray.png')} style={{ width: 20, height: 34 }} />
                                        </View>
                                    </View>
                                </View>
                            )
                        }
                        else if (haveWater == false && haveGas == true && ProductType == 'gas') {
                            return (
                                <View style={{ borderBottomWidth: 0.8, borderColor: '#F1F1F1', paddingHorizontal: 5, marginBottom: 8, paddingLeft: 16 }}>
                                    <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', width: '100%' }}>
                                        <View style={{ width: '61%' }}>
                                            <Text style={{ fontSize: 15, color: '#555555', marginBottom: 8, textAlign: 'left' }}>{index + 1}.{item.UserFName} {item.UserLName}</Text>

                                            <Text style={{ fontSize: 13, color: '#666666', textAlign: 'left' }}>{item.UserHome},{item.UserDistrictName}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: "space-around", width: '33%', marginHorizontal: 30, alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => {
                                                this.props.navigation.navigate('OrderLocation', { orderLocation: item.UserLocation, itemdata: item, type: 'gaswater' });
                                            }}>

                                                <Image source={require('../assets/all-order-map-icon.png')} style={{ width: 20, height: 17 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('ProOrderDetails', { itemdata: item, productList: item.product, type: 'gaswater' }) }}><Image source={require('../assets/all-order-view-icon.png')} style={{ width: 22, height: 22 }} /></TouchableOpacity>
                                            <Image source={require('../assets/gas-gray.png')} style={{ width: 17, height: 34 }} />
                                        </View>
                                    </View>
                                </View>
                            )
                        }
                        else if (haveWater == true && haveGas == true) {
                            return (
                                <View style={{ borderBottomWidth: 0.8, borderColor: '#F1F1F1', paddingHorizontal: 5, marginBottom: 8, paddingLeft: 16 }}>
                                    <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', width: '100%' }}>
                                        <View style={{ width: '61%' }}>
                                            <Text style={{ fontSize: 15, color: '#555555', marginBottom: 8, textAlign: 'left' }}>{index + 1}.{item.UserFName} {item.UserLName}</Text>

                                            <Text style={{ fontSize: 13, color: '#666666', textAlign: 'left' }}>{item.UserHome},{item.UserDistrictName}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: "space-around", width: '33%', marginHorizontal: 30, alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => {
                                                this.props.navigation.navigate('OrderLocation', { orderLocation: item.UserLocation, itemdata: item, type: 'gaswater' });
                                            }}>

                                                <Image source={require('../assets/all-order-map-icon.png')} style={{ width: 20, height: 17 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('ProOrderDetails', { itemdata: item, productList: item.product, type: 'gaswater' }) }}><Image source={require('../assets/all-order-view-icon.png')} style={{ width: 22, height: 22 }} /></TouchableOpacity>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Image source={require('../assets/water-gray.png')} style={{ width: 20, height: 34, marginRight: 5 }} />
                                                <Image source={require('../assets/gas-gray.png')} style={{ width: 17, height: 34 }} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        }
                        return false;
                    }}
                    keyExtractor={(item, index) => `key-${index}`}
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
    subcontainer: {
        backgroundColor: COLORS.Primary,
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginBottom: 35
    },
    container: {
        marginVertical: 5,
        marginHorizontal: 5
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
export default connect(mapStateToProps, mapDispatchToProps)(ProGastWaterList);