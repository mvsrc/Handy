import React, { Component } from 'react';
import {
    View, Text,
    ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity,
    StyleSheet, Keyboard, Picker
} from 'react-native';
import { COLORS, API_URL, IOSShadow } from '../Constants';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-simple-toast';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import CheckBox from 'react-native-check-box';
import Axios from 'axios';
import { connect } from 'react-redux';
import { loadingChange } from '../Actions';
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
            Homeno: '',
            ATC: false,
            UserLat:0,
            UserLng:0
        }
    }
    static navigationOptions = {
        title: 'Registration',
        headerStyle: {
            backgroundColor: COLORS.Primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            marginLeft: 50,

        },
    };
    districtdata = () => {
        Axios.get(API_URL + 'district.php?action=district')
            .then(res => {
                console.log(res.data.district);
                let districtList = [];
                res.data.district.map((item,index)=>{
                    districtList.push({label:item.DistrictName,value:item.DistrictId});
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
        Geolocation.getCurrentPosition(
            (position) => {
                let {latitude,longitude} = position.coords;
                this.setState({UserLat:latitude,UserLng:longitude});
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
        this.props.LoadingStatusChange(true);
        this.districtdata();
    }
    render() {
        return (
            <View style={styles.main}>
                <KeyboardAvoidingView enabled={true} style={{flex:1}}>
                    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 30,flex:1 }}>
                        <Text style={{ color: COLORS.Primary, marginLeft: 10, fontSize: 22, fontWeight: 'bold' }}>Register Here</Text>
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
                            <View style={styles.textinput}>
                                <TextInput

                                    placeholder='Phone Number'
                                    placeholderTextColor='gray'
                                    onChangeText={(txt) => this.setState({ mob: txt })}
                                    onSubmitEditing={() => { this.email.focus(); }}
                                    underlineColorAndroid="transparent"
                                    keyboardType="number-pad"
                                    autoCapitalize='none'
                                    ref={(input) => { this.mob = input; }}
                                    blurOnSubmit={false}
                                    returnKeyType={"next"}
                                    value={this.state.mob}
                                    style={styles.textField}
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
                                    returnKeyType={"go"}
                                    onBlur={() => { Keyboard.dismiss() }}
                                    secureTextEntry={true}
                                    ref={(input) => { this.password = input; }}
                                    blurOnSubmit={false}
                                    maxLength={8}
                                    underlineColorAndroid="transparent"
                                    value={this.state.password}
                                    style={styles.textField}
                                />
                            </View>
                            <View style={[styles.textinput, { width: '100%', flexDirection: 'row', justifyContent: 'space-between',alignItems:'center' }]}>
                                <Text style={{ fontSize: 17, width: '30%' }}>Select District</Text>
                                <View style={{width:'70%'}}>
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
                                                fontSize: 16,
                                                paddingVertical: 12,
                                                paddingHorizontal: 10,
                                                borderWidth: 1,
                                                borderColor: '#666666',
                                                borderRadius: 4,
                                                color: 'black',
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
                            </View>
                            <View style={styles.textinput}>
                                <TextInput
                                    placeholder='Apartment no/Home No'
                                    onChangeText={(txt) => this.setState({ Homeno: txt })}
                                    placeholderTextColor='gray'
                                    returnKeyType={"go"}
                                    onBlur={() => { Keyboard.dismiss() }}
                                    secureTextEntry={true}
                                    ref={(input) => { this.Homeno = input; }}
                                    blurOnSubmit={false}

                                    underlineColorAndroid="transparent"
                                    value={this.state.Homeno}
                                    style={styles.textField}
                                />
                            </View>

                            <Text style={{ fontSize: 18, marginLeft: 10, marginVertical: 10 }}>Home Location</Text>

                            <View style={{ height: 150,width:'100%' }}>
                                <MapView
                                    provider={PROVIDER_GOOGLE}
                                    style={styles.map}
                                    initialRegion={{
                                        latitude: this.state.UserLat,
                                        longitude: this.state.UserLng,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}>
                                        <Marker coordinate={{latitude:this.state.UserLat,longitude:this.state.UserLng}} />
                                    </MapView>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'flex-start', alignItems: 'center' }}>
                                <CheckBox
                                    style={{ padding: 10 }}
                                    onClick={() => {
                                        this.setState({
                                            ATC: !this.state.ATC
                                        })
                                    }}
                                    isChecked={this.state.ATC}
                                    checkBoxColor={COLORS.Primary}
                                    checkedCheckBoxColor={COLORS.Primary}
                                />
                                <Text style={{ fontSize: 19 }}>Accept</Text>
                                <Text style={{ fontSize: 19, color: COLORS.Primary, marginLeft: 5 }}>Terms Conditions</Text>
                            </View>

                            <View style={{ marginVertical: 30, alignItems: 'center' }}>
                                <TouchableOpacity style={[{ ...IOSShadow, backgroundColor: COLORS.Primary, width: 135, paddingVertical: 12, borderRadius: 20, }]}>
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
        paddingVertical: 5,
        borderBottomWidth: 1,
        width: 'auto',
        marginBottom: 15
    },
    textField: {
        fontSize: 18
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
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Registration);