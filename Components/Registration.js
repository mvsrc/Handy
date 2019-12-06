import React, { Component } from 'react';
import {
    View, Text,
    ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity,
    StyleSheet, Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, API_URL, IOSShadow } from '../Constants';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-simple-toast';
import MapView, { Marker } from 'react-native-maps';
import CheckBox from 'react-native-check-box';
import Axios from 'axios';
import { connect } from 'react-redux';
import { actionUserSignIn, loadingChange } from '../Actions';
import Geolocation from 'react-native-geolocation-service';
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
            UserDistrictName:'',
            Homeno: '',
            ATC: true,
            UserLat: 'null',
            UserLng: 'null',
            subscription:this.props.navigation.getParam('subscription'),
            hasGarbage:this.props.navigation.getParam('hasGarbage'),
        }
    }
    static navigationOptions = {
        title: 'Registration'
    };
    districtdata = () => {
        Axios.get(API_URL + 'district.php?action=district')
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
                this.setState({ UserLat: latitude, UserLng: longitude },()=>{
                    this.districtdata();
                });
                
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
    registerUser = async () => {
        let {name,lname,mob,email,password,cmpassword,UserDistrictName,Homeno,ATC,UserLat,UserLng,subscription,hasGarbage} = this.state;
        let subDuration = subscription.SubDuration.split(' ');
        let subDurationInteger = parseInt(subDuration[0]);
        let subDurationMonth = subDuration[1].toLowerCase();
        let todayDate = new Date();
        let StartDateString = new Date();
        let extendsMonth = todayDate.getFullYear();
        if(subDurationMonth === "month"){
            extendsMonth = todayDate.getMonth()
        }
        let endDateString = new Date(todayDate.setMonth(extendsMonth+subDurationInteger));
        let StartDay = (StartDateString.getDate() < 10)?'0'+StartDateString.getDate():StartDateString.getDate();
        let StartMonth = (StartDateString.getMonth()+1 < 10)?'0'+(StartDateString.getMonth()+1):StartDateString.getMonth()+1;
        let StartDate = StartDay+'-'+StartMonth+'-'+StartDateString.getFullYear();
        //End Date
        let EndDay = (endDateString.getDate() < 10)?'0'+endDateString.getDate():endDateString.getDate();
        let EndMonth = (endDateString.getMonth()+1 < 10)?'0'+(endDateString.getMonth()+1):endDateString.getMonth()+1;
        let EndDate = EndDay+'-'+EndMonth+'-'+endDateString.getFullYear();
        if (name == '') {
            Toast.show('Name should not be blank', Toast.SHORT);
            return false;
        }
        if (lname == '') {
            Toast.show('Last Name should not be blank', Toast.SHORT);
            return false;
        }
        if (mob == '') {
            Toast.show('Mobile should not be blank', Toast.SHORT);
            return false;
        }
        if (email == '') {
            Toast.show('Email should not be blank', Toast.SHORT);
            return false;
        }
        if (password == '') {
            Toast.show('Password should not be blank', Toast.SHORT);
            return false;
        }
        if (cmpassword == '') {
            Toast.show('Confirm Password should not be blank', Toast.SHORT);
            return false;
        }
        if (password != cmpassword) {
            Toast.show('Password not matched', Toast.SHORT);
            return false;
        }
        if (UserDistrictName == '') {
            Toast.show('User district should not be blank', Toast.SHORT);
            return false;
        }
        if (Homeno == '') {
            Toast.show('Apartment/Home should not be blank', Toast.SHORT);
            return false;
        }
        if (ATC == false) {
            Toast.show('Please accept the Terms & Conditions', Toast.SHORT);
            return false;
        }
        this.props.LoadingStatusChange(true);
        let urlBuild =  `${API_URL}registration.php?action=registration&UserFName=${name}&UserLName=${lname}&UserEmail=${email}&UserPhone=${mob}&UserPass=${password}&UserDistrict=${UserDistrictName}&UserHome=${Homeno}&UserLocation=${UserLat},${UserLng}`;
        console.log(urlBuild);
        await Axios.get(urlBuild)
        .then(async res=>{
            let uD = res.data;
            if (uD.success == 1) {
                try{
                    Toast.show(uD.message, Toast.SHORT);
                    delete uD['success'];
                    delete uD['message'];
                    uD['UserType'] = 'user';
                    this.props.LoginUserAction({...uD});
                    await AsyncStorage.multiSet([['isUserLoggedIn',"true"],["userData",JSON.stringify(uD)]]).then( async ()=>{
                        let subsUrlBuild = `${API_URL}getsubscription.php?action=getsubscription&SubscriptionPlanId=${subscription.SubId}&UserId=${uD.UserId}&SubscriptionAmount=${subscription.SubPrice}&GarbageCan=${hasGarbage}&SubscriptionStartDate=${StartDate}&SubscriptionEndDate=${EndDate}`;
                        console.log(subsUrlBuild);
                        await Axios.get(subsUrlBuild)
                        .then(res=>{
                            if(res.data.success == 1){
                                setTimeout(()=>{
                                    this.props.navigation.navigate('Home');
                                },100);
                            }
                            else{
                                setTimeout(()=>{Toast.show(res.data.message, Toast.SHORT);},300);
                            }
                            this.props.LoadingStatusChange(false);
                        })
                        .catch(err=>{
                            this.props.LoadingStatusChange(false);
                            console.log('Subscritption Registration Error ',err);
                        });
                    });
                }
                catch(e){
                    console.log('Asyncstorage Reducer Saving Time',e);
                    this.props.LoadingStatusChange(false);
                    setTimeout(()=>{Toast.show("Asyncstorage Reducer Saving Time", Toast.SHORT);},300);
                }
            }
            else{
                this.props.LoadingStatusChange(false);
                setTimeout(()=>{Toast.show(uD.message, Toast.SHORT);},300);
            }
        })
        .catch(err=>{
            console.log('Registration Error ',err);
            this.props.LoadingStatusChange(false);
        })
    }
    render() {
        return (
            <View style={styles.main}>
                <KeyboardAvoidingView enabled={true} style={{ flex: 1 }} behavior="padding">
                    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 30 }}>
                        <Text style={{ color: COLORS.Primary, fontSize: 22 }}>Register Here</Text>
                        <View style={styles.textcontainer}>
                            <View style={styles.textinput}>
                                <TextInput

                                    placeholder='First Name'
                                    placeholderTextColor='gray'
                                    onChangeText={(txt) => this.setState({ name: txt })}
                                    onSubmitEditing={() => { this.lname.focus(); }}
                                    underlineColorAndroid="transparent"
                                    keyboardType="default"
                                    autoCapitalize='none'
                                    blurOnSubmit={false}
                                    returnKeyType={"next"}
                                    value={this.state.name}
                                    style={styles.textField}
                                />
                            </View>
                            <View style={styles.textinput}>
                                <TextInput

                                    placeholder='Last name'
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
                                    style={styles.textField}
                                />
                            </View>
                            <View style={[styles.textinput, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 0 }]}>
                                <Text style={{ borderWidth: 1, borderColor: '#000000', width: '11%', textAlign: 'center' }}>+996</Text>
                                <TextInput

                                    placeholder='Phone Number'
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
                                    style={[styles.textField, { width: '85%', borderBottomColor: '#666666', borderBottomWidth: 1 }]}
                                />
                            </View>
                            <View style={styles.textinput}>
                                <TextInput

                                    placeholder='E-mail'
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
                                    style={styles.textField}
                                />
                            </View>
                            <View style={styles.textinput}>
                                <TextInput
                                    placeholder='Password(min 8 characters)'
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
                                    style={styles.textField}
                                />
                            </View>
                            <View style={styles.textinput}>
                                <TextInput
                                    placeholder='Confirm Password'
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
                                    style={styles.textField}
                                />
                            </View>
                            <View style={[styles.textinput, { borderBottomWidth: 0 }]}>
                                <RNPickerSelect
                                    placeholder={{
                                        label: 'Select district',
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
                                            paddingRight: 30, // to ensure the text is never behind the icon
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
                                    placeholder='Apartment no/Home No'
                                    onChangeText={(txt) => this.setState({ Homeno: txt })}
                                    placeholderTextColor='gray'
                                    returnKeyType={"go"}
                                    onBlur={() => { Keyboard.dismiss() }}
                                    ref={(input) => { this.Homeno = input; }}
                                    blurOnSubmit={false}

                                    underlineColorAndroid="transparent"
                                    value={this.state.Homeno}
                                    style={styles.textField}
                                />
                            </View>

                            <Text style={{ fontSize: 15, marginVertical: 10, color: 'gray' }}>Home Location</Text>

                            <View style={{ height: 250, width: '100%' }}>
                                {
                                    this.state.UserLat != 'null' &&
                                    <MapView
                                        loadingEnabled={true}
                                        userLocationAnnotationTitle="Your Location"
                                        showsMyLocationButton={true}
                                        paddingAdjustmentBehavior="automatic"
                                        //provider={PROVIDER_GOOGLE}
                                        showsUserLocation={true}
                                        style={styles.map}
                                        region={{
                                            latitude: this.state.UserLat,
                                            longitude: this.state.UserLng,
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421,
                                        }}>
                                        <Marker coordinate={{ latitude: this.state.UserLat, longitude: this.state.UserLng }} draggable={true} pinColor={COLORS.Primary}/>
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
                                <Text style={{ fontSize: 17 }}>Accept</Text>
                                <Text style={{ fontSize: 17, color: COLORS.Primary, marginLeft: 5 }}>Terms Conditions</Text>
                            </View>

                            <View style={{ marginVertical: 30, alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => {
                                    this.registerUser();
                                }} style={[{ ...IOSShadow, backgroundColor: COLORS.Primary, width: 135, paddingVertical: 12, borderRadius: 20, }]}>
                                    <Text style={styles.button}>Register</Text>
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
    LoginUserAction: (userData) => dispatch(actionUserSignIn(userData)),
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Registration);