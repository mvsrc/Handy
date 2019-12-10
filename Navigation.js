import React, { Component } from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator, DrawerActions } from 'react-navigation-drawer';

/**** Main Screens *****/
import Splash from './Components/Splash';
import LanguageSelect from './Components/LanguageSelect';
/**** Drawer Screens *****/
import Home from './Components/Home';
import ProHome from './Components/ProHome';
import Myplan from "./Components/Myplan";
import Feedback from "./Components/Feedback";
import Orderdetails from "./Components/Orderdetails";
import AddDistrict from "./Components/AddDistrict";
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
import SIcon from 'react-native-vector-icons/SimpleLineIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
/**** Authentication Screens ****/
import Login from './Components/Login';
import Logout from './Components/Logout';
import Registration from './Components/Registration';
import ForgotPassword from './Components/ForgotPassword';
/**** Plans Screen ****/
import PlanHistory from "./Components/Planhistory";
import PlanService from "./Components/Planservice";
import Plangaswaterservice from './Components/Plangaswaterservice';
import Paycheckout from './Components/Paycheckout';
import Productdetaile from './Components/Productdetaile';


import Homewastage from './Components/Homewastage';
import OrderLocation from './Components/OrderLocation';
import ProOrderDetails from './Components/Homewastageorderdetail';
import ProGasWaterList from './Components/ProGasWaterList';
import Garbagecan from './Components/Garbagecan';
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
        screen:Feedback,
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
const ProDrawerNavigator = createDrawerNavigator({
    Home: ProHome,
    ['All Orders']: {
        screen: ProHome,
    },
    ['Add District']:{
        screen:AddDistrict
    },
    Notification: {
        screen: Notification,
    },
    Feedback: {
        screen:Feedback,
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
    ['Garbage Can']: {
        screen: Garbagecan,
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
    ProHome:{
        screen: ProDrawerNavigator,
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
    PlanHitory:{
        screen:PlanHistory,
        navigationOptions: ({ navigation }) => {
            return {
                title:'Plan History',
                headerLeft:()=>(
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ paddingLeft: 10 }}>
                        <MIcon name="chevron-left" size={35} style={{ color: '#FFFFFF' }} />
                    </TouchableOpacity>
                )
            }
        }
    },
    PlanService:{
        screen:PlanService,
        navigationOptions: ({ navigation }) => {
            return {
                title:'Service',
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
    ForgotPassword: ForgotPassword,
    Plangaswaterservice:{
        screen:Plangaswaterservice,
        navigationOptions: ({ navigation }) => {
            return {
                title:'My plan',
                headerLeft:()=>(
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ paddingLeft: 10 }}>
                        <MIcon name="chevron-left" size={35} style={{ color: '#FFFFFF' }} />
                    </TouchableOpacity>
                )
            }
        }
    },
    Paycheckout:{
        screen:Paycheckout,
        navigationOptions: ({ navigation }) => {
            return {
                title:'Checkout',
                headerLeft:()=>(
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ paddingLeft: 10 }}>
                        <MIcon name="chevron-left" size={35} style={{ color: '#FFFFFF' }} />
                    </TouchableOpacity>
                )
            }
        }
    },
    Productdetaile:{
        screen:Productdetaile,
        navigationOptions: ({ navigation }) => {
            return {
                title:'Product Details',
                headerLeft:()=>(
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ paddingLeft: 10 }}>
                        <MIcon name="chevron-left" size={35} style={{ color: '#FFFFFF' }} />
                    </TouchableOpacity>
                )
            }
        }
    },
    HomeWastage:{
        screen:Homewastage,
        navigationOptions: ({ navigation }) => {
            return {
                title:'Home',
                headerLeft:()=>(
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ paddingLeft: 10 }}>
                        <MIcon name="chevron-left" size={35} style={{ color: '#FFFFFF' }} />
                    </TouchableOpacity>
                )
            }
        }
    },
    ProOrderDetails:{
        screen:ProOrderDetails,
        navigationOptions: ({ navigation }) => {
            return {
                title:'Order Details',
                headerLeft:()=>(
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ paddingLeft: 10 }}>
                        <MIcon name="chevron-left" size={35} style={{ color: '#FFFFFF' }} />
                    </TouchableOpacity>
                )
            }
        }
    },
    OrderLocation:{
        screen:OrderLocation,
        navigationOptions: ({ navigation }) => {
            return {
                title:'Order Destination',
                headerLeft:()=>(
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ paddingLeft: 10 }}>
                        <MIcon name="chevron-left" size={35} style={{ color: '#FFFFFF' }} />
                    </TouchableOpacity>
                )
            }
        }
    },
    ProGasWaterList:{
        screen:ProGasWaterList,
        navigationOptions: ({ navigation }) => {
            return {
                title:'Home',
                headerLeft:()=>(
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ paddingLeft: 10 }}>
                        <MIcon name="chevron-left" size={35} style={{ color: '#FFFFFF' }} />
                    </TouchableOpacity>
                )
            }
        }
    },
    LanguageSelect:{
        screen:LanguageSelect,
    }
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