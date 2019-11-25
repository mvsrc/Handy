import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator, DrawerActions } from 'react-navigation-drawer';

/**** Main Screens *****/
import Splash from './Components/Splash';
/**** Drawer Screens *****/
import Home from './Components/Home';

/**** Custom Drawer *****/
import Drawer from './Components/Drawer';

import { COLORS } from './Constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SIcon from 'react-native-vector-icons/SimpleLineIcons'
import MIcon from 'react-native-vector-icons/MaterialIcons'
const drawerNavigator = createDrawerNavigator({
    Home: {
        screen: Home,
    },
    ['My Plan']: {
        screen: Home,
    },
    ['Order Detail']: {
        screen: Home,
    },
    Notification: {
        screen: Home,
    },
    Feedback: {
        screen: Home,
    },
    ['Update Profile']: {
        screen: Home,
    },
    Message: {
        screen: Home,
    },
    ['Contact Us']: {
        screen: Home,
    },
    Login: {
        screen: Home,
    },
}, {
    contentComponent:Drawer,
    initialRouteName: 'Home',
    drawerPosition: 'left',
    backBehavior:'none'
});
const AppNavigator = createStackNavigator({
    Home: {
        screen: drawerNavigator,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: navigation.state.routeName,
                headerLeft: <TouchableOpacity onPress={() => { navigation.dispatch(DrawerActions.toggleDrawer()) }} style={{ paddingLeft: 20 }}>
                    <SIcon name="menu" size={25} style={{ color: '#FFFFFF' }} />
                </TouchableOpacity>,  // If you want to override the back button, use this.
                headerRight: <TouchableOpacity style={{ paddingRight: 20 }}>
                    {/* <Icon name="user-circle" size={25} style={{ color: '#FFFFFF' }} /> */}
                </TouchableOpacity>,
                headerTitleContainerStyle: {
                    alignItems: 'center',
                    justifyContent: 'center',
                },
            }
        }
    },
    Splash: {
        screen: Splash
    }
}, {
    headerMode: 'float',
    defaultNavigationOptions: ({ navigation }) => ({
        headerStyle: {
            backgroundColor: COLORS.Primary,
        },
        headerTintColor: '#fff',
    }),
    initialRouteName: 'Splash'
});
export default createAppContainer(AppNavigator);