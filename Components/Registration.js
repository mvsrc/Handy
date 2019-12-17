import React, { Component } from 'react';
import {
    View, Text,
    ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity,
    StyleSheet, Keyboard, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, API_URL, IOSShadow } from '../Constants';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-simple-toast';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import CheckBox from 'react-native-check-box';
import Axios from 'axios';
import { connect } from 'react-redux';
import { actionUserSignIn, loadingChange } from '../Actions';
import Geolocation from 'react-native-geolocation-service';
import { LangValue } from '../lang';
import firebase from 'react-native-firebase';
const screenWidth = Dimensions.get('window').width;
class Registration extends Component {
    constructor(props) {
        super(props);
        this.inputRefs = {
            favSport0: null,
        };
        this.state = {
            name: '',
            lname: '',
            mob: '',
            email: '',
            password: '',
            cmpassword: '',
            district: [],
            UserDistrictName: '',
            Homeno: '',
            ATC: true,
            UserLat: 'null',
            UserLng: 'null',
            subscription: this.props.navigation.getParam('subscription'),
            hasGarbage: this.props.navigation.getParam('hasGarbage'),
        }
    }
    static navigationOptions = {
        title: 'Registration'
    };
    districtdata = () => {
        Axios.get(`${API_URL}district.php?action=district&lang=${this.props.reducer.lang}`)
            .then(res => {
                let districtList = [];
                res.data.district.map((item, index) => {
                    districtList.push({ label: item.DistrictName, value: item.DistrictId });
                })
                this.setState({ district: districtList }, () => {
                    this.props.LoadingStatusChange(false);
                });

            })
            .catch(err => {
                this.props.LoadingStatusChange(false);
                console.log('District Error', err);
            })

    }
    componentDidMount() {
        this.props.LoadingStatusChange(true);
        Geolocation.getCurrentPosition(
            (position) => {
                let { latitude, longitude } = position.coords;
                this.setState({ UserLat: latitude, UserLng: longitude }, () => {
                    this.districtdata();
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
    registerUser = async () => {
        let { lang } = this.props.reducer;
        let { name, lname, mob, email, password, cmpassword, UserDistrictName, Homeno, ATC, UserLat, UserLng, subscription, hasGarbage } = this.state;
        let subDuration = subscription.SubDuration.split(' ');
        let subDurationInteger = parseInt(subDuration[0]);
        let subDurationMonth = subDuration[1].toLowerCase();
        let todayDate = new Date();
        let StartDateString = new Date();
        let extendsMonth = todayDate.getFullYear();
        if (subDurationMonth === "month") {
            extendsMonth = todayDate.getMonth()
        }
        let endDateString = new Date(todayDate.setMonth(extendsMonth + subDurationInteger));
        let StartDay = (StartDateString.getDate() < 10) ? '0' + StartDateString.getDate() : StartDateString.getDate();
        let StartMonth = (StartDateString.getMonth() + 1 < 10) ? '0' + (StartDateString.getMonth() + 1) : StartDateString.getMonth() + 1;
        let StartDate = StartDay + '-' + StartMonth + '-' + StartDateString.getFullYear();
        //End Date
        let EndDay = (endDateString.getDate() < 10) ? '0' + endDateString.getDate() : endDateString.getDate();
        let EndMonth = (endDateString.getMonth() + 1 < 10) ? '0' + (endDateString.getMonth() + 1) : endDateString.getMonth() + 1;
        let EndDate = EndDay + '-' + EndMonth + '-' + endDateString.getFullYear();
        if (name == '') {
            Toast.show(LangValue[lang].ERROR_FIRST_NAME, Toast.SHORT);
            return false;
        }
        if (lname == '') {
            Toast.show(LangValue[lang].ERROR_LAST_NAME, Toast.SHORT);
            return false;
        }
        if (mob == '' || mob.length < 9) {
            Toast.show(LangValue[lang].ERROR_MOBILE_SHORT, Toast.SHORT);
            return false;
        }
        if (email == '') {
            Toast.show(LangValue[lang].INVALID_EMAIL, Toast.SHORT);
            return false;
        }
        if (password == '') {
            Toast.show(LangValue[lang].PASSWORD_BLANK, Toast.SHORT);
            return false;
        }
        if (password.length < 8) {
            Toast.show(LangValue[lang].PASSWORD_SHORT, Toast.SHORT);
            return false;
        }
        if (cmpassword == '') {
            Toast.show(LangValue[lang].PASSWORD_BLANK, Toast.SHORT);
            return false;
        }
        if (password != cmpassword) {
            Toast.show(LangValue[lang].ERROR_PASS_MATCH, Toast.SHORT);
            return false;
        }
        if (UserDistrictName == '') {
            Toast.show(LangValue[lang].ERROR_SELECT_DISTRICT, Toast.SHORT);
            return false;
        }
        if (Homeno == '') {
            Toast.show(LangValue[lang].ERROR_HOME_NO, Toast.SHORT);
            return false;
        }
        if (ATC == false) {
            Toast.show(LangValue[lang].ERROR_TC, Toast.SHORT);
            return false;
        }
        this.props.LoadingStatusChange(true);
        this.checkPermission();
    }
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
            Alert.alert('Please give permission for notifications');
            this.props.LoadingStatusChange(false);
        }
    }
    async getToken() {
        let { email, password } = this.state;
        await firebase.messaging().getToken().then(async fcmToken => {
            if (fcmToken) {
                let urlBuild = `${API_URL}registration.php?action=registration&UserFName=${name}&UserLName=${lname}&UserEmail=${email}&UserPhone=${mob}&UserPass=${password}&UserDistrict=${UserDistrictName}&UserHome=${Homeno}&UserLocation=${UserLat},${UserLng}&lang=${this.props.reducer.lang}`;
                console.log(urlBuild);
                await Axios.get(urlBuild)
                    .then(async res => {
                        let uD = res.data;
                        if (uD.success == 1) {
                            try {
                                Toast.show(uD.message, Toast.SHORT);
                                delete uD['success'];
                                delete uD['message'];
                                uD['UserType'] = 'user';
                                this.props.LoginUserAction({ ...uD }, fcmToken);
                                await AsyncStorage.multiSet([['isUserLoggedIn', "true"], ["userData", JSON.stringify(uD)], ["userToken", fcmToken]]).then(async () => {
                                    let subsUrlBuild = `${API_URL}getsubscription.php?action=getsubscription&SubscriptionPlanId=${subscription.SubId}&UserId=${uD.UserId}&SubscriptionAmount=${subscription.SubPrice}&GarbageCan=${hasGarbage}&SubscriptionStartDate=${StartDate}&SubscriptionEndDate=${EndDate}&lang=${this.props.reducer.lang}`;
                                    console.log(subsUrlBuild);
                                    await Axios.get(subsUrlBuild)
                                        .then(res => {
                                            if (res.data.success == 1) {
                                                setTimeout(() => {
                                                    this.props.navigation.navigate('Home');
                                                }, 100);
                                            }
                                            else {
                                                setTimeout(() => { Toast.show(res.data.message, Toast.SHORT); }, 300);
                                            }
                                            this.props.LoadingStatusChange(false);
                                        })
                                        .catch(err => {
                                            this.props.LoadingStatusChange(false);
                                            console.log('Subscritption Registration Error ', err);
                                        });
                                });
                            }
                            catch (e) {
                                console.log('Asyncstorage Reducer Saving Time', e);
                                this.props.LoadingStatusChange(false);
                                setTimeout(() => { Toast.show("Asyncstorage Reducer Saving Time", Toast.SHORT); }, 300);
                            }
                        }
                        else {
                            this.props.LoadingStatusChange(false);
                            setTimeout(() => { Toast.show(uD.message, Toast.SHORT); }, 300);
                        }
                    })
                    .catch(err => {
                        console.log('Registration Error ', err);
                        this.props.LoadingStatusChange(false);
                    })
            }
            else {
                this.props.LoadingStatusChange(false);
            }
        });
    }
    render() {
        let { lang } = this.props.reducer;
        return (
            <View style={styles.main}>
                <KeyboardAvoidingView enabled={true} style={{ flex: 1 }} behavior="padding">
                    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 30 }}>
                        <Text style={{ color: COLORS.Primary, fontSize: 22, textAlign: 'left' }}>{LangValue[lang].REGISTER_HERE}</Text>
                        <View style={styles.textcontainer}>
                            <View style={styles.textinput}>
                                <TextInput

                                    placeholder={LangValue[lang].FIRST_NAME}
                                    placeholderTextColor='gray'
                                    onChangeText={(txt) => this.setState({ name: txt })}
                                    onSubmitEditing={() => { this.lname.focus(); }}
                                    underlineColorAndroid="transparent"
                                    keyboardType="default"
                                    autoCapitalize='none'
                                    blurOnSubmit={false}
                                    returnKeyType={"next"}
                                    value={this.state.name}
                                    style={[styles.textField, { textAlign: (lang == 'ar' ? 'right' : 'left') }]}
                                />
                            </View>
                            <View style={styles.textinput}>
                                <TextInput
                                    placeholder={LangValue[lang].LAST_NAME}
                                    placeholderTextColor='gray'
                                    onChangeText={(txt) => this.setState({ lname: txt })}
                                    onSubmitEditing={() => { this.mob.focus(); }}
                                    underlineColorAndroid="transparent"
                                    keyboardType="default"
                                    autoCapitalize='none'
                                    ref={(input) => { this.lname = input; }}
                                    blurOnSubmit={false}
                                    returnKeyType={"next"}
                                    value={this.state.lname}
                                    style={[styles.textField, { textAlign: (lang == 'ar' ? 'right' : 'left') }]}
                                />
                            </View>
                            <View style={[styles.textinput, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 0 }]}>
                                <Text style={{ borderWidth: 1, borderColor: '#000000', width: '11%', textAlign: 'center' }}>+996</Text>
                                <TextInput

                                    placeholder={LangValue[lang].PHONE_NUMBER}
                                    placeholderTextColor='gray'
                                    onChangeText={(txt) => this.setState({ mob: txt })}
                                    onSubmitEditing={() => { this.email.focus(); }}
                                    underlineColorAndroid="transparent"
                                    keyboardType="phone-pad"
                                    autoCapitalize='none'
                                    ref={(input) => { this.mob = input; }}
                                    blurOnSubmit={false}
                                    returnKeyType={"next"}
                                    value={this.state.mob}
                                    style={[styles.textField, { width: '85%', borderBottomColor: '#666666', borderBottomWidth: 1, textAlign: (lang == 'ar' ? 'right' : 'left') }]}
                                />
                            </View>
                            <View style={styles.textinput}>
                                <TextInput

                                    placeholder={LangValue[lang].REGISTER_EMAIL}
                                    placeholderTextColor='gray'
                                    onChangeText={(txt) => this.setState({ email: txt })}
                                    onSubmitEditing={() => { this.password.focus(); }}
                                    underlineColorAndroid="transparent"
                                    keyboardType="email-address"
                                    autoCapitalize='none'
                                    ref={(input) => { this.email = input; }}
                                    blurOnSubmit={false}
                                    returnKeyType={"next"}
                                    value={this.state.email}
                                    style={[styles.textField, { textAlign: (lang == 'ar' ? 'right' : 'left') }]}
                                />
                            </View>
                            <View style={styles.textinput}>
                                <TextInput
                                    placeholder={LangValue[lang].REGISTER_PASSWORD}
                                    onChangeText={(txt) => this.setState({ password: txt })}
                                    placeholderTextColor='gray'
                                    returnKeyType={"next"}
                                    onSubmitEditing={() => { this.cmpassword.focus(); }}
                                    secureTextEntry={true}
                                    ref={(input) => { this.password = input; }}
                                    blurOnSubmit={false}
                                    maxLength={8}
                                    underlineColorAndroid="transparent"
                                    value={this.state.password}
                                    style={[styles.textField, { textAlign: (lang == 'ar' ? 'right' : 'left') }]}
                                />
                            </View>
                            <View style={styles.textinput}>
                                <TextInput
                                    placeholder={LangValue[lang].CONFIRM_PASSWORD}
                                    onChangeText={(txt) => this.setState({ cmpassword: txt })}
                                    placeholderTextColor='gray'
                                    returnKeyType={"go"}
                                    onSubmitEditing={() => { this.inputRefs.favSport0.togglePicker(); }}
                                    secureTextEntry={true}
                                    ref={(input) => { this.cmpassword = input; }}
                                    blurOnSubmit={false}
                                    maxLength={8}
                                    underlineColorAndroid="transparent"
                                    value={this.state.cmpassword}
                                    style={[styles.textField, { textAlign: (lang == 'ar' ? 'right' : 'left') }]}
                                />
                            </View>
                            <View style={[styles.textinput, { borderBottomWidth: 0 }]}>
                                <RNPickerSelect
                                    placeholder={{
                                        label: LangValue[lang].SELECT_DISTRICT,
                                        value: null,
                                        color: COLORS.Primary,
                                    }}
                                    items={this.state.district}
                                    value={this.state.UserDistrictName}
                                    style={{
                                        inputIOS: {
                                            fontSize: 15,
                                            paddingVertical: 5,
                                            borderBottomWidth: 1,
                                            borderColor: '#666666',
                                            color: '#000000',
                                            textAlign: (lang == 'ar' ? 'right' : 'left'),
                                            paddingRight: (lang == 'ar' ? 0 : 30), // to ensure the text is never behind the icon
                                            paddingLeft: (lang == 'en' ? 30 : 0), // to ensure the text is never behind the icon
                                        },
                                    }}
                                    onValueChange={value => {
                                        this.setState({ UserDistrictName: value });
                                    }}
                                    ref={el => {
                                        this.inputRefs.favSport0 = el;
                                    }}
                                    disabled={false}
                                />
                            </View>
                            <View style={styles.textinput}>
                                <TextInput
                                    placeholder={LangValue[lang].HOME_NO}
                                    onChangeText={(txt) => this.setState({ Homeno: txt })}
                                    placeholderTextColor='gray'
                                    returnKeyType={"go"}
                                    onBlur={() => { Keyboard.dismiss() }}
                                    ref={(input) => { this.Homeno = input; }}
                                    blurOnSubmit={false}
                                    underlineColorAndroid="transparent"
                                    value={this.state.Homeno}
                                    style={[styles.textField, { textAlign: (lang == 'ar' ? 'right' : 'left') }]}
                                />
                            </View>

                            <Text style={{ fontSize: 15, marginVertical: 10, color: 'gray', textAlign: 'left' }}>{LangValue[lang].HOME_LOCATION}</Text>

                            <View style={{ height: 300, width: '100%' }}>
                                {
                                    this.state.UserLat != 'null' &&
                                    <MapView
                                        loadingEnabled={true}
                                        userLocationAnnotationTitle={LangValue[lang].YOUR_LOCATION}
                                        showsMyLocationButton={true}
                                        paddingAdjustmentBehavior="automatic"
                                        followsUserLocation={true}
                                        provider={PROVIDER_GOOGLE}
                                        showsUserLocation={true}
                                        style={styles.map}
                                        loadingIndicatorColor={COLORS.Primary}
                                        region={{
                                            latitude: this.state.UserLat,
                                            longitude: this.state.UserLng,
                                            latitudeDelta: 0.05,
                                            longitudeDelta: 0.05,
                                        }}>
                                        <Marker coordinate={{ latitude: this.state.UserLat, longitude: this.state.UserLng }} draggable={true} pinColor={COLORS.Primary} />
                                    </MapView>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <CheckBox
                                    style={{ padding: 10, paddingLeft: 0, }}
                                    onClick={() => {
                                        this.setState({
                                            ATC: !this.state.ATC
                                        })
                                    }}
                                    isChecked={this.state.ATC}
                                    checkBoxColor={COLORS.Primary}
                                    checkedCheckBoxColor={COLORS.Primary}
                                />
                                <Text style={{ fontSize: 17 }}>{LangValue[lang].ACCEPT}</Text>
                                <Text style={{ fontSize: 17, color: COLORS.Primary, marginLeft: 5 }}>{LangValue[lang].TERM_CONDITIONS}</Text>
                            </View>
                            <View style={{ marginVertical: 30, alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => {
                                    this.registerUser();
                                }} style={[{ ...IOSShadow, backgroundColor: COLORS.Primary, width: 135, paddingVertical: 12, borderRadius: 20, }]}>
                                    <Text style={styles.button}>{LangValue[lang].REGISTER}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        flex: 1,

    },
    logoimage: {
        alignItems: 'center',
        marginVertical: 40
    },
    textcontainer: {
        marginTop: 25,
    },
    textinput: {
        borderBottomColor: 'gray',
        paddingVertical: 3,
        borderBottomWidth: 1,
        width: 'auto',
        marginBottom: 8
    },
    textField: {
        fontSize: 15
    },
    button: {
        textAlign: 'center',

        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    map: {
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
        ...StyleSheet.absoluteFillObject,
    },

});
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoginUserAction: (userData) => dispatch(actionUserSignIn(userData)),
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Registration);