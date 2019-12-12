import React, { Component } from 'react';
import { StatusBar, Alert, View, I18nManager } from 'react-native';
import { COLORS } from './Constants';
import { Provider, connect } from 'react-redux';
import Store from './Store';
import MainNavigation from './Navigation';
import Loader from './Components/Loader';
import { SetLanguageAction } from './Actions';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
console.disableYellowBox = true;
class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessing: true
    }
  }
  componentDidMount = async () => {
    await AsyncStorage.getItem("lang").then((res) => {
      if (typeof (res) == 'string' && res != '') {
        this.props.SetLanguageAction(res);

      }
      this.setState({ isProcessing: false });
    });
  }
  setRTL = () => {
    if (this.props.reducer.lang == 'ar') {
      I18nManager.forceRTL(true);
    }
    else if (this.props.reducer.lang == 'en') {
      I18nManager.forceRTL(false);
    }
  }
  componentDidUpdate(prevProp) {
    if (prevProp.reducer.lang != this.props.reducer.lang) {
      this.setRTL();
    }
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={COLORS.Primary} barStyle="light-content" />
        <Loader loading={this.props.reducer.loading} />
        {
          this.state.isProcessing == false &&
          <MainNavigation screenProps={{ lang: this.props.reducer.lang }} />
        }
      </View>
    )
  }
}
const mapStateToProps = (state) => {
  const { reducer } = state
  return { reducer }
};
const mapDispatchToProps = dispatch => ({
  SetLanguageAction: (lang) => dispatch(SetLanguageAction(lang)),
});
const AppComponentConnect = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners(); //add this line
  }
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
    } else {
      this.requestPermission();
    }
  }
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }
  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      //this.showAlert(title, body);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      //this.showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      //this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      //console.log(message);
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
  render() {
    return (
      <Provider store={Store}>
        <AppComponentConnect />
      </Provider>
    )
  }
}