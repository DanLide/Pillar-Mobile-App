#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <Firebase.h>
#import "RNSplashScreen.h"


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  self.moduleName = @"RepairStack";
  
  NSString *appIdentifierPrefix =
  [[NSBundle mainBundle] objectForInfoDictionaryKey:@"AppIdentifierPrefix"];
  NSString *group = [NSString stringWithFormat:@"%@share_keychain", appIdentifierPrefix];
  
  // Read RN Token from the keychain
  NSDictionary *dict = @{
    (__bridge NSString *)kSecClass : (__bridge NSString *)kSecClassGenericPassword,
    (__bridge id)kSecReturnData : (id)kCFBooleanTrue,
    (__bridge id)kSecMatchLimit : (__bridge id)kSecMatchLimitOne,
    (__bridge NSString *)kSecAttrAccount : @"some_key",
    (__bridge id)kSecAttrAccessGroup : group
  };
  
  CFTypeRef result = NULL;
  OSStatus status = SecItemCopyMatching((__bridge CFDictionaryRef)dict,&result);
  NSString *keychainData = NULL;
  if( status != errSecSuccess) {
    keychainData = @"";
  } else {
    keychainData = [[NSString alloc] initWithData:(__bridge NSData *)result encoding:NSUTF8StringEncoding];
  }
  
  self.initialProps = @{@"rntoken" : keychainData};

  [RNSplashScreen show];
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

@end
