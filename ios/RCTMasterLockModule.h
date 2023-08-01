#import <React/RCTBridgeModule.h>
#import <MLBluetooth/MLBluetooth.h>

@interface RCTMasterLockModule : NSObject <RCTBridgeModule, MLLockScannerDelegate, MLProductDelegate>

@end

