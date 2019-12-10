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

class Forgatepassword extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        }
    }
    static navigationOptions = {
        header: null,
    };
    render() {
        let {reducer,navigation} = this.props;
        return (
            <View style={styles.main}>
                <KeyboardAvoidingView enabled>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <View style={styles.logoimage}>
                            <Image source={require('../assets/handy-logo.png')} style={{ width: '40%', height: 160, borderRadius: 20 }} />
                        </View>
                        <Text style={{ color: COLORS.Primary, marginLeft: 10, fontSize: 22, fontWeight: 'bold',textAlign:reducer.lang == 'ar'?'right':'left' }}>{LangValue[reducer.lang].FORGOT_PASSWORD}</Text>
                        <View style={styles.textcontainer}>


                            <View style={styles.textinput}>
                                <TextInput
                                    placeholder={LangValue[reducer.lang].EMAIL_ID}
                                    onChangeText={(txt) => this.setState({ email: txt })}
                                    placeholderTextColor='gray'
                                    returnKeyType={"go"}
                                    onBlur={() => { Keyboard.dismiss() }}
                                    keyboardType="email-address"
                                    ref={(input) => { this.email = input; }}
                                    blurOnSubmit={false}
                                    underlineColorAndroid="transparent"
                                    value={this.state.email}
                                    style={[styles.textField,{textAlign:(reducer.lang=='ar'?'right':'left')}]}
                                />
                            </View>

                            <View style={{ marginVertical: 30, alignItems: 'center' }}>
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.btnText}>{LangValue[reducer.lang].SUBMIT}</Text>
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
        marginHorizontal: 10
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
        width: 'auto', marginHorizontal: 10
    },
    textField: {
        fontSize: 20
    },
    button: {
         backgroundColor: COLORS.Primary,
        width: 135,
        paddingVertical: 12,
        borderRadius: 20,
    },
    btnText:{
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