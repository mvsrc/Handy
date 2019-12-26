import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
    View, Text,
    Image, ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity,
    StyleSheet, Keyboard, Platform, Alert
} from 'react-native';
import { COLORS, API_URL, IOSShadow } from '../Constants';
import { connect } from 'react-redux';
import { actionUserSignIn, loadingChange, showWelcomeMessageAction } from '../Actions';
import CheckBox from 'react-native-check-box';
import { LangValue } from '../lang';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import firebase from 'react-native-firebase';
import Autocomplete from 'react-native-autocomplete-input';
import * as _ from 'underscore';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            rememberPassword: false,
            credentialList: this.props.reducer.credentialList,
            query: ''
        }
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
        let { email, password, rememberPassword } = this.state;
        let { credentialList } = this.props.reducer;
        await firebase.messaging().getToken().then(async fcmToken => {
            if (fcmToken) {
                await axios.get(`${API_URL}login.php?action=login&UserEmail=${email}&UserPass=${password}&UserToken=${fcmToken}&lang=${this.props.reducer.lang}`)
                    .then(async res => {
                        let uD = res.data;
                        if (uD.success == 1) {
                            try {
                                setTimeout(() => { Toast.show(uD.message, Toast.SHORT); }, 200);
                                delete uD['success'];
                                delete uD['message'];
                                this.props.LoginUserAction({ ...uD }, fcmToken);
                                let setAsuncValues = [['isUserLoggedIn', "true"], ["userData", JSON.stringify(uD)], ["userToken", fcmToken],];
                                if (rememberPassword == true) {
                                    credentialList.push({ "username": email, "password": password });
                                    setAsuncValues.push(["credentialList", JSON.stringify(credentialList)]);
                                }
                                await AsyncStorage.multiSet(setAsuncValues).then(() => {
                                    this.props.ShowWelcomeMessageAction(true);
                                    if (uD.UserType == 'provider') {
                                        setTimeout(() => {
                                            this.props.navigation.navigate('ProHome');
                                        }, 100);
                                    }
                                    else {
                                        setTimeout(() => {
                                            this.props.navigation.navigate('Home');
                                        }, 100);
                                    }
                                    this.props.LoadingStatusChange(false);
                                });
                            }
                            catch (e) {
                                setTimeout(() => { Toast.show("Asyncstorage Reducer Saving Time", Toast.LONG); }, 200);
                                console.log('Asyncstorage Reducer Saving Time', e);
                                this.props.LoadingStatusChange(false);
                            }
                        }
                        else {
                            this.props.LoadingStatusChange(false);
                            setTimeout(() => { Toast.show(uD.message, Toast.SHORT); }, 200);
                        }
                    })
                    .catch(err => {
                        this.props.LoadingStatusChange(false);
                        console.log('Login Error', err);
                    })
            }
            else {
                await axios.get(`${API_URL}login.php?action=login&UserEmail=${email}&UserPass=${password}&UserToken=ios&lang=${this.props.reducer.lang}`)
                    .then(async res => {
                        let uD = res.data;
                        if (uD.success == 1) {
                            try {
                                setTimeout(() => { Toast.show(uD.message, Toast.SHORT); }, 200);
                                delete uD['success'];
                                delete uD['message'];
                                this.props.LoginUserAction({ ...uD }, fcmToken);
                                await AsyncStorage.multiSet([['isUserLoggedIn', "true"], ["userData", JSON.stringify(uD)], ["userToken", ios]]).then(() => {
                                    this.props.ShowWelcomeMessageAction(true);
                                    if (uD.UserType == 'provider') {
                                        setTimeout(() => {
                                            this.props.navigation.navigate('ProHome');
                                        }, 100);
                                    }
                                    else {
                                        setTimeout(() => {
                                            this.props.navigation.navigate('Home');
                                        }, 100);
                                    }
                                    this.props.LoadingStatusChange(false);
                                });
                            }
                            catch (e) {
                                setTimeout(() => { Toast.show("Asyncstorage Reducer Saving Time", Toast.LONG); }, 200);
                                console.log('Asyncstorage Reducer Saving Time', e);
                                this.props.LoadingStatusChange(false);
                            }
                        }
                        else {
                            this.props.LoadingStatusChange(false);
                            setTimeout(() => { Toast.show(uD.message, Toast.SHORT); }, 200);
                        }
                    })
                    .catch(err => {
                        this.props.LoadingStatusChange(false);
                        console.log('Login Error', err);
                    })
                this.props.LoadingStatusChange(false);
            }
        });
    }
    _signInAsync = async () => {
        Keyboard.dismiss();
        let { email, password } = this.state;
        if (email == '') {
            Toast.show(LangValue[this.props.reducer.lang].INVALID_EMAIL, Toast.SHORT);
            return false;
        }
        if (password == '') {
            Toast.show(LangValue[this.props.reducer.lang].PASSWORD_BLANK, Toast.SHORT);
            return false;
        }
        this.props.LoadingStatusChange(true);
        this.checkPermission();
    };
    findCreds(query) {
        if (query === '') {
            return [];
        }

        const { credentialList } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        let list = credentialList.filter(cL => cL.username.search(regex) >= 0);
        return list;
    }
    render() {
        let { navigation, reducer } = this.props;
        const { email } = this.state;
        const credentialList = this.findCreds(email);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        return (
            <View style={styles.main}>
                <KeyboardAvoidingView enabled behavior='padding' style={{ flex: 1 }}>
                    <ScrollView keyboardShouldPersistTaps="always">
                        <View style={styles.logoimage}>
                            <Image source={require('../assets/handy-logo.png')} style={{ width: 140, height: 140 }} />
                        </View>
                        <Text style={{ color: COLORS.Primary, marginLeft: 20, fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>{LangValue[reducer.lang].WELCOME}</Text>
                        <View style={styles.textcontainer}>
                            <View style={[styles.textinput,{zIndex:5}]}>
                                <Autocomplete
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    containerStyle={{borderWidth:0}}
                                    inputContainerStyle={{borderWidth:0,backgroundColor:'#FFFFFF'}}
                                    listContainerStyle={{backgroundColor:'#FFFFFF',borderColor:'gray'}}
                                    data={credentialList.length === 1 && comp(email, credentialList[0].username) ? [] : credentialList}
                                    defaultValue={email}
                                    onChangeText={text => this.setState({ email: text })}
                                    placeholder={LangValue[reducer.lang].EMAIL_ID}
                                    renderTextInput={() => (
                                        <TextInput
                                            placeholder={LangValue[reducer.lang].EMAIL_ID}
                                            placeholderTextColor='gray'
                                            onChangeText={(txt) => this.setState({ email: txt })}
                                            onSubmitEditing={() => { this.password.focus(); }}
                                            underlineColorAndroid="transparent"
                                            keyboardType="email-address"
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            blurOnSubmit={false}
                                            returnKeyType={"next"}
                                            value={this.state.email}
                                            style={[styles.textField, { textAlign: (reducer.lang == 'ar' ? 'right' : 'left') }]}
                                        />
                                    )}
                                    renderItem={({ item: { username, password } }) => {
                                        return (
                                            <TouchableOpacity style={{backgroundColor:'#FFFFFF'}} onPress={() => this.setState({ password, email: username })}>
                                                <Text style={[styles.itemText,{textAlign:"left"}]}>
                                                    {username}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />

                            </View>

                            <View style={styles.textinput}>
                                <TextInput
                                    placeholder={LangValue[reducer.lang].PASSWORD}
                                    onChangeText={(txt) => this.setState({ password: txt })}
                                    placeholderTextColor='gray'
                                    returnKeyType={"go"}
                                    onBlur={() => { Keyboard.dismiss(); }}
                                    onSubmitEditing={() => { Keyboard.dismiss(); this._signInAsync() }}
                                    secureTextEntry={true}
                                    ref={(input) => { this.password = input; }}
                                    blurOnSubmit={false}
                                    underlineColorAndroid="transparent"
                                    value={this.state.password}
                                    style={[styles.textField, { textAlign: (reducer.lang == 'ar' ? 'right' : 'left') }]}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <CheckBox
                                        style={{ padding: 7, paddingLeft: 0, }}
                                        onClick={() => {
                                            this.setState({
                                                rememberPassword: !this.state.rememberPassword
                                            })
                                        }}
                                        isChecked={this.state.rememberPassword}
                                        checkBoxColor={COLORS.Primary}
                                        checkedCheckBoxColor={COLORS.Primary}
                                    />
                                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{LangValue[reducer.lang].REMEMBER_PASSWORD}</Text>
                                </View>
                                <TouchableOpacity style={{ width: '45%' }} onPress={() => { navigation.navigate('ForgotPassword') }}>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'right', fontSize: 14 }}>
                                        {LangValue[reducer.lang].FORGOT_PASSWORD}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginVertical: 30, alignItems: 'center' }}>
                                <TouchableOpacity style={{
                                    backgroundColor: COLORS.Primary,
                                    width: 125,
                                    paddingVertical: 12,
                                    borderRadius: 20,
                                    ...IOSShadow
                                }} onPress={() => { Keyboard.dismiss(); this._signInAsync(); }}>
                                    <Text style={styles.button}>{LangValue[reducer.lang].LOGIN}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                                <Text style={{ fontSize: 17, textAlign: 'center' }}>{LangValue[reducer.lang].DO_NOT_HAVE_ACCOUNT}</Text>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('PlanService'); }} style={{ marginLeft: 5 }}><Text style={{ fontSize: 17, color: COLORS.Primary }}>{LangValue[reducer.lang].REGISTER_HERE}</Text></TouchableOpacity>
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
        justifyContent: 'center',
        marginVertical: 40
    },
    textcontainer: {
        marginTop: 30,
        paddingHorizontal: 15
    },
    textinput: {
        borderBottomColor: 'gray',
        paddingVertical: 5,
        borderBottomWidth: 1,
        width: 'auto',
        marginBottom: 15
    },
    textField: {
        fontSize: 20
    },
    button: {
        textAlign: 'center',

        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    itemText: {
        fontSize: 20,
        padding: 5
    },
});
const mapStatetoProps = (state) => {
    const { reducer } = state;
    return { reducer };
}
const mapDispatchToProps = dispatch => ({
    LoginUserAction: (userData) => dispatch(actionUserSignIn(userData)),
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
    ShowWelcomeMessageAction: (showWelcomeMessage) => dispatch(showWelcomeMessageAction(showWelcomeMessage))
});
export default connect(mapStatetoProps, mapDispatchToProps)(Login);