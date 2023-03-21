import React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  TextProps,
} from 'react-native'
import Text from './Text'

type ButtonProps = TouchableOpacityProps & TextProps
interface ExtendedButtonProps extends ButtonProps {
  title: string
  buttonStyle?: ViewStyle
  textStyle?: TextStyle
}

const Button: React.FC<ExtendedButtonProps> = ({
  title,
  buttonStyle,
  textStyle,
  disabled,
  ...props
}) => {
  return <TouchableOpacity {...props} style={[
    styles.button,
    disabled && styles.disabledStyle,
    buttonStyle,
  ]
  }>
    <Text {...props}
      style={
        [
          styles.buttonText,
          textStyle,
        ]
      }>
      {title}
    </Text>
  </TouchableOpacity>

};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 16,
  },
  disabledStyle: {
    opacity: 0.2,
  },
  buttonText: {
    fontSize: 17,
    color: 'white',
  },
})

export default Button;
