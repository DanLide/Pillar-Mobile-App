import React, { memo } from 'react';
import { TouchableOpacityProps, TouchableOpacity } from 'react-native';
import { IconProps } from 'react-native-vector-icons/Icon';
import Icon from 'react-native-vector-icons/MaterialIcons';

export type IconButtonProps = TouchableOpacityProps &
  Pick<IconProps, 'name' | 'size' | 'color'>;

const HIT_SLOP: TouchableOpacityProps['hitSlop'] = {
  bottom: 16,
  left: 16,
  right: 16,
  top: 16,
};

const IconButton: React.FC<IconButtonProps> = ({
  name,
  size,
  color,
  ...props
}) => {
  return (
    <TouchableOpacity hitSlop={HIT_SLOP} {...props}>
      <Icon name={name} size={size} color={color} />
    </TouchableOpacity>
  );
};

export default memo(IconButton);
