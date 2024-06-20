import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  AppState,
  Dimensions,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import { delay } from 'src/helpers';

const { CaptuvoModule } = NativeModules;

const IS_IPOD = Dimensions.get('screen').width === 320;
const IS_AVAILABLE = !!NativeModules.CaptuvoModule?.getConstants().isAvailable;
const SCANNER_UNAVAILABLE = !IS_IPOD || !IS_AVAILABLE;

export const CaptuvoSubscription = new NativeEventEmitter(CaptuvoModule);

export const useCaptuvoScanner = ({
  onDataReceived,
  useScannerFlow = true,
}: {
  onDataReceived: (v: string) => void;
  useScannerFlow?: boolean;
}) => {
  const isScannerFlowDisabled: boolean = SCANNER_UNAVAILABLE || !useScannerFlow;
  const [isScannerReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(!isScannerFlowDisabled);
  const isFocused = useIsFocused();

  const enableScanner = useCallback(async () => {
    try {
      setIsLoading(true);
      await CaptuvoModule.enableDecoder();
    } catch (error) {
      const err = error as { message: string };
      if (err.message === 'Scanner already connected') {
        setIsReady(true);
      }
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isScannerFlowDisabled) return;
    if (isFocused) {
      enableScanner();
    } else {
      CaptuvoModule.disableDecoder();
      setIsLoading(false);
      setIsReady(false);
    }
  }, [isFocused, enableScanner, isScannerFlowDisabled]);

  useEffect(() => {
    if (isScannerFlowDisabled) return;
    const readyListener = CaptuvoSubscription.addListener(
      'onReady',
      async () => {
        await delay(300); // scanner need some additional time for initialization
        setIsLoading(false);
        setIsReady(true);
      },
    );
    const connectionListener = CaptuvoSubscription.addListener(
      'connectionChange',
      (isConnected: boolean) => {
        setIsLoading(false);
        if (isConnected) {
          CaptuvoModule.enableDecoder();
        } else {
          setIsReady(false);
        }
      },
    );
    const appStateListener = AppState.addEventListener('change', appState => {
      if (appState === 'active') {
        enableScanner();
      } else if (appState === 'background') {
        setIsReady(false);
        setIsLoading(false);
        CaptuvoModule.disableDecoder();
      }
    });

    return () => {
      CaptuvoModule.disableDecoder();
      readyListener.remove();
      appStateListener.remove();
      connectionListener.remove();
    };
  }, [enableScanner, isScannerFlowDisabled]);

  useEffect(() => {
    if (SCANNER_UNAVAILABLE) return;
    const dataListener = CaptuvoSubscription.addListener('dataReceived', d => {
      onDataReceived(d);
    });
    () => dataListener.remove();
  }, [onDataReceived]);

  return {
    isLoading,
    isScannerReady,
    disableScanner: () => {
      setIsLoading(false);
      setIsReady(false);
      CaptuvoModule.disableDecoder();
    },
  };
};
