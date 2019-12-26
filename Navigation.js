import React, { Component } from 'react';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator, DrawerActions } from 'react-navigation-drawer';
import { LangValue } from './lang';
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
    Home: {
        screen: Home,
        navigationOptions: {
            drawerLabel: 'HOME'
        }
    },
    ['My Plan']: {
        screen: Myplan,
        navigationOptions: {
            drawerLabel: 'MY_PLAN'
        }
    },
    ['Order Detail']: {
        screen: Orderdetails,
        navigationOptions: {
            drawerLabel: 'ORDER_DETAIL'
        }
    },
    Notification: {
        screen: Notification,
        navigationOptions: {
            drawerLabel: 'NOTIFICATION'
        }
    },
    Feedback: {
        screen: Feedback,
        navigationOptions: {
            drawerLabel: 'FEEDBACK'
        }
    },
    ['UpdateProfile']: {
        screen: Updateprofile,
        navigationOptions: {
            drawerLabel: 'UPDATE_PROFILE'
        }
    },
    Message: {
        screen: Message,
        navigationOptions: {
            drawerLabel: 'MESSAGE'
        }
    },
    ['Contact Us']: {
        screen: Contactus,
        navigationOptions: {
            drawerLabel: 'CONTACT_US'
        }
    },
}, {
    contentComponent: Drawer,
    initialRouteName: 'Home',
    drawerType: 'front',
});
const ProDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: ProHome,
        navigationOptions: {
            drawerLabel: 'HOME'
        }
    },
    // ['All Orders']: {
    //     screen: ProHome,
    //     navigationOptions: {
    //         drawerLabel: 'ALL_ORDERS'
    //     }
    // },
    ['Add District']: {
        screen: AddDistrict,
        navigationOptions: {
            drawerLabel: 'ADD_DISTRICT'
        }
    },
    Notification: {
        screen: Notification,
        navigationOptions: {
            drawerLabel: 'NOTIFICATION'
        }
    },
    Feedback: {
        screen: Feedback,
        navigationOptions: {
            drawerLabel: 'FEEDBACK'
        }
    },
    ['UpdateProfile']: {
        screen: Updateprofile,
        navigationOptions: {
            drawerLabel: 'UPDATE_PROFILE'
        }
    },
    Message: {
        screen: Message,
        navigationOptions: {
            drawerLabel: 'MESSAGE'
        }
    },
    ['Contact Us']: {
        screen: Contactus,
        navigationOptions: {
            drawerLabel: 'CONTACT_US'
        }
    },
    ['Garbage Can']: {
        screen: Garbagecan,
        navigationOptions: {
            drawerLabel: 'GARBAGE_CAN'
        }
    },
}, {
    contentComponent: Drawer,
    initialRouteName: 'Home',
    drawerType: 'front'
});
const AppNavigator = createStackNavigator({
    Home: {
        screen: drawerNavigator,
        navigationOptions: ({ navigation, screenProps }) => {
            let title = navigation.state.routes[navigation.state.index].key;
            if (title == 'UpdateProfile') {
                title = LangValue[screenProps.lang].PROFILE;//'Profile';
            }
            else {
                title = title.replace(' ', '_');
                title = LangValue[screenProps.lang][title.toUpperCase()];
            }
            return {
                title,
                headerLeft: () => {
                    if (navigation.state.routes[navigation.state.index].key == 'Home' && navigation.state.isDrawerOpen == false) {
                        return (<TouchableOpacity onPress={() => { navigation.dispatch(DrawerActions.toggleDrawer()) }} style={{ paddingLeft: 20 }}>
                            <Icon name="bars" size={25} style={{ color: '#FFFFFF' }} />
                        </TouchableOpacity>)
                    } else if(navigation.state.isDrawerOpen == false){
                        return (<TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ paddingLeft: 10 }}>
                            <MIcon name={screenProps.lang == 'en' ? "chevron-left" : "chevron-right"} size={35} style={{ color: '#FFFFFF' }} />
                        </TouchableOpacity>)
                    }
                    return null;
                },  // If you want to override the back button, use this.

            }
        }
    },
    ProHome: {
        screen: ProDrawerNavigator,
        navigationOptions: ({ navigation, screenProps }) => {
            let title = navigation.state.routes[navigation.state.index].key;
            if (title == 'UpdateProfile') {
                title = LangValue[screenProps.lang].PROFILE;//'Profile';
            }
            else {
                title = title.replace(' ', '_');
                title = LangValue[screenProps.lang][title.toUpperCase()];
            }
            return {
                title,
                headerLeft: () => {
                    if (navigation.state.routes[navigation.state.index].key == 'Home' && navigation.state.isDrawerOpen == false) {
                        return (<TouchableOpacity onPress={() => { navigation.dispatch(DrawerActions.toggleDrawer()) }} style={{ paddingLeft: 20 }}>
                            <Icon name="bars" size={25} style={{ color: '#FFFFFF' }} />
                        </TouchableOpacity>)
                    } else if(navigation.state.isDrawerOpen == false){
                        return (<TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ paddingLeft: 10 }}>
                            <MIcon name={screenProps.lang == 'en' ? "chevron-left" : "chevron-right"} size={35} style={{ color: '#FFFFFF' }} />
                        </TouchableOpacity>)
                    }
                    return null;
                },  // If you want to override the back button, use this.


            }
        }
    },
    Splash: {
        screen: Splash
    },
    Login: {
        screen: Login,
        navigationOptions: ({ navigation, screenProps: { lang } }) => {
            return {
                title: LangValue[lang].LOGIN,
            }
        }
    },
    Changepassword: {
        screen: Changepassword,
        navigationOptions: ({ navigation, screenProps: { lang } }) => {
            return {
                title: LangValue[lang].CHANGE_PASSWORD,
            }
        }
    },
    PlanHitory: {
        screen: PlanHistory,
        navigationOptions: ({ navigation, screenProps: { lang } }) => {
            return {
                title: 'Plan History',
            }
        }
    },
    PlanService: {
        screen: PlanService,
        navigationOptions: ({ navigation, screenProps: { lang } }) => {
            return {
                title: LangValue[lang].SERVICES
            }
        }
    },
    Logout: { screen: Logout },
    Registration: {
        screen: Registration,
        navigationOptions: ({ navigation, screenProps: { lang } }) => {
            return {
                title: LangValue[lang].REGISTER
            }
        }
    },
    ForgotPassword: {
        screen: ForgotPassword,
        navigationOptions: ({ navigation, screenProps: { lang } }) => {
            return {
                title: LangValue[lang].FORGOT_PASSWORD
            }
        }
    },
    Plangaswaterservice: {
        screen: Plangaswaterservice,
        navigationOptions: ({ navigation, screenProps: { lang } }) => {
            return {
                title: LangValue[lang].MY_PLAN
            }
        }
    },
    Paycheckout: {
        screen: Paycheckout,
        navigationOptions: ({ navigation, screenProps: { lang } }) => {
            return {
                //title: 'Checkout',
            }
        }
    },
    Productdetaile: {
        screen: Productdetaile,
        navigationOptions: ({ navigation, screenProps: { lang } }) => {
            return {
                title: LangValue[lang].PRODUCT_DETAILS
            }
        }
    },
    HomeWastage: {
        screen: Homewastage,
        navigationOptions: ({ navigation, screenProps: { lang } }) => {
            return {
                title: LangValue[lang].HOME
            }
        }
    },
    ProOrderDetails: {
        screen: ProOrderDetails,
        navigationOptions: ({ navigation, screenProps: { lang } }) => {
            return {
                title: LangValue[lang].ORDER_DETAIL
            }
        }
    },
    OrderLocation: {
        screen: OrderLocation,
        navigationOptions: ({ navigation, screenProps: { lang } }) => {
            return {
                title: 'Order Destination'
            }
        }
    },
    ProGasWaterList: {
        screen: ProGasWaterList,
        navigationOptions: ({ navigation, screenProps: { lang } }) => {
            return {
                title: LangValue[lang].HOME
            }
        }
    },
    LanguageSelect: {
        screen: LanguageSelect,
    }
}, {
    mode: 'card',
    defaultNavigationOptions: ({ navigation, screenProps }) => ({
        headerStyle: {
            backgroundColor: COLORS.Primary,
        },
        headerTintColor: '#fff',
        headerRight: (
            <TouchableOpacity onPress={() => {
                screenProps.setLanguage();
            }} style={{ paddingRight: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="language" size={20} style={{ color: '#FFFFFF' }} />
                <Text style={{ color: '#FFFFFF', marginLeft: 5,fontSize:13 }}>{(screenProps.lang == 'en') ? 'عربى':'English'  }</Text>
            </TouchableOpacity>
        ),
        headerLeft: (
            <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ paddingLeft: 10 }}>
                <MIcon name={screenProps.lang == 'en' ? "chevron-left" : "chevron-right"} size={35} style={{ color: '#FFFFFF' }} />
            </TouchableOpacity>
        )
    }),
    initialRouteName: 'Splash'
});
export default createAppContainer(AppNavigator);