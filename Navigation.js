import React, { Component } from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator, DrawerActions } from 'react-navigation-drawer';

/**** Main Screens *****/
import Splash from './Components/Splash';
/**** Drawer Screens *****/
import Home from './Components/Home';
import Myplan from "./Components/Myplan";
import Orderdetails from "./Components/Orderdetails";
import Message from "./Components/Message";
import Notification from "./Components/Notification";
import Updateprofile from "./Components/Updateprofile";
import Changepassword from "./Components/Changepassword";
import Contactus from "./Components/Contactus";
/**** Custom Drawer *****/
import Drawer from './Components/Drawer';
import TabBar from './Components/TabBar';

import { COLORS } from './Constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import SIcon from 'react-native-vector-icons/SimpleLineIcons'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import Login from './Components/Login';
import Logout from './Components/Logout';
import Registration from './Components/Registration';
import ForgotPassword from './Components/ForgotPassword';
const drawerNavigator = createDrawerNavigator({
    Home: Home,
    ['My Plan']: {
        screen: Myplan,
    },
    ['Order Detail']: {
        screen: Orderdetails,
    },
    Notification: {
        screen: Notification,
    },
    Feedback: {
        screen: Home,
    },
    ['UpdateProfile']: {
        screen: Updateprofile,
    },
    Message: {
        screen: Message,
    },
    ['Contact Us']: {
        screen: Contactus,
    },
}, {
    contentComponent: Drawer,
    initialRouteName: 'Home',
    drawerPosition: 'left',
});
const AppNavigator = createStackNavigator({
    Home: {
        screen: drawerNavigator,
        navigationOptions: ({ navigation }) => {
            let title = navigation.state.routes[navigation.state.index].key;
            if(title == 'UpdateProfile'){
                title = 'Profile';
            }
            return {
                title,
                headerLeft: () => {
                    if(navigation.state.routes[navigation.state.index].key == 'Home'){
                    return(<TouchableOpacity onPress={() => { navigation.dispatch(DrawerActions.toggleDrawer()) }} style={{ paddingLeft: 20 }}>
                        <Icon name="bars" size={25} style={{ color: '#FFFFFF' }} />
                    </TouchableOpacity>)
                    }
                    return(<TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ paddingLeft: 10 }}>
                        <MIcon name="chevron-left" size={35} style={{ color: '#FFFFFF' }} />
                    </TouchableOpacity>)
                },  // If you want to override the back button, use this.
                
            }
        }
    },
    Splash: {
        screen: Splash
    },
    Login: {
        screen: Login,
    },
    Changepassword:{
        screen:Changepassword,
        navigationOptions: ({ navigation }) => {
            return {
                title:'Change Password',
                headerLeft:()=>(
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ paddingLeft: 10 }}>
                        <MIcon name="chevron-left" size={35} style={{ color: '#FFFFFF' }} />
                    </TouchableOpacity>
                )
            }
        }
    },
    Logout: { screen: Logout },
    Registration: Registration,
    ForgotPassword: ForgotPassword
}, {
    mode: 'card',
    defaultNavigationOptions: ({ navigation }) => ({
        headerStyle: {
            backgroundColor: COLORS.Primary,
        },
        headerTintColor: '#fff',
    }),
    initialRouteName: 'Splash'
});
export default createAppContainer(AppNavigator);