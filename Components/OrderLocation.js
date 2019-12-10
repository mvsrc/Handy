import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity,
    Image, StyleSheet, Linking
} from 'react-native';
import { COLORS, IOSShadow,MAP_KEY } from '../Constants';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { loadingChange } from '../Actions';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';
class OrderLocation extends Component {
    constructor(props) {
        super(props);
        let orderLocation = (this.props.navigation.getParam('orderLocation')).split(',');
        this.state = {
            orderLocation,
            orderLat: orderLocation[0],
            orderLng: orderLocation[1],
            UserLat:0,
            UserLng:0
        }
    }
    componentDidMount() {
        this.props.LoadingStatusChange(true);
        Geolocation.getCurrentPosition(
            (position) => {
                let { latitude, longitude } = position.coords;
                this.setState({ UserLat: latitude, UserLng: longitude },()=>{this.props.LoadingStatusChange(false);});
                
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
                Toast.show(error.message,Toast.SHORT);
                this.props.LoadingStatusChange(false);
            },
            { enableHighAccuracy: true }
        );
        
    }
    render() {
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
                        <Text style={{ fontSize: 18, color: COLORS.Primary }}>Order Status</Text>
                        <TouchableOpacity onPress={()=> {
                            var url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${this.state.orderLocation}`;
                            console.log(url);
                            Linking.canOpenURL(url).then(supported => {
                                if (!supported) {
                                    console.log('Can\'t handle url: ' + url);
                                } else {
                                    return Linking.openURL(url);
                                }
                            }).catch(err => console.error('An error occurred', err)); 
                        }}>

                            <Image source={require('../assets/all-order-map-icon.png')} style={{ width: 20, height: 17 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginTop:30 }}>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.btnText}>Done</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.btnText}>Not Available</Text>
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
    button:{
        paddingHorizontal:15,
        paddingVertical:10,
        backgroundColor:COLORS.Primary,
        ...IOSShadow,
        borderRadius:5
    },
    btnText:{
        textAlign:'center',
        color:'#FFFFFF',
        fontSize:15
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