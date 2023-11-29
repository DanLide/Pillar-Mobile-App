import { NativeModules as RNNativeModules } from 'react-native';
import { setUpTests } from 'react-native-reanimated/lib/types/lib/reanimated2/jestUtils';

const setUpReanimated =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('react-native-reanimated/lib/reanimated2/jestUtils')
    .setUpTests as typeof setUpTests;

setUpReanimated();

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);
jest.mock('react-native-vision-camera', () => {});
jest.mock('react-native-volume-manager', () => {
  return {
    setVolume: jest.fn(),
  };
});
jest.mock('react-native-track-player', () => {
  return {
    addEventListener: jest.fn(),
    registerEventHandler: jest.fn(),
    registerPlaybackService: jest.fn(),
    setupPlayer: jest.fn(),
    destroy: jest.fn(),
    updateOptions: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    skip: jest.fn(),
    skipToNext: jest.fn(),
    skipToPrevious: jest.fn(),
    removeUpcomingTracks: jest.fn(),
    // playback commands
    reset: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    seekTo: jest.fn(),
    setVolume: jest.fn(),
    setRate: jest.fn(),
    // player getters
    getQueue: jest.fn(),
    getTrack: jest.fn(),
    getCurrentTrack: jest.fn(),
    getVolume: jest.fn(),
    getDuration: jest.fn(),
    getPosition: jest.fn(),
    getBufferedPosition: jest.fn(),
    getState: jest.fn(),
    getRate: jest.fn(),
  };
});

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(),
  getDeviceName: jest.fn(async () => 'iphone'),
  getDeviceNameSync: jest.fn(() => '3M-AAD-iphone'),
  getBundleId: jest.fn(() => 'com.bundle'),
}));

RNNativeModules.UIManager = RNNativeModules.UIManager || {};
RNNativeModules.UIManager.RCTView = RNNativeModules.UIManager.RCTView || {};
RNNativeModules.RNGestureHandlerModule = RNNativeModules.RNGestureHandlerModule || {
  State: { BEGAN: 'BEGAN', FAILED: 'FAILED', ACTIVE: 'ACTIVE', END: 'END' },
  attachGestureHandler: jest.fn(),
  createGestureHandler: jest.fn(),
  dropGestureHandler: jest.fn(),
  updateGestureHandler: jest.fn(),
};
RNNativeModules.PlatformConstants = RNNativeModules.PlatformConstants || {
  forceTouchAvailable: false,
};

jest.mock('react-native-bluetooth-state-manager', () => ({}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.NativeModules.MasterLockModule = {
    initLock: jest.fn(),
    deinit: jest.fn(),
    readRelockTime: jest.fn(),
    writeRelockTime: jest.fn(),
    unlock: jest.fn(),
    removeListeners: jest.fn(),
    addListener: jest.fn(),
  };

  return RN;
});
