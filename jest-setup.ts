import { NativeModules as RNNativeModules } from 'react-native';

jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);
jest.mock('react-native-vision-camera', () => {});
jest.mock('react-native-sound', () => {
  class SoundMock {}

  SoundMock.prototype.setVolume = jest.fn();
  SoundMock.prototype.setNumberOfLoops = jest.fn();
  SoundMock.prototype.play = jest.fn();
  SoundMock.prototype.stop = jest.fn();

  SoundMock.setCategory = jest.fn();

  return SoundMock;
});

RNNativeModules.UIManager = RNNativeModules.UIManager || {};
RNNativeModules.UIManager.RCTView = RNNativeModules.UIManager.RCTView || {};
RNNativeModules.RNGestureHandlerModule =
  RNNativeModules.RNGestureHandlerModule || {
    State: { BEGAN: 'BEGAN', FAILED: 'FAILED', ACTIVE: 'ACTIVE', END: 'END' },
    attachGestureHandler: jest.fn(),
    createGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),
  };
RNNativeModules.PlatformConstants = RNNativeModules.PlatformConstants || {
  forceTouchAvailable: false,
};
