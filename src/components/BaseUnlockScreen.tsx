import {
  useRef,
  useState,
  useMemo,
  useLayoutEffect,
  useCallback,
  useEffect,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Easing,
  PixelRatio,
} from 'react-native';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { NativeStackScreenProps } from 'react-native-screens/native-stack';
import { masterLockStore, southcoStore } from 'src/stores';

import cabinet from '../../assets/images/cabinetImage.png';
import { Button, ButtonType } from '../components';
import { colors, commonStyles, fonts, SVGs } from '../theme';
import { LockStatus } from '../data/masterlock';
import { RELOCK_TIME, RELOCK_TIME_SEC } from '../stores/MasterLockStore';
import {
  AppNavigator,
  RemoveStackParamList,
  ReturnStackParamList,
  OrdersParamsList,
  ManageProductsStackParamList,
} from '../navigation/types';

const { width } = Dimensions.get('window');

const centerWidth = PixelRatio.roundToNearestPixel(width * 0.414);
const additionalRadius = PixelRatio.roundToNearestPixel(
  width * 0.5585 - centerWidth,
);
const animationCircleWidth = PixelRatio.roundToNearestPixel(
  centerWidth + additionalRadius / 1.8,
);
const animationBorderWidth = PixelRatio.roundToNearestPixel(
  (animationCircleWidth - centerWidth) / 2,
);

enum ExtendedMasterLockStatus {
  UNLOCKING = 'UNLOCKING',
}

type ExtendedMasterLockStatuses = ExtendedMasterLockStatus | LockStatus;

type Props = NativeStackScreenProps<
  | RemoveStackParamList
  | ReturnStackParamList
  | OrdersParamsList
  | ManageProductsStackParamList,
  AppNavigator.BaseUnlockScreen
>;

