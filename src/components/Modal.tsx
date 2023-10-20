import React, { useMemo } from 'react';
import {
  Modal as RNModal,
  StyleSheet,
  Text,
  View,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { colors, fonts, SVGs } from '../theme';
import { InfoTitleBar, InfoTitleBarType } from './InfoTitleBar';
import { testIds } from '../helpers';
// eslint-disable-next-line import/default
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

export interface ModalProps {
  isVisible: boolean;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  semiTitle?: string | JSX.Element;
  children?: React.ReactNode;
  topOffset?: SharedValue<number>;
  testID?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;

  onClose: () => void;
}

export const DEFAULT_TOP_OFFSET = 169;

export const Modal: React.FC<ModalProps> = ({
  isVisible,
  title,
  children,
  topOffset,
  titleStyle,
  titleContainerStyle,
  semiTitle,
  testID = 'modal',
  contentContainerStyle,
  onClose,
}) => {
  const animatedStyles = useAnimatedStyle<ViewStyle>(() => ({
    marginTop: topOffset?.value ?? DEFAULT_TOP_OFFSET,
  }));

  const semiTitleStyle = useMemo<StyleProp<TextStyle>>(
    () => [styles.title, titleStyle],
    [titleStyle],
  );

  return (
    <RNModal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      testID={testIds.idContainer(testID)}
    >
      <View style={styles.container}>
        <Animated.View
          style={[styles.background, animatedStyles, contentContainerStyle]}
          testID={testIds.idContent(testID)}
        >
          <InfoTitleBar
            type={InfoTitleBarType.Secondary}
            title={title}
            containerStyle={titleContainerStyle}
          />
          <View style={styles.containerHeader}>
            <View style={styles.icon}>
              <Pressable
                hitSlop={32}
                onPress={onClose}
                testID={testIds.idClose(testID)}
              >
                <SVGs.CloseIcon color={colors.purpleDark} />
              </Pressable>
            </View>
            <Text style={semiTitleStyle}>{semiTitle}</Text>
            <View style={styles.icon} />
          </View>
          {children}
        </Animated.View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  background: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    zIndex: 100,
  },
  containerHeader: {
    paddingVertical: 11,
    marginHorizontal: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.TT_Regular,
    fontSize: 17,
    lineHeight: 20,
    color: colors.blackLight,
  },
  icon: {
    width: 15.2,
    height: 15.2,
  },
});
