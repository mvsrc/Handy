import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, IOSShadow } from '../Constants';
import { connect } from 'react-redux';
import { loadingChange, SetLanguageAction } from '../Actions';
class LanguageSelect extends Component {
    static navigationOptions = () => {
        return { header: null }
    }
    componentDidMount = () => {
        this.props.navigation.addListener('willFocus', payload => {
            if (payload.action.type == "Navigation/BACK") {
            }
        });
    }
    setUserLanguage = async (lang) => {
        this.props.LoadingStatusChange(true);
        await AsyncStorage.setItem('lang', lang)
            .then(res => {
                this.props.SetLanguageAction(lang)
                setTimeout(()=>{
                    this.props.LoadingStatusChange(false);
                    this.props.navigation.navigate('Home');
                },300)
            })
            .catch(err => {
                this.props.LoadingStatusChange(false);
            })
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.Primary, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../assets/handy-logo.png')} style={{ width: 200, height: 200 }} />
                <Text style={{ fontSize: 25, color: '#FFFFFF', marginTop: 20, fontWeight: 'bold' }}>HANDY</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%', marginTop: 70 }}>
                    <TouchableOpacity onPress={()=>{this.setUserLanguage('en');}} style={{
                        backgroundColor: '#FFFFFF',
                        paddingHorizontal: 30,
                        paddingVertical: 10,
                        borderRadius: 10,
                        width: '45%',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{ fontSize: 18 }}>English</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.setUserLanguage('ar');}} style={{
                        backgroundColor: '#FFFFFF',
                        paddingHorizontal: 30,
                        paddingVertical: 10,
                        borderRadius: 10,
                        width: '45%',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{ fontSize: 18, textAlign: 'center' }}>عربي</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
    SetLanguageAction: (lang) => dispatch(SetLanguageAction(lang)),
});
export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelect);