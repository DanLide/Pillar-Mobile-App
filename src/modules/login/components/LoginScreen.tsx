import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Button } from 'react-native'
import LoginForm from './LoginForm'
import LoginQR from './LoginQR'
import { Text } from '../../../components'

const LoginScreen = () => {
  const [isForm, setIsForm] = useState(false)
  const [test, setIsTest] = useState(true)


  const onPressQr = () => {
    setIsForm(false)
  }

  const onPressForm = () => {
    setIsForm(true)
  }

  return <View style={styles.container}>
    <View style={styles.switchContainer}>
      <TouchableOpacity onPress={onPressQr}>
        <Text style={styles.switchText}>
          QR
        </Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity onPress={onPressForm}>
        <Text style={styles.switchText}>
          Form
        </Text>
      </TouchableOpacity>
    </View>
    {
      isForm ? (
        test && <LoginForm onPress={() => {
          setIsTest(false)
        }} />
      )
        : <LoginQR />
    }
    <Button title='show login' onPress={() => {
      setIsTest(true)
    }} />
  </View>
};

const styles = StyleSheet.create({
  input: {
    margin: 15,
  },
  switchButton: {

  },
  switchText: {
    justifyContent: 'center',
    paddingVertical: 20,
    fontSize: 15,
    width: 90,
    textAlign: 'center',
  },
  separator: {
    width: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
  },
  switchContainer: {
    marginTop: 15,
    marginBottom: '40%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'gray',
    borderRadius: 20,
  },

  buttonStyle: {
    marginTop: 20,
    marginHorizontal: 20,
  }
})

export default LoginScreen;
