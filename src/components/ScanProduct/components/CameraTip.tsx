import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

import { SVGs, colors, commonStyles, fonts } from 'src/theme';

export const CameraTip = memo(({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.tipContainer}>
        <Text>{t('scanWithCamera')}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <SVGs.CloseIcon width={10} height={10} color={colors.grayDark} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomPointer} />
      <View style={styles.cover} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingBottom: 8,
    marginBottom: 76,
  },
  closeButton: {
    marginLeft: 4,
    paddingHorizontal: 5,
    paddingVertical: 7,
  },
  tipContainer: {
    backgroundColor: colors.white,
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    ...commonStyles.moderateShadow,
  },
  cover: {
    height: 12,
    backgroundColor: colors.white,
    position: 'absolute',
    left: 30,
    width: 24,
    bottom: 8,
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
    color: colors.grayDark3,
  },
  bottomPointer: {
    height: 15,
    width: 15,
    position: 'absolute',
    left: 34,
    bottom: 1,
    transform: [{ rotate: '-45deg' }],
    backgroundColor: colors.white,
    ...commonStyles.moderateShadow,
  },
});
