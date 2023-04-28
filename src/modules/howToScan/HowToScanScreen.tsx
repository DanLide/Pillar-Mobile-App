import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

import QRCode from '../../../assets/images/QRCode.png';
import UPC from '../../../assets/images/UPC.png';
import cabinet from '../../../assets/images/cabinet.png';
import product from '../../../assets/images/product.png';
import productPackage from '../../../assets/images/productPackage.png';

import { colors, fonts } from '../../theme';

export const HowToScanScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How to scan a product?</Text>

      <Text style={styles.text}>
        Scanning a product is the first step in managing your shops inventory.
      </Text>
      <Text style={styles.text}>You can either use the product QR code or</Text>
      <Text style={[styles.text, { marginTop: 0 }]}>UPC for scanning.</Text>

      <View style={styles.codeContainer}>
        <View style={styles.codeItemContainer}>
          <Image source={QRCode} style={styles.QRImage} />
          <Text style={styles.imageSubtitle}>QR Code</Text>
        </View>
        <View style={styles.codeItemContainer}>
          <Image source={UPC} style={styles.UPCImage} />
          <Text style={styles.imageSubtitle}>UPC</Text>
        </View>
      </View>

      <Text style={styles.title}>How to find the QR Code or UPC</Text>
      <Text style={styles.text}>
        You can scan products in 3 different ways.
      </Text>

      <View style={styles.productsContainer}>
        <View style={styles.productItemContainer}>
          <Image source={cabinet} style={styles.cabinetImage} />
          <Text style={styles.imageSubtitle}>Cabinet</Text>
        </View>
        <View style={styles.productItemContainer}>
          <Image source={productPackage} style={styles.productPackageImage} />
          <Text style={[styles.imageSubtitle, styles.productPackageText]}>
            Product Package
          </Text>
        </View>
        <View style={styles.productItemContainer}>
          <Image source={product} style={styles.productImage} />
          <Text style={styles.imageSubtitle}>Product</Text>
        </View>
      </View>
    </View>
  );
};

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
    marginBottom: 16,
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
    marginTop: 24,
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
