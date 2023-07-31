#import <React/RCTBridgeModule.h>
#import <MLBluetooth/MLBluetooth.h>

@interface RCTMasterLockModule : NSObject <RCTBridgeModule, MLLockScannerDelegate, MLProductDelegate>

@property (nonatomic, assign) NSString *license;

@end

