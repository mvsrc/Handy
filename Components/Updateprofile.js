import React, { Component } from 'react';
import {
    Platform, View, Text,
    ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity,
    StyleSheet, Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, API_URL, IOSShadow } from '../Constants';
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
class Updateprofile extends Component {
    constructor(props) {
        super(props);
        let { userData } = this.props.reducer;
        let userLatLng = [0, 0];
        if (userData.UserType == 'user') {
            userLatLng = userData.UserLocation.split(',');
        }
        let districtList = [{ label: userData.UserDistrictName, value: userData.UserDistrictId }];
        this.state = {
            showTabs: true,
            userData: { ...userData, UserLat: userLatLng[0], UserLng: userLatLng[1] },
            district: [],
            districtList
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
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    _updateProfile() {
        this.props.LoadingStatusChange(true);
        let { userData } = this.state;
        Axios.post(`${API_URL}updateprofile.php?action=updateprofile`, {
            ...userData
        })
            .then(async res => {
                let { success, message } = res.data;
                if (success == 1) {
                    this.props.UpdateProfileData(userData);
                    Toast.show(message, Toast.SHORT);
                    await AsyncStorage.setItem("userData", JSON.stringify(userData)).then(() => {
                        this.props.LoadingStatusChange(false);
                    });
                }
                else {
                    Toast.show(message, Toast.SHORT);
                    this.props.LoadingStatusChange(false);
                }
            })
            .catch(err => {
                console.log('Update Profile Error', err);
                this.props.LoadingStatusChange(false);
            })
    }
    setLanguage = async () => {
        let {lang} = this.props.reducer;
        let changeLang = (lang == 'en')?'ar':'en';
        this.props.LoadingStatusChange(true);
        await AsyncStorage.setItem('lang', changeLang)
            .then(res => {
                this.props.SetLanguageAction(changeLang)
                this.props.LoadingStatusChange(false);
                setTimeout(()=>{
                    //this.props.navigation.navigate('Home');
                    RNRestart.Restart();
                },100)
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
                        <TouchableOpacity onPress={() => { this.setLanguage() }} style={{ marginBottom: 20 }}>
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
                        </TouchableOpacity>
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
                                        items={this.state.districtList}
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
                                                paddingRight: (reducer.lang == 'ar' ? 0 : 30), // to ensure the text is never behind the icon
                                                paddingLeft: (reducer.lang == 'en' ? 30 : 0), // to ensure the text is never behind the icon
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
                                    <View style={{ height: 250 }}>
                                        <MapView
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
                                        </MapView>
                                    </View>
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