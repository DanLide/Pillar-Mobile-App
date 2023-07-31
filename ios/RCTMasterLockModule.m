#import "RCTMasterLockModule.h"
#import <React/RCTLog.h>
#import <MLBluetooth/MLBluetooth-Swift.h>

@interface RCTMasterLockModule ()
@property NSMutableDictionary *locks;

@end

@implementation RCTMasterLockModule

- (instancetype)init {
    self = [super init];
    if (self) {
      self.locks = [NSMutableDictionary dictionary];
    }
    return self;
}

RCT_EXPORT_MODULE(MasterLockModule);
RCT_EXPORT_METHOD(configureWithLicense:(NSString *)license
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [[MLBluetoothSDK main] configureWithLicense:self.license delegate:self backgroundLocation:NO loggerConfiguration:LoggerConfigurationProduction];
  resolve(@"success");
}

RCT_EXPORT_METHOD(initLock:(NSString *)deviceId
                  accessProfile:(NSString *)accessProfile
                  firmwareVersion:(NSInteger)firmwareVersion
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  MLProduct *lock = [[MLProduct alloc] initWithDeviceId:deviceId accessProfile:accessProfile firmwareVersion:firmwareVersion region:MLRegionNa];

  lock.delegate = self;
  [self.locks setValue:lock forKey:deviceId];
  resolve(@"success");
}

RCT_EXPORT_METHOD(unlock:(NSString *)deviceId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  MLProduct *lock =[self.locks objectForKey:deviceId];
  if (lock) {
    NSError *anyError;
    [lock unlockWithMechanism:MLUnlockOptionsPrimary completion:^(NSError * error)  {
      
      if (error) {
        reject([@(error.code) stringValue], error.description, error);
      } else {
        [lock disconnectWithOption:MLDisconnectOptionsNone completion:^{
          resolve(@"success");
        }];
      }
    }];
    
  } else {
    reject(@"-101", @"Lock is not inited", nil);
  }
}

/// MLLockScannerDelegate
- (BOOL)shouldConnectToDeviceWith:(NSString *)deviceId andRSSI:(NSNumber *)rssi {
  return [self.locks objectForKey:deviceId] != nil;
}

- (MLProduct *)productForDeviceId:(NSString *)deviceId {
  return [self.locks objectForKey:deviceId];
}
- (void)bluetoothModuleDidUpdateWithState:(enum MLBluetoothState)state {
  if (state == MLBluetoothStatePoweredOn) {
    [[MLBluetoothSDK main] startScanning];
  }
}
- (void)didDiscoverDeviceWith:(NSString * _Nonnull)deviceId {}


/// MLProductDelegate

- (void)product:(MLProduct *)product didChange:(LockState *)state {
  switch(state.visibility){
    case VisibilityVisible:
      NSLog(@"VISIBLE !!!!");
      break;
    default : /* Optional */
      NSLog(@"Unknown visibility !!!!");
  }
  
  if (state.primaryMechanism.getState == MechanismStateUnknown) {
    NSLog(@"MechanismStateUnknown !!!!");
  } else if (state.primaryMechanism.getState == MechanismStateLocked) {
    NSLog(@"MechanismStateLocked !!!!");
  } else if (state.primaryMechanism.getState == MechanismStatePendingUnlock) {
    NSLog(@"MechanismStatePendingUnlock !!!!");
  } else if (state.primaryMechanism.getState == MechanismStatePendingRelock) {
    NSLog(@"MechanismStatePendingRelock !!!!");
  } else if (state.primaryMechanism.getState == MechanismStateUnlocked) {
    NSLog(@"MechanismStateUnlocked !!!!");
  } else if (state.primaryMechanism.getState == MechanismStateOpen) {
    NSLog(@"MechanismStateOpen !!!!");
  } else if (state.primaryMechanism.getState == MechanismStateOpenLocked) {
    NSLog(@"MechanismStateOpenLocked !!!!");
  }
}

- (void)product:(MLProduct *)product didChangeState:(enum MLBroadcastState)state {}
- (void)didConnectTo:(MLProduct *)product {}
- (void)didDisconnectFrom:(MLProduct *)product {}
- (void)didFailToConnectTo:(MLProduct *)product error:(NSError *)error {}
- (void)product:(MLProduct * _Nonnull)product didRead:(NSArray<MLAuditEntry *> * _Nonnull)auditEntries {}
- (void)shouldUpdateProductDataWithProduct:(MLProduct * _Nonnull)product {}

@end
