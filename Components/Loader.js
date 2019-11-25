import React, { Component } from 'react';
import { COLORS } from '../Constants';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator
} from 'react-native';

const Loader = props => {
  const {
    loading,
    ...attributes
  } = props;
  console.log('lodding',loading);
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {console.log('close modal')}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large"  color={COLORS.Primary}
            animating={loading} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});

export default Loader;