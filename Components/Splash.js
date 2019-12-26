import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS } from '../Constants';
import { connect } from 'react-redux';
import { checkAuthentication, setUsernamePasswordAction } from '../Actions';
import { LangValue } from '../lang';
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
            await AsyncStorage.multiGet(['isUserLoggedIn', 'userData', 'lang', 'credentialList']).then(async (res) => {
                if (res[0][1] == "true") {
                    if (res[1][1] != "") {
                        let lang = 'en';
                        if (res[2][1] != '') {
                            lang = res[2][1];
                        }
                        let uD = JSON.parse(res[1][1]);
                        this.curProps.checkAuth({ authorized: true, userData: uD, lang });
                        let credentialList = JSON.parse(res[3][1]);
                        credentialList = (credentialList && credentialList !== 'null' && credentialList !== 'undefined')?credentialList:[];
                        this.props.setUsernamePassword(credentialList);
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
                else {
                    setTimeout(() => {
                        let credentialList = JSON.parse(res[3][1]);
                        credentialList = (credentialList && credentialList !== 'null' && credentialList !== 'undefined')?credentialList:[];
                        this.props.setUsernamePassword(credentialList);
                        if (this.props.reducer.isRTL == true) {
                            this.curProps.navigation.navigate('Home');
                        }
                        else {
                            this.curProps.checkAuth({ authorized: false, userData: null, lang: 'en' });
                            setTimeout(() => {
                                this.curProps.navigation.navigate('LanguageSelect');
                            }, 200)
                        }
                    }, 1500)
                }
            });
        }
        catch (e) {
            console.log('Asyncstorage Reducer Getting Time', e);
        }
    }
    render() {
        let { lang } = this.props.reducer;
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.Primary, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../assets/handy-logo.png')} style={{ width: 200, height: 200 }} />
                <Text style={{ fontSize: 25, color: '#FFFFFF', marginTop: 20, fontWeight: 'bold' }}>{LangValue[lang].HANDY}</Text>
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
    setUsernamePassword: (credentialList) => dispatch(setUsernamePasswordAction(credentialList))
});
export default connect(mapStateToProps, mapDispatchToProps)(Splash);