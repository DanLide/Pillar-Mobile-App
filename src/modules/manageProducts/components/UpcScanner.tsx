import { memo, useMemo } from 'react';
import {
  Modal as RNModal,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../../../theme';
import { LeftBarButton, TitleBar } from '../../../navigation/components';
import { LeftBarType } from '../../../navigation/types';
import {
  InfoTitleBar,
  InfoTitleBarType,
  ScanProductProps,
} from '../../../components';
import ScanProduct from '../../../components/ScanProduct';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props extends ScanProductProps {
  stockName?: string;
  onClose?: () => void;
}

export const UpcScanner = memo(
  ({ isActive, stockName, onScan, onClose }: Props) => {
    const headerHeight = useHeaderHeight();
    const { top } = useSafeAreaInsets();

    const statusBarStyle = useMemo<StyleProp<ViewStyle>>(
      () => [styles.statusBar, { height: top }],
      [top],
    );

    const navBarStyle = useMemo<StyleProp<ViewStyle>>(
      () => [styles.navBar, { height: headerHeight - top }],
      [headerHeight, top],
    );

    return (
      <RNModal animationType="none" visible={isActive}>
        <View style={statusBarStyle} />
        <View style={navBarStyle}>
          <LeftBarButton
            leftBarButtonType={LeftBarType.Back}
            onPress={onClose}
            style={styles.backButton}
          />
          <TitleBar title="Edit Product" />
        </View>
        <View style={styles.container}>
          <InfoTitleBar type={InfoTitleBarType.Primary} title={stockName} />
          <ScanProduct onScan={onScan} isActive={isActive} isUPC={true} />
        </View>
      </RNModal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  navBar: {
    alignItems: 'center',
    backgroundColor: colors.purple,
    justifyContent: 'center',
  },
  statusBar: {
    backgroundColor: colors.purple,
  },
});
