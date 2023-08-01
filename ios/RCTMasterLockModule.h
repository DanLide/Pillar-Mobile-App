#import <React/RCTBridgeModule.h>
#import <MLBluetooth/MLBluetooth.h>
#import <React/RCTEventEmitter.h>

@interface RCTMasterLockModule : RCTEventEmitter <RCTBridgeModule, MLLockScannerDelegate, MLProductDelegate>

@end
