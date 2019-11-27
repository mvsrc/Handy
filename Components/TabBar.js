import React,{Component} from 'react'
import { Image, StyleSheet, View, TouchableOpacity } from "react-native";
import { COLORS, withLoggedIn } from '../Constants';
import { connect } from 'react-redux';
class TabBar extends Component {
    constructor(props){
        super(props);
    }
    render(){
        const { navigation, reducer } = this.props;
        let isLoggedin = false;
        if (reducer.authorized == true) {
            isLoggedin = true;
        }
        return (
            <View
                style={{
                    backgroundColor: COLORS.Primary,
                    paddingVertical: 7,
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                }}
            >
                <TouchableOpacity style={styles.tabBarBtns} onPress={() => {
                    navigation.navigate('Home');
                }}>
                    <Image source={require('../assets/home.png')} style={{ height: 20, width: 21 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabBarBtns} onPress={() => {
                    let navigateTo = 'Notification';
                    if (isLoggedin == false) {
                        if (withLoggedIn.includes('Notification')) {
                            navigateTo = 'Login';
                        }
                    }
                    navigation.navigate(navigateTo);
                }}>
                    <Image source={require('../assets/well.png')} style={{ height: 20, width: 17 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabBarBtns} onPress={() => {
                    let navigateTo = 'Message';
                    if (isLoggedin == false) {
                        if (withLoggedIn.includes('Message')) {
                            navigateTo = 'Login';
                        }
                    }
                    navigation.navigate(navigateTo);
                }}>
                    <Image source={require('../assets/message.png')} style={{ height: 20, width: 28 }} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tabBarBtns,{borderRightWidth:0}]} onPress={() => {
                    let navigateTo = 'UpdateProfile';
                    if (isLoggedin == false) {
                        if (withLoggedIn.includes('User')) {
                            navigateTo = 'Login';
                        }
                    }
                    navigation.navigate(navigateTo);
                }}>
                    <Image source={require('../assets/user.png')} style={{ height: 22, width: 20 }} />
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    tabBarBtns: {
        borderRightColor: '#999999',
        borderRightWidth: 1,
        width: '25%',
        paddingVertical: 7,
        alignItems: 'center'
    }
});
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
export default connect(mapStateToProps)(TabBar);