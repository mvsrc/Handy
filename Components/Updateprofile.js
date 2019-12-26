import React, { Component } from 'react';
import {
    Platform, View, Text,
    ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity,
    StyleSheet, Keyboard, Image, Dimensions, Modal
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, API_URL, IOSShadow, MAP_KEY } from '../Constants';
import Toast from 'react-native-simple-toast';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Axios from 'axios';
import { connect } from 'react-redux';
import { loadingChange, updateProfileAction, SetLanguageAction } from '../Actions';
import TabBar from './TabBar';
import Icon from 'react-native-vector-icons/AntDesign';
import RNPickerSelect from 'react-native-picker-select';
import { LangValue } from '../lang';
import RNRestart from 'react-native-restart';
import * as _ from 'underscore';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
class Updateprofile extends Component {
    constructor(props) {
        super(props);
        let { userData } = this.props.reducer;
        let userLatLng = [0, 0];
        if (userData.UserType == 'user') {
            userLatLng = userData.UserLocation.split(',');
        }
        let UserDistrictId=0;
        if(userData.UserDistrictName){
            UserDistrictId = userData.UserDistrictId;
        }
        this.state = {
            showTabs: true,
            userData: { ...userData, UserLat: userLatLng[0], UserLng: userLatLng[1],UserDistrictId:UserDistrictId },
            district: [],
            mapUrl: '',
            mapModelVisible: false
        }
    }
    componentDidMount() {
        //this.props.LoadingStatusChange(true);
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => { this.setState({ showTabs: false }); },
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => { this.setState({ showTabs: true }); },
        );
        this.setState({
            region: {
                latitude: this.state.userData.UserLat,
                longitude: this.state.userData.UserLng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            },
            mapUrl: `https://maps.googleapis.com/maps/api/staticmap?key=${MAP_KEY}&center=${this.state.userData.UserLat},${this.state.userData.UserLng}&zoom=16&scale=4&maptype=roadmap&size=${screenWidth - 30}x150&markers=${this.state.userData.UserLat},${this.state.userData.UserLng}`
        });
        Axios.get(`${API_URL}district.php?action=district`)
        .then(res => {
            let districtList = this.state.district;
            res.data.district.map((item,index)=>{
                districtList.push({label:item.DistrictName,value:item.DistrictId});
            });
            this.setState({ district: districtList }, () => {
                this.props.LoadingStatusChange(false);
            });
        })
        .catch(err => {
            this.props.LoadingStatusChange(false);
            console.log('District Error', err);
        });
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    _updateProfile() {
        this.props.LoadingStatusChange(true);
        let { userData } = this.state;
        console.log(userData);
        Axios.post(`${API_URL}updateprofile.php?action=updateprofile`, {
            ...userData,
        })
            .then(async res => {
                let { success, message } = res.data;
                if (success == 1) {
                    this.props.UpdateProfileData(userData);
                    await AsyncStorage.setItem("userData", JSON.stringify(userData)).then(() => {
                        this.props.LoadingStatusChange(false);
                    });
                }
                else {
                    this.props.LoadingStatusChange(false);
                }
                setTimeout(()=>{Toast.show(message, Toast.SHORT);},200);
            })
            .catch(err => {
                console.log('Update Profile Error', err);
                this.props.LoadingStatusChange(false);
            })
    }
    setLanguage = async () => {
        let { lang } = this.props.reducer;
        let changeLang = (lang == 'en') ? 'ar' : 'en';
        this.props.LoadingStatusChange(true);
        await AsyncStorage.setItem('lang', changeLang)
            .then(res => {
                this.props.SetLanguageAction(changeLang)
                this.props.LoadingStatusChange(false);
                setTimeout(() => {
                    //this.props.navigation.navigate('Home');
                    RNRestart.Restart();
                }, 100)
            })
            .catch(err => {
                console.log(err);
                this.props.LoadingStatusChange(false);
            })
    }
    render() {
        let behavior = Platform.OS == 'ios' ? 'padding' : '';
        let { navigation, reducer } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView enabled behavior={behavior} style={{ flex: 1 }}>
                    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                        <TouchableOpacity onPress={() => { navigation.navigate('Changepassword') }} style={{ marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 17, backgroundColor: COLORS.Primary, paddingVertical: 14 }}>

                                <Text style={{ fontSize: 17, color: '#FFFFFF' }}>{LangValue[reducer.lang].CHANGE_PASSWORD}</Text>
                                {
                                    reducer.lang == 'ar' &&
                                    <Icon name="left" size={18} color="#FFFFFF" />
                                }
                                {
                                    reducer.lang == 'en' &&
                                    <Icon name='right' size={18} color='#FFFFFF' />
                                }
                            </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => { this.setLanguage() }} style={{ marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 17, backgroundColor: COLORS.Primary, paddingVertical: 14 }}>

