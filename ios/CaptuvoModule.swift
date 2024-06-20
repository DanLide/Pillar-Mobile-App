//
//  CaptuvoModule.swift
//  RepairStack
//
//  Created by Andrii Muzh on 24.04.2024.
//

import Foundation

#if !targetEnvironment(simulator)
@objc(CaptuvoModule)
class CaptuvoModule: RCTEventEmitter, CaptuvoEventsProtocol {
  
  override init() {
    super.init()
    Captuvo.sharedCaptuvoDevice().addDelegate(self)
  }
  
  @objc
  func enableDecoder(_ resolve: @escaping RCTPromiseResolveBlock, reject:  @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let status = Captuvo.sharedCaptuvoDevice().startDecoderHardware()
      if (status.rawValue > 0) {
        let error = NSError(domain: "", code: 200, userInfo: nil);
        if(status.rawValue == 1) {
          reject("HARDWARE ERROR", "Scanner already connected", error)
        } else {
          reject("HARDWARE ERROR", "Scanner can't be used code:\(status.rawValue)", error)
        }
      } else {
        resolve("Hardware enabled")
      }
    }
  }
  
  @objc
  func disableDecoder() {
    Captuvo.sharedCaptuvoDevice().stopDecoderHardware()
  }
  
  func decoderDataReceived(_ data: String!) {
    sendEvent(withName: "dataReceived", body: data)
  }
  
  func decoderReady() {
    sendEvent(withName: "onReady", body: "Scanner is ready")
  }
  
  override func supportedEvents() -> [String]! {
    return ["onReady", "dataReceived", "connectionChange"]
  }
  
  func captuvoDisconnected()
  {
    Captuvo.sharedCaptuvoDevice().stopDecoderHardware()
    sendEvent(withName: "connectionChange", body: false );
  }
  
  func captuvoConnected() {
    sendEvent(withName: "connectionChange", body: true );
  }
  
  @objc
  override func constantsToExport() -> [AnyHashable: Any]!{
    return ["isAvailable": true];
  }
  
  @objc
  override static func requiresMainQueueSetup() ->Bool{
    return true
  }
}

#else
// Placeholder class for builds on simulator due to unsupported x86-64 architecture
@objc(CaptuvoModule)
class CaptuvoModule: RCTEventEmitter {
  @objc
  func enableDecoder(_ resolve: RCTPromiseResolveBlock, reject:  RCTPromiseRejectBlock) {
    let error = NSError(domain: "", code: 200, userInfo: nil);
    reject("HARDWARE ERROR", "scanner can't be used", error)
  }
  
  @objc
  func disableDecoder() {}
  
  override func supportedEvents() -> [String]! {
    return ["onReady", "dataReceived", "connectionChange"]
  }
  
  @objc
  override func constantsToExport() -> [AnyHashable: Any]!{
    return ["isAvailable": false];
  }
  
  @objc
  override static func requiresMainQueueSetup() ->Bool{
    return true
  }
}
#endif
