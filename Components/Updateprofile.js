import React, { Component } from 'react';
import {
    Platform, View, Text,
    ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity,
    StyleSheet, Keyboard, Picker
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, API_URL } from '../Constants';
import Toast from 'react-native-simple-toast';
import MapView from 'react-native-maps';
import Axios from 'axios';
import { connect } from 'react-redux';
import { loadingChange, updateProfileAction } from '../Actions';
import TabBar from './TabBar';
import Icon from 'react-native-vector-icons/AntDesign';
class Updateprofile extends Component {
    constructor(props) {
        super(props);
        let { userData } = this.props.reducer;
        this.state = {
            showTabs: true,
            userData:{...userData},
            district: [],
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
        let {userData} = this.state;
        Axios.post(`${API_URL}updateprofile.php?action=updateprofile`,{
            ...userData
        })
        .then(async res=>{
            let {success,message} = res.data;
            if(success == 1){
                this.props.UpdateProfileData(userData);
                Toast.show(message,Toast.SHORT);
                await AsyncStorage.setItem("userData",JSON.stringify(userData)).then(()=>{
                    this.props.LoadingStatusChange(false);
                });
            }
            else{
                Toast.show(message,Toast.SHORT);
                this.props.LoadingStatusChange(false);
            }
        })
        .catch(err=>{
            console.log('Update Profile Error',err);
            this.props.LoadingStatusChange(false);
        })
    }
    render() {
        let behavior = Platform.OS == 'ios' ? 'padding' : '';
        let { navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView enabled behavior={behavior} style={{ flex: 1 }}>
                    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                        <TouchableOpacity onPress={() => {navigation.navigate('Changepassword') }} style={{ marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 17, backgroundColor: COLORS.Primary, paddingVertical: 14 }}>
                                <Text style={{ fontSize: 17, color: '#FFFFFF' }}>Change Password</Text>
                                <Icon name='right' size={18} color='#FFFFFF' />
                            </View>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18 }}>Profile Details</Text>
                        <View style={styles.textcontainer}>
                            <Text style={styles.inputtext}>First Name</Text>
                            <View style={styles.textinput}>
                                <TextInput
                                    onChangeText={(txt) => this.setState({ userData:{...this.state.userData,UserFName: txt} })}
                                    onSubmitEditing={() => { this.UserLName.focus(); }}
                                    underlineColorAndroid="transparent"
                                    keyboardType="default"
                                    autoCapitalize='none'
                                    blurOnSubmit={false}
                                    returnKeyType={"next"}
                                    value={this.state.userData.UserFName}
                                    style={styles.textField}
                                />
                            </View>
                            {/* First Name Ends */}
                            <Text style={styles.inputtext}>Last Name</Text>
                            <View style={styles.textinput}>
                                <TextInput
                                    onChangeText={(txt) => this.setState({ userData:{...this.state.userData,UserLName: txt} })}
                                    onSubmitEditing={() => { this.UserPhone.focus(); }}
                                    underlineColorAndroid="transparent"
                                    keyboardType="default"
                                    autoCapitalize='none'
                                    ref={(input) => { this.UserLName = input; }}
                                    blurOnSubmit={false}
                                    returnKeyType={"next"}
                                    value={this.state.userData.UserLName}
                                    style={styles.textField}
                                />
                            </View>
                            {/* Last Name Ends */}
                            <Text style={styles.inputtext}>E-mail</Text>
                            <View style={styles.textinput}>
                                <TextInput
                                    onChangeText={(txt) => this.setState({ userData:{...this.state.userData,UserPhone: txt} })}
                                    onSubmitEditing={() => { this.UserPhone.focus(); }}
                                    underlineColorAndroid="transparent"
                                    keyboardType="email-address"
                                    autoCapitalize='none'
                                    ref={(input) => { this.UserEmail = input; }}
                                    blurOnSubmit={false}
                                    editable={false}
                                    returnKeyType={"next"}
                                    value={this.state.userData.UserEmail}
                                    style={styles.textField}
                                />
                            </View>
                            {/* Email Ends */}
                            <Text style={styles.inputtext}>Mobile</Text>
                            <View style={styles.textinput}>
                                <TextInput
                                    onChangeText={(txt) => this.setState({ userData:{...this.state.userData,UserPhone: txt} })}
                                    onSubmitEditing={() => { this.UserHome.focus(); }}
                                    underlineColorAndroid="transparent"
                                    keyboardType="number-pad"
                                    autoCapitalize='none'
                                    ref={(input) => { this.UserPhone = input; }}
                                    blurOnSubmit={false}
                                    returnKeyType={"next"}
                                    value={this.state.userData.UserPhone}
                                    style={styles.textField}
                                />
                            </View>
                            {/* Mobile Ends */}
                            <View style={[styles.textinput, { marginVertical: 20 }]}>
                                <Picker
                                    mode="dropdown"
                                    selectedValue={this.state.UserDistrictId}
                                    style={{ width: '100%' }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ userData:{...this.state.userData,UserDistrictId: itemValue}  })
                                    } itemStyle={{ fontSize: 17 }}>
                                    <Picker.Item label={this.state.userData.UserDistrictName} value={this.state.userData.UserDistrictId} />
                                </Picker>

                            </View>
                            {/* District Ends */}
                            <Text style={styles.inputtext}>Apartment No/Home No</Text>
                            <View style={styles.textinput}>
                                <TextInput
                                    onChangeText={(txt) => this.setState({ userData:{...this.state.userData,UserHome: txt} })}
                                    returnKeyType={"go"}
                                    onBlur={() => { Keyboard.dismiss() }}
                                    ref={(input) => { this.UserHome = input; }}
                                    blurOnSubmit={false}
                                    underlineColorAndroid="transparent"
                                    value={this.state.userData.UserHome}
                                    style={styles.textField}
                                />
                            </View>
                            {/* Home No Ends */}
                            <Text style={{ fontSize: 18, marginLeft: 10, marginVertical: 10, marginTop: 20 }}>Home Location</Text>
                            <View style={{ height: 100 }}>
                                <MapView
                                    style={styles.map}
                                    initialRegion={{
                                        latitude: 37.78825,
                                        longitude: -122.4324,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}></MapView>
                            </View>
                            <View style={{ marginVertical: 30, alignItems: 'center' }}>
                                <TouchableOpacity onPress={()=>{this._updateProfile();}} style={{ width: '80%', backgroundColor: COLORS.Primary, borderRadius: 30 }}>
                                    <Text style={styles.button}>UPDATE PROFILE</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                {
                    this.state.showTabs == true &&
                    <TabBar navigation={navigation} />
                }
            </View>
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
        backgroundColor: COLORS.Primary,
        paddingVertical: 12,
        borderRadius: 30,
        fontSize: 20,
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
});
export default connect(mapStateToProps, mapDispatchToProps)(Updateprofile);