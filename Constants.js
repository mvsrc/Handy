import Axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
//export const API_URL = 'http://kdoom.fundexpoinvestmentsolution.com/webservices/';

export const API_URL = 'http://stakesolution.com/handy/webservices/';
export const MAP_KEY = 'AIzaSyBICJw17y2dHRe3KG2tqi_ZRkXN4g51i8A';
export const COLORS = {
    Primary: '#29A4B3',
    Secondary: '#97c94c',
}
export const IOSShadow = {
    shadowColor: '#999999', shadowRadius: 2, shadowOpacity: 1, shadowOffset: { width: 2, height: 2 }
}
export const withLoggedIn = [
    'My Plan',
    'Order Detail',
    'Notification',
    'Feedback',
    'Update Profile',
    'Message',
    'Contact Us',
    'User'
];

export const checkingUserStatus = async (userData, userToken, lang, callBack) => {
    let canRedirect = false;
    await Axios.get(`${API_URL}login.php?action=login&UserEmail=${userData.UserEmail}&UserPass=${userData.UserPass}&token=${userToken}&lang=${lang}`)
        .then(async res => {
            let uD = res.data;
            delete uD['success'];
            delete uD['message'];
            if (uD.UserStatus == "1") {
                await AsyncStorage.setItem("userData", JSON.stringify(uD)).then(res => {
                    callBack(uD);
                    canRedirect = true;
                });
            }
            else {
                callBack(uD);
            }
        })
        .catch((err) => {
            console.log('User Status Error ',err);
            callBack(uD);
        });
        return canRedirect;
}