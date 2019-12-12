import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity,
    Image, StyleSheet, Linking
} from 'react-native';
import { COLORS, IOSShadow, MAP_KEY, API_URL } from '../Constants';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { loadingChange } from '../Actions';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';
import Toast from 'react-native-simple-toast';
import Axios from 'axios';
import { LangValue } from '../lang';
class OrderLocation extends Component {
    constructor(props) {
        super(props);
        let orderLocation = (this.props.navigation.getParam('orderLocation')).split(',');
        this.state = {
            orderLocation,
            orderLat: orderLocation[0],
            orderLng: orderLocation[1],
            UserLat: 0,
            UserLng: 0
        }
    }
    componentDidMount() {
        this.props.LoadingStatusChange(true);
        Geolocation.getCurrentPosition(
            (position) => {
                let { latitude, longitude } = position.coords;
                this.setState({ UserLat: latitude, UserLng: longitude }, () => { this.props.LoadingStatusChange(false); });

            },
            (error) => {
                // See error code charts below.
                setTimeout(() => { Toast.show(error.message, Toast.SHORT); }, 100);
                this.props.LoadingStatusChange(false);
            },
            { enableHighAccuracy: true }
        );

    }
    saveOrderStatus = (oS) => {
        let { navigation, reducer } = this.props;
        let itemData = navigation.getParam('itemdata');
        let type = navigation.getParam('type');
        let dataUrl = '';
        if (type == 'homewastage') {
            let { userData } = reducer;
            let newDate = new Date();
            let day = (newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate();
            let month = (newDate.getMonth() < 10) ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1;
            let Year = newDate.getFullYear();
            let todayDate = Year + '-' + month + '-' + day;
            dataUrl = `&type=homewastage&UserId=${itemData.UserId}&ProviderId=${userData.UserId}&HomeWastageDate=${todayDate}&HomeWastageStatus=${oS}`;
        }
        else if (type == 'gaswater') {
            dataUrl = `&type=gaswater&OrderId=${itemData.OrderId}&OrderStatus=${oS}`;
        }
        this.props.LoadingStatusChange(true);
        Axios.get(`${API_URL}orderstatus.php?action=orderstatus${dataUrl}&lang=${this.props.reducer.lang}`)
            .then(res => {
                let { success, message } = res.data;
                this.props.LoadingStatusChange(false);
                setTimeout(() => { Toast.show(message, Toast.SHORT) }, 100)
                if (success == 1) {
                    setTimeout(() => { this.props.navigation.navigate('Home') }, 200);
                }
            })
            .catch(err => {
                this.props.LoadingStatusChange(false);
                setTimeout(() => { Toast.show(err.message, Toast.SHORT) }, 100)
            });
    }
    render() {
        let { lang } = this.props.reducer;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: '80%' }}>
                    <MapView
                        loadingEnabled={true}
                        userLocationAnnotationTitle="Your Location"
                        showsMyLocationButton={true}
                        paddingAdjustmentBehavior="automatic"
                        //provider={PROVIDER_GOOGLE}
                        showsCompass={true}
                        style={styles.map}
                        region={{
                            latitude: this.state.orderLat,
                            longitude: this.state.orderLng,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}>
                        <Marker coordinate={{ latitude: this.state.orderLat, longitude: this.state.orderLng }} draggable={true} pinColor={COLORS.Primary} />
                    </MapView>
                </View>
                <View style={{ paddingHorizontal: 10, paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, color: COLORS.Primary }}>{LangValue[lang].ORDER_STATUS}</Text>
                        <TouchableOpacity onPress={() => {
                            var url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${this.state.orderLocation}`;
                            Linking.canOpenURL(url).then(supported => {
                                if (!supported) {
                                } else {
                                    return Linking.openURL(url);
                                }
                            }).catch(err => console.error('An error occurred', err));
                        }}>

                            <Image source={require('../assets/all-order-map-icon.png')} style={{ width: 20, height: 17 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30 }}>
                        <TouchableOpacity style={styles.button} onPress={() => { this.saveOrderStatus('Y') }}>
                            <Text style={styles.btnText}>{LangValue[lang].DONE}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => { this.saveOrderStatus('N') }}>
                            <Text style={styles.btnText}>{LangValue[lang].NOT_AVAILABLE}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    button: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: COLORS.Primary,
        ...IOSShadow,
        borderRadius: 20
    },
    btnText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 15
    }
});
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStateToProps, mapDispatchToProps)(OrderLocation);