                                <Text style={{ fontSize: 17, color: '#FFFFFF' }}>{LangValue[reducer.lang].CHANGE_LANGUAGE}</Text>
                                {
                                    reducer.lang == 'ar' &&
                                    <Icon name="left" size={18} color="#FFFFFF" />
                                }
                                {
                                    reducer.lang == 'en' &&
                                    <Icon name='right' size={18} color='#FFFFFF' />
                                }
                            </View>
                        </TouchableOpacity> */}
                        <Text style={{ fontSize: 18, textAlign: (reducer.lang == 'ar' ? 'left' : 'left') }}>{LangValue[reducer.lang].PROFILE_DETAILS}</Text>
                        <View style={styles.textcontainer}>
                            <Text style={[styles.inputtext, { textAlign: (reducer.lang == 'ar' ? 'left' : 'left') }]}>{LangValue[reducer.lang].FIRST_NAME}</Text>
                            <View style={styles.textinput}>
                                <TextInput
                                    onChangeText={(txt) => this.setState({ userData: { ...this.state.userData, UserFName: txt } })}
                                    onSubmitEditing={() => { this.UserLName.focus(); }}
                                    underlineColorAndroid="transparent"
                                    keyboardType="default"
                                    autoCapitalize='none'
                                    blurOnSubmit={false}
                                    returnKeyType={"next"}
                                    value={this.state.userData.UserFName}
                                    style={[styles.textField, { textAlign: (reducer.lang == 'ar' ? 'right' : 'left') }]}
                                />
                            </View>
                            {/* First Name Ends */}
                            <Text style={[styles.inputtext, { textAlign: (reducer.lang == 'ar' ? 'left' : 'left') }]}>{LangValue[reducer.lang].LAST_NAME}</Text>
                            <View style={styles.textinput}>
                                <TextInput
                                    onChangeText={(txt) => this.setState({ userData: { ...this.state.userData, UserLName: txt } })}
                                    onSubmitEditing={() => { this.UserPhone.focus(); }}
                                    underlineColorAndroid="transparent"
                                    keyboardType="default"
                                    autoCapitalize='none'
                                    ref={(input) => { this.UserLName = input; }}
                                    blurOnSubmit={false}
                                    returnKeyType={"next"}
                                    value={this.state.userData.UserLName}
                                    style={[styles.textField, { textAlign: (reducer.lang == 'ar' ? 'right' : 'left') }]}
                                />
                            </View>
                            {/* Last Name Ends */}
                            <Text style={[styles.inputtext, { textAlign: (reducer.lang == 'ar' ? 'left' : 'left') }]}>{LangValue[reducer.lang].EMAIL_ID}</Text>
                            <View style={styles.textinput}>
                                <TextInput
                                    onChangeText={(txt) => this.setState({ userData: { ...this.state.userData, UserPhone: txt } })}
                                    onSubmitEditing={() => { this.UserPhone.focus(); }}
                                    underlineColorAndroid="transparent"
                                    keyboardType="email-address"
                                    autoCapitalize='none'
                                    ref={(input) => { this.UserEmail = input; }}
                                    blurOnSubmit={false}
                                    editable={false}
                                    returnKeyType={"next"}
                                    value={this.state.userData.UserEmail}
                                    style={[styles.textField, { textAlign: (reducer.lang == 'ar' ? 'right' : 'left') }]}
                                />
                            </View>
                            {/* Email Ends */}
                            <Text style={[styles.inputtext, { textAlign: (reducer.lang == 'ar' ? 'left' : 'left') }]}>{LangValue[reducer.lang].PHONE_NUMBER}</Text>
                            <View style={styles.textinput}>
                                <TextInput
                                    onChangeText={(txt) => this.setState({ userData: { ...this.state.userData, UserPhone: txt } })}
                                    onSubmitEditing={() => { this.UserHome.focus(); }}
                                    underlineColorAndroid="transparent"
                                    keyboardType="number-pad"
                                    autoCapitalize='none'
                                    ref={(input) => { this.UserPhone = input; }}
                                    blurOnSubmit={false}
                                    returnKeyType={"next"}
                                    value={this.state.userData.UserPhone}
                                    style={[styles.textField, { textAlign: (reducer.lang == 'ar' ? 'right' : 'left') }]}
                                />
                            </View>
                            {/* Mobile Ends */}
                            {
                                this.state.userData.UserType == 'user' &&
                                <View >
                                    <RNPickerSelect
                                        placeholder={{
                                            label: LangValue[reducer.lang].SELECT_DISTRICT,
                                            value: null,
                                            color: COLORS.Primary,
                                        }}
                                        items={this.state.district}
                                        value={this.state.userData.UserDistrictId}
                                        style={{
                                            inputIOS: {
                                                marginVertical: 15,
                                                fontSize: 15,
                                                paddingVertical: 5,
                                                borderBottomWidth: 1,
                                                borderColor: '#666666',
                                                color: '#000000',
                                                textAlign: (reducer.lang == 'ar' ? 'right' : 'left'),
                                                paddingRight: (reducer.lang == 'ar' ? 0 : 10), // to ensure the text is never behind the icon
                                                paddingLeft: (reducer.lang == 'en' ? 10 : 0), // to ensure the text is never behind the icon
                                                ...styles.textinput
                                            },
                                        }}
                                        onValueChange={value => {
                                            this.setState({ userData: { ...this.state.userData, UserDistrictId: value } });
                                        }}
                                        disabled={false}
                                    />

                                    {/* District Ends */}

                                    <Text style={[styles.inputtext, { textAlign: (reducer.lang == 'ar' ? 'left' : 'left'), }]}>{LangValue[reducer.lang].HOME_NO}</Text>
                                    <View style={styles.textinput}>
                                        <TextInput
                                            onChangeText={(txt) => this.setState({ userData: { ...this.state.userData, UserHome: txt } })}
                                            returnKeyType={"go"}
                                            onBlur={() => { Keyboard.dismiss() }}
                                            ref={(input) => { this.UserHome = input; }}
                                            blurOnSubmit={false}
                                            underlineColorAndroid="transparent"
                                            value={this.state.userData.UserHome}
                                            style={[styles.textField, { textAlign: (reducer.lang == 'ar' ? 'right' : 'left') }]}
                                        />
                                    </View>
                                    {/* Home No Ends */}

                                    <Text style={{ fontSize: 18, marginLeft: 10, marginVertical: 10, marginTop: 20, textAlign: (reducer.lang == 'ar' ? 'left' : 'left') }}>{LangValue[reducer.lang].HOME_LOCATION}</Text>
                                    <TouchableOpacity style={{ width: '100%' }} onPress={() => { this.setState({ mapModelVisible: true }) }}>
                                        {
                                            this.state.mapUrl != '' &&
                                            <Image source={{ uri: this.state.mapUrl }} style={{ width: '100%', height: 150 }} />
                                        }
                                        {/* <MapView
                                            loadingEnabled={true}
                                            userLocationAnnotationTitle={LangValue[reducer.lang].YOUR_LOCATION}
                                            showsMyLocationButton={true}
                                            paddingAdjustmentBehavior="automatic"
                                            showsUserLocation={true}
                                            style={styles.map}
                                            provider={PROVIDER_GOOGLE}
                                            toolbarEnabled={false}
                                            liteMode={true}
                                            initialRegion={{
                                                latitude: this.state.userData.UserLat,
                                                longitude: this.state.userData.UserLng,
                                                latitudeDelta: 0.015,
                                                longitudeDelta: 0.0121,
                                            }}>
                                            {
                                                <Marker
                                                    coordinate={{ latitude: this.state.userData.UserLat, longitude: this.state.userData.UserLng }} draggable={true} pinColor={COLORS.Primary}
                                                />
                                            }
                                        </MapView> */}
                                    </TouchableOpacity>
                                </View>
                            }
                            <View style={{ marginVertical: 30, alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => { this._updateProfile(); }} style={{ width: '70%', backgroundColor: COLORS.Primary, borderRadius: 50, paddingVertical: 12, ...IOSShadow }}>
                                    <Text style={styles.button}>{LangValue[reducer.lang].UPDATE_PROFILE}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                {
                    this.state.showTabs == true &&
                    <TabBar navigation={navigation} />
                }
                <Modal animationType="slide"
                    transparent={false}
                    visible={this.state.mapModelVisible} presentationStyle="formSheet">
                    <View style={{ flex: 1 }}>
                        <View style={{ height: screenHeight - 140, width: '100%' }}>
                            {
                                //typeof(this.state.userdata) != "undefined" &&
                                <MapView
                                    paddingAdjustmentBehavior="always"
                                    loadingEnabled={true}
                                    userLocationAnnotationTitle={LangValue[reducer.lang].YOUR_LOCATION}
                                    showsMyLocationButton={true}
                                    followsUserLocation={true}
                                    provider={PROVIDER_GOOGLE}
                                    showsUserLocation={true}
                                    style={styles.map}
                                    mapType="standard"
                                    loadingIndicatorColor={COLORS.Primary}
                                    initialRegion={this.state.region}
                                    onRegionChange={(region) => {
                                        this.setState({ region, userData: { ...this.state.userData, UserLat: region.latitude, UserLng: region.longitude,UserLocation:`${this.state.userData.UserLat},${this.state.userData.UserLng}`} });
                                    }}
                                >
                                    <Marker coordinate={{ latitude: this.state.userData.UserLat, longitude: this.state.userData.UserLng }} draggable onDragEnd={(e) => this.setState({ userData: { ...this.state.userData, UserLat: e.nativeEvent.coordinate.latitude, UserLng: e.nativeEvent.coordinate.longtiude } })} pinColor={COLORS.Primary} />
                                </MapView>
                            }
                        </View>
                        <TouchableOpacity style={{ position: 'absolute', bottom: 40, backgroundColor: COLORS.Primary, padding: 10, alignItems: 'center', justifyContent: 'center', width: screenWidth - 20, left: 10, right: 10, borderRadius: 5, ...IOSShadow }}
                            onPress={() => {
                                this.setState({
                                    mapModelVisible: false,
                                    mapUrl: `https://maps.googleapis.com/maps/api/staticmap?key=${MAP_KEY}&center=${this.state.userData.UserLat},${this.state.userData.UserLng}&zoom=16&scale=4&maptype=roadmap&size=${screenWidth - 30}x150&markers=${this.state.userData.UserLat},${this.state.userData.UserLng}`
                                });
                            }}>
                            <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>{LangValue[reducer.lang].SUBMIT}</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View >
        )
    }
}
const styles = StyleSheet.create({
    logoimage: {
        alignItems: 'center',
        marginVertical: 20,
    },
    textcontainer: {
        marginTop: 25,
    },
    textinput: {
        borderColor: '#CCCCCC',
        borderRadius: 10,
        paddingVertical: 2,
        borderWidth: 1,
        width: 'auto',
        paddingHorizontal: 8
    },
    textField: {
        fontSize: 16,
        color: '#232323'
    },
    inputtext: {
        paddingVertical: 5,
        color: 'gray',
        fontSize: 17
    },
    button: {
        textAlign: 'center',
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

});
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
    UpdateProfileData: (userData) => dispatch(updateProfileAction(userData)),
    SetLanguageAction: (lang) => dispatch(SetLanguageAction(lang)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Updateprofile);