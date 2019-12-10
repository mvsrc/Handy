import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS } from '../Constants';
import { connect } from 'react-redux';
import { checkAuthentication } from '../Actions';
class Splash extends Component {
    curProps = this.props
    static navigationOptions = () => {
        return { header: null }
    }
    componentDidMount = () => {
        this.curProps.navigation.addListener('willFocus', payload => {
            if (payload.action.type == "Navigation/BACK") {
                this._checkingAuth();
            }
            this._checkingAuth();
        });
    }
    _checkingAuth = async () => {
        try {
            await AsyncStorage.multiGet(['isUserLoggedIn', 'userData', 'lang']).then(async (res) => {
                if (res[0][1] == "true") {
                    if (res[1][1] != "") {
                        let lang = 'en';
                        if(res[2][1] != ''){
                            lang = res[2][1];
                        }
                        let uD = JSON.parse(res[1][1]);
                        this.curProps.checkAuth({ authorized: true, userData: uD,lang });
                        if (uD.UserType == 'provider') {
                            setTimeout(() => {
                                this.curProps.navigation.navigate('ProHome');
                            }, 100);
                        }
                        else {
                            setTimeout(() => {
                                this.curProps.navigation.navigate('Home');
                            }, 100);
                        }
                    }
                }
                else{
                    setTimeout(()=>{
                        this.curProps.checkAuth({ authorized: false, userData: null,lang:'' });
                        if(this.curProps.reducer.lang == ''){
                            setTimeout(()=>{
                                this.curProps.navigation.navigate('LanguageSelect');
                            },100);
                        }
                        else{
                            setTimeout(()=>{
                                this.curProps.navigation.navigate('Home');
                            },100);
                        }
                    },1500)
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