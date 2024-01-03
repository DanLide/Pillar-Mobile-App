// JAMFAppConfigModule.m

#import "JAMFAppConfigModule.h"
#import "RepairStack-Bridging-Header.h"

@implementation JAMFAppConfigModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getDeviceName:(RCTResponseSenderBlock)callback)
{
  JAMFAppConfig *jamfAppConfig = [[JAMFAppConfig alloc] init];
  NSString *deviceName = [jamfAppConfig getDeviceName];
  callback(@[deviceName]);
}

@end