export const BaseUnlockScreen: React.FC<Props> = observer(
  ({ navigation, route }) => {
    const { t } = useTranslation();
    const {
      params: { MLId = '', SCId = '', nextScreen, nextNavigationGoBack },
    } = route;

    const masterLockStatus: LockStatus =
      masterLockStore.stocksState[MLId]?.status;
    const SCLock = southcoStore.locks.get(SCId);

    const SCStatus = southcoStore.isUnlocking
      ? ExtendedMasterLockStatus.UNLOCKING
      : SCLock?.status;

    const MLStatus: ExtendedMasterLockStatuses = masterLockStore.isUnlocking
      ? ExtendedMasterLockStatus.UNLOCKING
      : masterLockStatus;

    const status = MLStatus || SCStatus;

    const [countDownNumber, setCountDownNumber] = useState(RELOCK_TIME_SEC);
    const [canSkipUnlock, setCanSkipUnlock] = useState(false);
    const intervalID = useRef<NodeJS.Timer | null>(null);

    useEffect(() => {
      if (status !== ExtendedMasterLockStatus.UNLOCKING) {
        return;
      }

      const timerId = setTimeout(() => {
        setCanSkipUnlock(true);
        const hideSkipUnlockTimer = setTimeout(() => {
          setCanSkipUnlock(false);
          clearTimeout(hideSkipUnlockTimer);
        }, 4000);
      }, 2000);

      return () => clearTimeout(timerId);
    }, [status]);

    useLayoutEffect(() => {
      if (
        status !== LockStatus.UNLOCKED &&
        countDownNumber !== RELOCK_TIME_SEC
      ) {
        setCountDownNumber(RELOCK_TIME_SEC);
        if (intervalID.current) {
          clearInterval(intervalID.current);
          intervalID.current = null;
        }
      } else if (
        status === LockStatus.UNLOCKED &&
        countDownNumber === RELOCK_TIME_SEC
      ) {
        intervalID.current = setInterval(() => {
          setCountDownNumber(prevCount => {
            if (prevCount === 1) {
              intervalID.current && clearInterval(intervalID.current);
              intervalID.current = null;
            }
            return prevCount - 1;
          });
        }, 900);
      }
    }, [countDownNumber, status]);

    const unlock = useCallback(() => {
      if (MLId) {
        masterLockStore.unlock(MLId);
      } else if (SCId) {
        southcoStore.startUnlockProcess(SCId);
      }
    }, [MLId, SCId]);

    const navigateNextScreen = useCallback(() => {
      if (nextNavigationGoBack) {
        return navigation.goBack();
      }
      nextScreen && navigation.navigate(nextScreen);
    }, [navigation, nextScreen, nextNavigationGoBack]);

    useLayoutEffect(() => {
      if (
        status === LockStatus.OPEN ||
        status === LockStatus.OPEN_LOCKED ||
        SCLock?.status === 'UNLOCKED'
      ) {
        if (nextNavigationGoBack) {
          return navigation.goBack();
        }
        nextScreen && navigation.replace(nextScreen);
      }
    }, [status, navigation, nextScreen, SCLock?.status, nextNavigationGoBack]);

    let title = '';
    switch (status) {
      case ExtendedMasterLockStatus.UNLOCKING:
        title = t('unlocking');
        break;
      case LockStatus.UNLOCKED:
        title = t('unlocked');
        break;
      case LockStatus.LOCKED:
        title = t('locked');
        break;
      case LockStatus.UNKNOWN:
        title = t('error');
        break;
    }

    const circles = useMemo(() => {
      const circlesCount =
        status === ExtendedMasterLockStatus.UNLOCKING ? 5 : 3;
      const result = [];
      for (let index = 0; index < circlesCount; index++) {
        const size = centerWidth + additionalRadius * index;
        const percentageRadius = size / 2;
        const backgroundColor =
          index === 0 ? colors.white : 'rgba(255, 255, 255, 0.1)';
        result.push(
          <View
            key={index + 'circle'}
            style={[
              {
                width: size,
                height: size,
                borderRadius: percentageRadius,
                backgroundColor,
                zIndex: circlesCount - index,
              },
              commonStyles.absolute,
            ]}
          />,
        );
      }
      return result;
    }, [status]);

    const renderAnimationCircle = useMemo(() => {
      return status === LockStatus.UNLOCKED ? (
        <AnimatedCircularProgress
          size={animationCircleWidth}
          width={animationBorderWidth}
          fill={100}
          tintColor="#E0E0E0"
          duration={RELOCK_TIME - 1000}
          backgroundColor="transparent"
          backgroundWidth={0}
          rotation={0}
          style={styles.circleTransform}
          easing={Easing.out(Easing.ease)}
        />
      ) : null;
    }, [status]);

    const renderCenterImage = useMemo(() => {
      switch (status) {
        case ExtendedMasterLockStatus.UNLOCKING:
          return (
            <Image
              resizeMode="contain"
              source={cabinet}
              style={[
                styles.centerIconContainer,
                { width: centerWidth * 0.45 },
              ]}
            />
          );
        case LockStatus.UNLOCKED:
          return (
            <View style={styles.centerIconContainer}>
              <SVGs.UnLockedStock width={centerWidth * 0.9} />
            </View>
          );
        case LockStatus.LOCKED:
          return (
            <View style={styles.centerIconContainer}>
              <SVGs.LockedStock width={centerWidth * 0.9} />
            </View>
          );
        case LockStatus.UNKNOWN:
          return (
            <View style={styles.centerIconContainer}>
              <SVGs.StockError width={centerWidth * 0.9} />
            </View>
          );
      }
    }, [status]);

    const renderCountTimer = useMemo(() => {
      switch (status) {
        case LockStatus.UNLOCKED:
          return (
            <Text style={styles.counterText}>
              {t('relockingIn', { countDownNumber })}
            </Text>
          );
        case LockStatus.LOCKED:
          return (
            <Text style={styles.counterText}>
              {t('cabinetRelockedAutomatically')}
            </Text>
          );
        case LockStatus.UNKNOWN:
          return (
            <Text style={[styles.counterText, styles.lockErrorTextSubtitle]}>
              {t('tryUnlockAgainOrUsePhysicalKey')}
            </Text>
          );
        default:
          return null;
      }
    }, [status, countDownNumber, t]);

    const renderBottomComponent = useMemo(() => {
      switch (status) {
        case ExtendedMasterLockStatus.UNLOCKING:
          return (
            canSkipUnlock && (
              <View style={styles.buttonsContainer}>
                <Button
                  type={ButtonType.primary}
                  buttonStyle={styles.primaryButton}
                  title={t('proceedWithoutUnlocking')}
                  onPress={navigateNextScreen}
                />
              </View>
            )
          );
        case LockStatus.UNLOCKED:
          return (
            <View style={styles.buttonsContainer}>
              <Text style={styles.bottomText}>
                {t('openCabinetToContinue')}
              </Text>
              {canSkipUnlock && (
                <Button
                  type={ButtonType.primary}
                  buttonStyle={styles.primaryButton}
                  title={t('proceedWithoutUnlocking')}
                  onPress={navigateNextScreen}
                />
              )}
            </View>
          );
        case LockStatus.LOCKED:
          return (
            <View style={styles.buttonsContainer}>
              <Button
                type={ButtonType.secondary}
                title={t('retryUnlock')}
                onPress={unlock}
              />
              <Button
                type={ButtonType.primary}
                buttonStyle={styles.primaryButton}
                title={t('proceedWithoutUnlocking')}
                onPress={navigateNextScreen}
              />
            </View>
          );
        case LockStatus.UNKNOWN:
          return (
            <View style={styles.buttonsContainer}>
              <Button
                type={ButtonType.secondary}
                title={t('retryUnlock')}
                onPress={unlock}
              />
              <Button
                type={ButtonType.primary}
                buttonStyle={styles.primaryButton}
                title={t('proceedWithoutUnlocking')}
                onPress={navigateNextScreen}
              />
            </View>
          );
      }
    }, [canSkipUnlock, navigateNextScreen, status, unlock, t]);

    return (
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[colors.purple, colors.purpleDark3]}
        style={styles.linearGradient}
      >
        <Text style={styles.titleText}>{title}</Text>
        <View style={styles.centerContainer}>
          {renderCountTimer}
          {circles}
          {renderCenterImage}
          {renderAnimationCircle}
        </View>
        {renderBottomComponent}
      </LinearGradient>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearGradient: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '10%',
  },
  titleText: {
    fontSize: 28,
    color: colors.white,
    fontFamily: fonts.TT_Regular,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: width,
    marginVertical: '3%',
  },
  primaryButton: {
    width: '100%',
    marginTop: 16,
    backgroundColor: 'transparent',
    borderColor: '#95959E',
    borderWidth: 1,
  },
  buttonsContainer: {
    width: '88%',
  },
  bottomText: {
    color: colors.white,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: fonts.TT_Regular,
    lineHeight: 20,
  },
  counterText: {
    color: colors.white,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: fonts.TT_Regular,
    lineHeight: 20,
    position: 'absolute',
    zIndex: 10,
    top: 10,
  },
  centerIconContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  lockErrorTextSubtitle: {
    top: 5,
    fontSize: 14,
    paddingHorizontal: 40,
  },
  circleTransform: {
    transform: [{ rotateY: '180deg' }],
  },
});
