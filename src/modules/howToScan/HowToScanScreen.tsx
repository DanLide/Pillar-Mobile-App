import { memo } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import QRCode from '../../../assets/images/QRCode.png';
import UPC from '../../../assets/images/UPC.png';
import cabinet from '../../../assets/images/cabinet.png';
import product from '../../../assets/images/product.png';
import productPackage from '../../../assets/images/productPackage.png';

import { colors, fonts } from '../../theme';

export const HowToScanScreen = memo(() => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('howToScanProduct')}</Text>

      <Text style={styles.text}>{t('scanningProductIsFirstStep')}</Text>
      <Text style={styles.text}>{t('youCanEitherUseUpcOrUpcForScanning')}</Text>

      <View style={styles.codeContainer}>
        <View style={styles.codeItemContainer}>
          <Image source={QRCode} style={styles.QRImage} />
          <Text style={styles.imageSubtitle}>{t('qrCode')}</Text>
        </View>
        <View style={styles.codeItemContainer}>
          <Image source={UPC} style={styles.UPCImage} />
          <Text style={styles.imageSubtitle}>{t('upc')}</Text>
        </View>
      </View>

      <Text style={styles.title}>{t('howToFindQrOrUpc')}</Text>
      <Text style={styles.text}>{t('youCanScanProductsInDifferentWays')}</Text>

      <View style={styles.productsContainer}>
        <View style={styles.productItemContainer}>
          <Image source={cabinet} style={styles.cabinetImage} />
          <Text style={styles.imageSubtitle}>{t('cabinet')}</Text>
        </View>
        <View style={styles.productItemContainer}>
          <Image source={productPackage} style={styles.productPackageImage} />
          <Text style={[styles.imageSubtitle, styles.productPackageText]}>
            {t('productPackage')}
          </Text>
        </View>
        <View style={styles.productItemContainer}>
          <Image source={product} style={styles.productImage} />
          <Text style={styles.imageSubtitle}>{t('product')}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: colors.white,
  },
  title: {
    fontFamily: fonts.TT_Bold,
    fontSize: 18,
    lineHeight: 21.5,
    textAlign: 'center',
    color: colors.black,
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Regular,
    textAlign: 'center',
    color: colors.black,
    marginTop: 8,
  },
  imageSubtitle: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Bold,
    textAlign: 'center',
    color: colors.black,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 38,
  },
  codeItemContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  QRImage: {
    width: 41,
    height: 41,
    marginBottom: 10,
  },
  UPCImage: {
    width: 55,
    height: 35.5,
    marginBottom: 12.5,
  },
  productsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 28,
  },
  productItemContainer: {
    alignItems: 'center',
  },
  cabinetImage: {
    marginBottom: 8,
    width: 86.5,
    height: 76,
  },
  productPackageImage: {
    width: 89,
    height: 83,
  },
  productPackageText: {
    width: 75,
    paddingTop: 6,
  },
  productImage: {
    marginBottom: 8,
    width: 76,
    height: 78,
  },
});
