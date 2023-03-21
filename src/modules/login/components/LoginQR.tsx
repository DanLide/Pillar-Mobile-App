import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Scanner } from '../../../components'

const LoginQR = () => {

  return <Scanner isCamera onRead={() => { }} onPressClose={() => { }} />
};

const styles = StyleSheet.create({
  input: {
    margin: 15,
  },
  container: {
    justifyContent: 'center',
  },
  buttonStyle: {
    marginTop: 20,
    marginHorizontal: 20,
  }
})

export default LoginQR;
