#import "RCTMasterLockModule.h"
#import <React/RCTLog.h>
#import <MLBluetooth/MLBluetooth-Swift.h>

// Channels for updating statuses
NSString *const visibilityStatusChannel = @"visibilityStatus";
NSString *const lockStatusChannel = @"lockStatus";

// States for visibility status
NSString *const visibilityStatus_Visible = @"VISIBLE";
NSString *const visibilityStatus_Unknown = @"UNKNOWN";

// States for lock status
NSString *const lockStatus_Unknown = @"UNKNOWN";
NSString *const lockStatus_Locked = @"LOCKED";
NSString *const lockStatus_Unlocked = @"UNLOCKED";
NSString *const lockStatus_Open = @"OPEN";
NSString *const lockStatus_OpenLocked = @"OPEN_LOCKED";
NSString *const lockStatus_PendingUnlock = @"PENDING_UNLOCK";
NSString *const lockStatus_PendingRelock = @"PENDING_RELOCK";

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
RCT_EXPORT_METHOD(configure:(NSString *)license
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [[MLBluetoothSDK main] configureWithLicense:license delegate:self backgroundLocation:NO loggerConfiguration:LoggerConfigurationProduction];
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

- (NSArray<NSString *> *)supportedEvents {
  return @[visibilityStatusChannel, lockStatusChannel];
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
      [self sendEventWithName:visibilityStatusChannel body:visibilityStatus_Visible];
      break;
    default : /* Optional */
      [self sendEventWithName:visibilityStatusChannel body:visibilityStatus_Unknown];
  }

  if (state.primaryMechanism.getState == MechanismStateUnknown) {
    [self sendEventWithName:lockStatusChannel body:lockStatus_Unknown];
    
  } else if (state.primaryMechanism.getState == MechanismStateLocked) {
    [self sendEventWithName:lockStatusChannel body:lockStatus_Locked];
    
  } else if (state.primaryMechanism.getState == MechanismStatePendingUnlock) {
    [self sendEventWithName:lockStatusChannel body:lockStatus_PendingUnlock];
    
  } else if (state.primaryMechanism.getState == MechanismStatePendingRelock) {
    [self sendEventWithName:lockStatusChannel body:lockStatus_PendingRelock];
    
  } else if (state.primaryMechanism.getState == MechanismStateUnlocked) {
    [self sendEventWithName:lockStatusChannel body:lockStatus_Unlocked];
    
  } else if (state.primaryMechanism.getState == MechanismStateOpen) {
    [self sendEventWithName:lockStatusChannel body:lockStatus_Open];
    
  } else if (state.primaryMechanism.getState == MechanismStateOpenLocked) {
    [self sendEventWithName:lockStatusChannel body:lockStatus_OpenLocked];
  }
}

- (void)product:(MLProduct *)product didChangeState:(enum MLBroadcastState)state {}
- (void)didConnectTo:(MLProduct *)product {}
- (void)didDisconnectFrom:(MLProduct *)product {}
- (void)didFailToConnectTo:(MLProduct *)product error:(NSError *)error {
//  NSLog(@"!!! didFailToConnectTo %@ - %@", product.deviceId, error.description);
}
- (void)product:(MLProduct * _Nonnull)product didRead:(NSArray<MLAuditEntry *> * _Nonnull)auditEntries {}
- (void)shouldUpdateProductDataWithProduct:(MLProduct * _Nonnull)product {}

@end