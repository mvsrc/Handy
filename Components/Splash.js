import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS } from '../Constants';
import { connect } from 'react-redux';
import { checkAuthentication } from '../Actions';
class Splash extends Component {
    static navigationOptions = () => {
        return { header: null }
    }
    componentDidMount = () => {
        this.props.navigation.addListener('willFocus', payload => {
            if(payload.action.type == "Navigation/BACK"){
                this._checkingAuth();
            }
        });
        this._checkingAuth();
    }
    _checkingAuth = async () => {
        try {
            await AsyncStorage.getItem('isUserLoggedIn').then(async (res) => {
                if (res == "true") {
                    await AsyncStorage.getItem('userData').then((userData) => {
                        if (userData != "") {
                            this.props.checkAuth({ authorized: true, userData: JSON.parse(userData) });
                            setTimeout(()=>{
                                this.props.navigation.navigate('Home');
                            },100);
                        }
                    });
                }
                else {
                    this.props.checkAuth({ authorized: false, userData: null });
                    setTimeout(()=>{
                        this.props.navigation.navigate('Home');
                    },100);
                }
            });
        }
        catch (e) {
            console.log('Asyncstorage Reducer Getting Time', e);
        }
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.Primary, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../assets/handy-logo.png')} style={{ width: 200, height: 200 }} />
                <Text style={{ fontSize: 25, color: '#FFFFFF', marginTop: 20, fontWeight: 'bold' }}>HANDY</Text>
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    checkAuth: (dataSet) => dispatch(checkAuthentication(dataSet)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Splash);