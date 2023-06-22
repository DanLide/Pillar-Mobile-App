import React, { useMemo } from 'react';
import {
  Modal as RNModal,
  StyleSheet,
  Text,
  View,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { colors, fonts, SVGs } from '../theme';
import { InfoTitleBar, InfoTitleBarType } from './InfoTitleBar';
import { testIds } from '../helpers';

interface Props {
  isVisible: boolean;
  title?: string;
  titleContainerStyle?: StyleProp<ViewStyle>;
  semiTitle?: string;
  children?: React.ReactNode;
  topOffset?: number;
  testID?: string;

  onClose: () => void;
}

export const DEFAULT_TOP_OFFSET = 169;

export const Modal: React.FC<Props> = ({
  isVisible,
  title,
  children,
  topOffset,
  titleContainerStyle,
  semiTitle,
  testID = 'modal',
  onClose,
}) => {
  const backgroundStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.background, { marginTop: topOffset ?? DEFAULT_TOP_OFFSET }],
    [topOffset],
  );

  return (
    <RNModal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      testID={testIds.idContainer(testID)}
    >
      <View style={styles.container}>
        <View style={backgroundStyle} testID={testIds.idContent(testID)}>
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
            <Text style={styles.title}>{semiTitle}</Text>
            <View style={styles.icon} />
          </View>
          {children}
        </View>
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
    paddingTop: 11,
    paddingBottom: 16,
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
