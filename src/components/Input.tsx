import React from 'react'
import {
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
  TextInputProps
} from 'react-native'


const Input: React.FC<TextInputProps> = (props) => {
  return <TextInput
    {...props}
    style={[styles.input, props.style]} />
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    fontSize: 17,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 10,
  },
})

export default Input;
