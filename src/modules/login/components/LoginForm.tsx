import React, { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button } from '../../../components'
import LoginFormStore from '../stores/LoginFormStore';
import { observer } from 'mobx-react';
// import LoginFormStore 

const LoginForm = ({ onPress }) => {
  const store = useRef(new LoginFormStore({})).current
  // const [value, setValue] = useState('')
  return <View style={styles.container}>
    <Input
      style={styles.input}
      placeholder={'login'}
      value={
        store.login
      }
      onChangeText={(value) => {
        store.setLogin(value)
      }}
    />
    <Input style={styles.input} placeholder={'password'} />
    <Button title='Submit' buttonStyle={styles.buttonStyle} onPress={onPress} />
  </View>
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

export default observer(LoginForm)
