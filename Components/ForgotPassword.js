import React, { Component } from 'react';
import {
    View, Text,
    Image, ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity,
    StyleSheet, Keyboard
} from 'react-native';
import { COLORS, API_URL, IOSShadow } from '../Constants';
import { connect } from 'react-redux';
import { loadingChange } from '../Actions';
import { LangValue } from '../lang';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
class Forgatepassword extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showingForgotPassword: true,
            forgotEmail: '',
            serverOtp: '',
            otp: '',
            newPass: '',
            confirmPass: ''
        }
        this.forgotPasswordSubmit = this._forgotPasswordSubmit.bind(this);
        this.generatePassword = this._generatePassword.bind(this);
    }
    _forgotPasswordSubmit = () => {
        let { reducer } = this.props;
        let { forgotEmail } = this.state;
        if (forgotEmail == '') {
            Toast.show(LangValue[reducer.lang].INVALID_EMAIL, Toast.SHORT);
            return false;
        }
        Keyboard.dismiss();
        this.props.LoadingStatusChange(true);
        axios.get(`${API_URL}forgotpassword.php?action=forgotpassword&UserEmail=${forgotEmail}&lang=${this.props.reducer.lang}`)
            .then(res => {
                console.log(res.data);
                let { success, message, otp } = res.data;
                if (success == 1) {
                    this.setState({ serverOtp: otp, showingForgotPassword: false }, () => {
                        this.props.LoadingStatusChange(false);
                    });
                }
                setTimeout(() => { Toast.show(message, Toast.SHORT); }, 200);
            })
            .catch(err => {
                console.log(err);
                setTimeout(() => { Toast.show(LangValue[reducer.lang].INTERNAL_ERROR, Toast.SHORT); }, 200);
                this.props.LoadingStatusChange(false);
            });
    }
    _generatePassword = () => {
        let { reducer, navigation } = this.props;
        let { otp, newPass, confirmPass, serverOtp, forgotEmail } = this.state;
        if (otp == '') {
            Toast.showWithGravity(LangValue[reducer.lang].INCORRECT_OTP, Toast.SHORT, Toast.CENTER);
            return false;
        }
        if (otp != serverOtp) {
            Toast.showWithGravity(LangValue[reducer.lang].WRONG_OTP, Toast.SHORT, Toast.CENTER);
            return false;
        }
        if (newPass == '') {
            Toast.showWithGravity(LangValue[reducer.lang].PASSWORD_BLANK, Toast.SHORT, Toast.CENTER);
            return false;
        }
        if (newPass.length < 8) {
            Toast.showWithGravity(LangValue[reducer.lang].PASSWORD_SHORT, Toast.SHORT, Toast.CENTER);
            return false;
        }
        if (confirmPass == '') {
            Toast.showWithGravity(LangValue[reducer.lang].PASSWORD_BLANK, Toast.SHORT, Toast.CENTER);
            return false;
        }
        this.props.LoadingStatusChange(true);
        axios.get(`${API_URL}generatepassword.php?action=generatepassword&UserEmail=${forgotEmail}&UserPass=${newPass}&lang=${this.props.reducer.lang}`)
            .then(res => {
                console.log(res.data);
                let { success, message } = res.data;
                if(success == 1){
                    navigation.navigate('Home');
                }
                setTimeout(() => { Toast.show(message, Toast.SHORT); }, 200);
                this.props.LoadingStatusChange(false);
            })
            .catch(err => {
                console.log(err);
                setTimeout(() => { Toast.show(LangValue[reducer.lang].INTERNAL_ERROR, Toast.SHORT); }, 200);
                this.props.LoadingStatusChange(false);
            });
    }
    render() {
        let { reducer, navigation } = this.props;
        return (
            <View style={styles.main}>
                <KeyboardAvoidingView enabled>
                    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 15 }}>
                        {
                            this.state.showingForgotPassword == true &&
                            <View style={{ marginTop: 20 }}>
                                <View style={styles.logoimage}>
                                    <Image source={require('../assets/handy-logo.png')} style={{ width: '40%', height: 160, borderRadius: 20 }} />
                                </View>
                                <Text style={{ color: COLORS.Primary, marginLeft: 10, fontSize: 22, fontWeight: 'bold', textAlign: reducer.lang == 'ar' ? 'right' : 'left' }}>{LangValue[reducer.lang].FORGOT_PASSWORD}</Text>
                                <View style={styles.textcontainer}>
                                    <View style={styles.textinput}>
                                        <TextInput
                                            placeholder={LangValue[reducer.lang].EMAIL_ID}
                                            onChangeText={(txt) => this.setState({ forgotEmail: txt })}
                                            placeholderTextColor='gray'
                                            returnKeyType={"go"}
                                            onBlur={() => { Keyboard.dismiss() }}
                                            keyboardType="email-address"
                                            ref={(input) => { this.forgotEmail = input; }}
                                            blurOnSubmit={false}
                                            underlineColorAndroid="transparent"
                                            value={this.state.forgotEmail}
                                            style={[styles.textField, { textAlign: (reducer.lang == 'ar' ? 'right' : 'left') }]}
                                        />
                                    </View>
                                    <View style={{ marginVertical: 30, alignItems: 'center' }}>
                                        <TouchableOpacity style={styles.button} onPress={() => { this.forgotPasswordSubmit() }}>
                                            <Text style={styles.btnText}>{LangValue[reducer.lang].SUBMIT}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        }
                        {
                            this.state.showingForgotPassword == false &&
                            <View style={{ marginTop: 20 }}>
                                <View style={styles.logoimage}>
                                    <Text style={{ fontSize: 17, color: '#222222' }}>{LangValue[reducer.lang].GENERATE_PASSWORD}</Text>
                                    <Text style={{ fontSize: 15, color: '#666666', marginTop: 20 }}>{LangValue[reducer.lang].OTP_SENT_TO_EMAIL}</Text>
                                </View>
                                <View style={styles.textcontainer}>
                                    <View style={styles.textinput}>
                                        <TextInput
                                            placeholder='OTP'
                                            onChangeText={(txt) => this.setState({ otp: txt })}
                                            placeholderTextColor='gray'
                                            returnKeyType={"next"}
                                            onSubmitEditing={() => { this.newPass.focus() }}
                                            keyboardType="email-address"
                                            ref={(input) => { this.otp = input; }}
                                            blurOnSubmit={false}
                                            underlineColorAndroid="transparent"
                                            value={this.state.otp}
                                            style={[styles.textField, { textAlign: (reducer.lang == 'ar' ? 'right' : 'left') }]}
                                        />
                                    </View>
                                    <View style={styles.textinput}>
                                        <TextInput
                                            placeholder={LangValue[reducer.lang].NEW_PASSWORD}
                                            onChangeText={(txt) => this.setState({ newPass: txt })}
                                            placeholderTextColor='gray'
                                            returnKeyType={"next"}
                                            onSubmitEditing={() => { this.confirmPass.focus() }}
                                            keyboardType="email-address"
                                            ref={(input) => { this.newPass = input; }}
                                            blurOnSubmit={false}
                                            underlineColorAndroid="transparent"
                                            value={this.state.newPass}
                                            secureTextEntry={true}
                                            style={[styles.textField, { textAlign: (reducer.lang == 'ar' ? 'right' : 'left') }]}
                                        />
                                    </View>
                                    <View style={styles.textinput}>
                                        <TextInput
                                            placeholder={LangValue[reducer.lang].CONFIRM_PASSWORD}
                                            onChangeText={(txt) => this.setState({ confirmPass: txt })}
                                            placeholderTextColor='gray'
                                            returnKeyType={"go"}
                                            onBlur={() => { Keyboard.dismiss() }}
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                            keyboardType="email-address"
                                            ref={(input) => { this.confirmPass = input; }}
                                            blurOnSubmit={false}
                                            underlineColorAndroid="transparent"
                                            value={this.state.confirmPass}
                                            secureTextEntry={true}
                                            style={[styles.textField, { textAlign: (reducer.lang == 'ar' ? 'right' : 'left') }]}
                                        />
                                    </View>
                                    <View style={{ marginVertical: 30, alignItems: 'center' }}>
                                        <TouchableOpacity style={styles.button} onPress={() => { this.generatePassword() }}>
                                            <Text style={styles.btnText}>{LangValue[reducer.lang].SUBMIT}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        }
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
    },
    textinput: {
        borderBottomColor: 'gray',
        paddingVertical: 4,
        borderBottomWidth: 1.5,
        width: 'auto',
        marginHorizontal: 10,
        marginBottom: 20
    },
    textField: {
        fontSize: 20
    },
    button: {
        backgroundColor: COLORS.Primary,
        width: 135,
        paddingVertical: 12,
        borderRadius: 20,
        ...IOSShadow
    },
    btnText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: 'bold'
    }
});
const mapStatetoProps = (state) => {
    const { reducer } = state;
    return { reducer };
}
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStatetoProps, mapDispatchToProps)(Forgatepassword);