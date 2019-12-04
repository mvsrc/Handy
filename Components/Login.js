import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {View, Text,
    Image, ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity,
    StyleSheet, Keyboard, Platform
} from 'react-native';
import { COLORS, API_URL } from '../Constants';
import { connect } from 'react-redux';
import { actionUserSignIn, loadingChange,showWelcomeMessageAction } from '../Actions';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
        }
    }
    static navigationOptions = {
        title: 'Login',
        headerTitleStyle: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 18,
        },
    };
    _signInAsync = async () => {
        let { email, password } = this.state;
        if(email == ''){
            Toast.show('Email ID is not valid', Toast.SHORT);
            return false;
        }
        if(password == ''){
            Toast.show('Password should not be blank', Toast.SHORT);
            return false;
        }
        Keyboard.dismiss();
        this.props.LoadingStatusChange(true);
        await axios.get(`${API_URL}login.php?action=login&UserEmail=${email}&UserPass=${password}&UserToken=ios`)
            .then(async res => {
                let uD = res.data;
                if (uD.success == 1) {
                    try{
                        Toast.show(uD.message, Toast.SHORT);
                        delete uD['success'];
                        delete uD['message'];
                        this.props.LoginUserAction({...uD});
                        await AsyncStorage.multiSet([['isUserLoggedIn',"true"],["userData",JSON.stringify(uD)]]).then(()=>{
                            this.props.ShowWelcomeMessageAction(true);
                            setTimeout(()=>{
                                this.props.navigation.navigate('Home');
                            },100);
                            this.props.LoadingStatusChange(false);
                        });
                    }
                    catch(e){
                        Toast.show("Asyncstorage Reducer Saving Time",Toast.LONG);
                        console.log('Asyncstorage Reducer Saving Time',e);
                        this.props.LoadingStatusChange(false);
                    }
                }
                else{
                    Toast.show(uD.message, Toast.SHORT);
                    this.props.LoadingStatusChange(false);
                }
            })
            .catch(err => {
                this.props.LoadingStatusChange(false);
                console.log('Login Error', err);
            })
    };
    render() {
        let { navigation, reducer } = this.props;
        const behavior = (Platform.OS == 'ios') ? 'padding' : '';
        return (
            <View style={styles.main}>
                <KeyboardAvoidingView enabled behavior={behavior} style={{flex:1}}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <View style={styles.logoimage}>
                            <Image source={require('../assets/handy-logo.png')} style={{ width: '35%', height: 140, borderRadius: 20 }} />
                        </View>
                        <Text style={{ color: COLORS.Primary, marginLeft: 20, fontSize: 20, fontWeight: 'bold' }}>Welcome</Text>
                        <View style={styles.textcontainer}>
                            <View style={styles.textinput}>
                                <TextInput
                                    placeholder='Email id'
                                    placeholderTextColor='gray'
                                    onChangeText={(txt) => this.setState({ email: txt })}
                                    onSubmitEditing={() => { this.password.focus(); }}
                                    underlineColorAndroid="transparent"
                                    keyboardType="email-address"
                                    autoCapitalize='none'
                                    blurOnSubmit={false}
                                    returnKeyType={"next"}
                                    value={this.state.email}
                                    style={styles.textField}
                                />
                            </View>

                            <View style={styles.textinput}>
                                <TextInput
                                    placeholder='Password'
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
                                    style={styles.textField}
                                />
                            </View>
                            <View style={{ marginLeft: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: 20 }}>
                                {/* <CheckBox value={false} style={{ width: '10%' }} />
                                <Text style={{ fontWeight: 'bold', width: '42%' }}>Remember password</Text> */}
                                <TouchableOpacity style={{ marginRight: 15, width: '45%' }} onPress={() => { navigation.navigate('Forgatepassword') }}>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'right', }}>
                                        Forgot password?
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginVertical: 30, alignItems: 'center' }}>
                                <TouchableOpacity style={{
                                    backgroundColor: COLORS.Primary,
                                    width: 125,
                                    paddingVertical: 12,
                                    borderRadius: 20,
                                }} onPress={() => { Keyboard.dismiss(); this._signInAsync(); }}>
                                    <Text style={styles.button}>Login</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                                <Text style={{ fontSize: 17, textAlign: 'center' }}>Do not have account?</Text>
                                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('PlanService');}} style={{marginLeft:5}}><Text style={{ fontSize: 17, color: COLORS.Primary }}>Registe Here</Text></TouchableOpacity>
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
        marginTop: 30,
        paddingHorizontal:15
    },
    textinput: {
        borderBottomColor: 'gray',
        paddingVertical: 5,
        borderBottomWidth: 1,
        width: 'auto',
        marginBottom:15
    },
    textField: {
        fontSize: 20
    },
    button: {
        textAlign: 'center',

        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: 'bold'
    }

});
const mapStatetoProps = (state) => {
    const { reducer } = state;
    return { reducer };
}
const mapDispatchToProps = dispatch => ({
    LoginUserAction: (userData) => dispatch(actionUserSignIn(userData)),
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
    ShowWelcomeMessageAction:(showWelcomeMessage)=>dispatch(showWelcomeMessageAction(showWelcomeMessage))
});
export default connect(mapStatetoProps, mapDispatchToProps)(Login);