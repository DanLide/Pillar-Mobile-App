//
//  CaptuvoModule.m
//  RepairStack
//
//  Created by Andrii Muzh on 24.04.2024.
//

#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(CaptuvoModule,RCTEventEmitter)

RCT_EXTERN_METHOD(enableDecoder: (RCTPromiseResolveBlock)resolve reject: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(disableDecoder)

@end
