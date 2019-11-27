import React, { Component } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { COLORS } from './Constants';
import { Provider, connect } from 'react-redux';
import Store from './Store';
import MainNavigation from './Navigation';
import Loader from './Components/Loader';

console.disableYellowBox = true;
class AppComponent extends Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={COLORS.Primary} />
        <Loader loading={this.props.reducer.loading} />
        <MainNavigation />
        
      </SafeAreaView>
    )
  }
}
const mapStateToProps = (state) => {
  const { reducer } = state
  return { reducer }
};
const AppComponentConnect = connect(mapStateToProps)(AppComponent);
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Provider store={Store}>
        <AppComponentConnect />
      </Provider>
    )
  }
}