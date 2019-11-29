import React, { Component } from 'react';
import {
    Text, View, StyleSheet, KeyboardAvoidingView, ScrollView,
    TextInput, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, API_URL } from '../Constants';
import { connect } from 'react-redux';
import { loadingChange } from '../Actions';
import Toast from 'react-native-simple-toast';
import Axios from 'axios';
class Changepassword extends Component {
    constructor(props) {
        super(props);
        let {userData} = this.props.reducer;
        this.state = {
            UserEmail : userData.UserEmail,
            oldpassword: '',
            newpassword: '',
            confirmpassword: ''
        }
    }
    _updatePassword = ()=>{
        if(this.state.oldpassword == ''){
            Toast.show('Old Password should not be blank!');
            return false;
        }
        if(this.state.newpassword == ''){
            Toast.show('New Password should not be blank!');
            return false;
        }
        if(this.state.confirmpassword == ''){
            Toast.show('Confirm Password should not be blank!');
            return false;
        }
        if(this.state.confirmpassword != this.state.newpassword){
            Toast.show('Password does not matched should not be blank!');
            return false;
        }
        this.props.LoadingStatusChange(true);
        Axios.post(`${API_URL}changepassword.php?action=changepassword&UserEmail=${this.state.UserEmail}&UserOldPass=${this.state.oldpassword}&UserPass=${this.state.newpassword}&`,{
        })
        .then(res=>{
            let {success,message} = res.data;
            this.props.LoadingStatusChange(false);
            Toast.show(message,Toast.SHORT);
            if(success == 1){
                this.setState({oldpassword: '',newpassword: '',confirmpassword: ''});
                this.props.navigation.goBack();
            }
        })
        .catch(err=>{
            console.log('Change Password',err);
            this.props.LoadingStatusChange(false);
        })
    }
    render() {
        return (
            <View style={styles.main}>
                <KeyboardAvoidingView enabled>
                    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always">
                        <TextInput
                            onChangeText={(txt) => this.setState({ oldpassword: txt })}
                            onSubmitEditing={() => { this.newpassword.focus(); }}
                            returnKeyType="next"
                            placeholder='Old Password'
                            placeholderTextColor='#999999'
                            underlineColorAndroid="transparent"
                            style={styles.textField}
                            secureTextEntry={true}
                            value={this.state.oldpassword}
                        />
                        <TextInput
                            onChangeText={(txt) => this.setState({ newpassword: txt })}
                            onSubmitEditing={() => { this.confirmpassword.focus(); }}
                            ref={(input) => { this.newpassword = input; }}
                            returnKeyType="next"
                            placeholder='New Password'
                            placeholderTextColor='#999999'
                            underlineColorAndroid="transparent"
                            style={styles.textField}
                            secureTextEntry={true}
                            value={this.state.newpassword}
                        />
                        <TextInput
                            onChangeText={(txt) => this.setState({ confirmpassword: txt })}
                            onSubmitEditing={() => { this._updatePassword(); }}
                            ref={(input) => { this.confirmpassword = input; }}
                            returnKeyType="go"
                            placeholder='Confirm Password'
                            placeholderTextColor='#999999'
                            underlineColorAndroid="transparent"
                            style={styles.textField}
                            secureTextEntry={true}
                            value={this.state.confirmpassword}
                        />
                        <View style={{ marginTop: 30, alignItems: 'center' }}>
                            <TouchableOpacity onPress={()=>{this._updatePassword();}} style={{ width: '50%', backgroundColor: COLORS.Primary, borderRadius: 30 }}>
                                <Text style={styles.button}>Submit</Text>
                            </TouchableOpacity>
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
    container: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF'
    },
    subcontainer: {
        width: '100%',
        height: 50,
        paddingLeft: 30,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5,
        marginVertical: 10
    },
    button: {
        textAlign: 'center',
        backgroundColor: COLORS.Primary,
        paddingVertical: 12,
        borderRadius: 30,
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    textField: {
        marginBottom: 20,
        borderBottomColor: '#232323',
        borderRadius: 10,
        borderBottomWidth: 1,
        textAlign: 'left',
        paddingLeft: 5,
        fontSize: 18,
        color: 'black'
    },


});
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Changepassword);