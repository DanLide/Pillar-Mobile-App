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
@property BOOL shouldScan;

@end

@implementation RCTMasterLockModule

- (instancetype)init {
    self = [super init];
    if (self) {
      self.locks = [NSMutableDictionary dictionary];
      self.shouldScan = NO;
    }
    return self;
}

RCT_EXPORT_MODULE(MasterLockModule);
RCT_EXPORT_METHOD(configure:(NSString *)license
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  self.shouldScan = YES;
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

RCT_EXPORT_METHOD(deinit:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  self.shouldScan = NO;

  [[MLBluetoothSDK main] stopScanning];
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

RCT_EXPORT_METHOD(readRelockTime:(NSString *)deviceId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  MLProduct *lock =[self.locks objectForKey:deviceId];
  if (lock) {
    [lock readRelockTimeWithCompletion:^(NSInteger time, NSError * error) {
      if (error) {
        reject([@(error.code) stringValue], error.description, error);
      } else {
        resolve([NSString stringWithFormat: @"%ld", (long)time]);
      }
    }];
    
  } else {
    reject(@"-101", @"Lock is not inited", nil);
  }
}

RCT_EXPORT_METHOD(writeRelockTime:(NSString *)deviceId
                  time:(NSInteger)time
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  MLProduct *lock =[self.locks objectForKey:deviceId];
  if (lock) {
    [lock writeWithRelockTime:time completion:^(NSError * error) {
      if (error) {
        reject([@(error.code) stringValue], error.description, error);
      } else {
        resolve(@"success");
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
  if (state == MLBluetoothStatePoweredOn && self.shouldScan) {
    [[MLBluetoothSDK main] startScanning];
  }
}

- (void)didDiscoverDeviceWith:(NSString * _Nonnull)deviceId {}


/// MLProductDelegate
- (void)product:(MLProduct *)product didChange:(LockState *)state {
  switch(state.visibility){
    case VisibilityVisible:
      [self sendEvent:product channel:visibilityStatusChannel status:visibilityStatus_Visible];
      break;
    default : /* Optional */
      [self sendEvent:product channel:visibilityStatusChannel status:visibilityStatus_Unknown];
  }

  if (state.primaryMechanism.getState == MechanismStateUnknown) {
    [self sendEvent:product channel:lockStatusChannel status:lockStatus_Unknown];
    
  } else if (state.primaryMechanism.getState == MechanismStateLocked) {
    [self sendEvent:product channel:lockStatusChannel status:lockStatus_Locked];
    
  } else if (state.primaryMechanism.getState == MechanismStatePendingUnlock) {
    [self sendEvent:product channel:lockStatusChannel status:lockStatus_PendingUnlock];
    
  } else if (state.primaryMechanism.getState == MechanismStatePendingRelock) {
    [self sendEvent:product channel:lockStatusChannel status:lockStatus_PendingRelock];
    
  } else if (state.primaryMechanism.getState == MechanismStateUnlocked) {
    [self sendEvent:product channel:lockStatusChannel status:lockStatus_Unlocked];
    
  } else if (state.primaryMechanism.getState == MechanismStateOpen) {
    [self sendEvent:product channel:lockStatusChannel status:lockStatus_Open];
    
  } else if (state.primaryMechanism.getState == MechanismStateOpenLocked) {
    [self sendEvent:product channel:lockStatusChannel status:lockStatus_OpenLocked];
  }
}

- (void)sendEvent:(MLProduct *)product channel:(NSString *)channel status:(NSString *)status {
  [self sendEventWithName:channel body:[NSString stringWithFormat:@"%@/%@", [product deviceId], status]];
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
