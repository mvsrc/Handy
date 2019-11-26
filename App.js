import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { COLORS } from './Constants';
import {Provider} from 'react-redux';
import Store from './Store';
import MainNavigation from './Navigation';
console.disableYellowBox = true;
export default class App extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <Provider store={Store}>
        <StatusBar backgroundColor={COLORS.Primary} />
        <MainNavigation screenProps={{}} />
      </Provider>
    )
  }
}