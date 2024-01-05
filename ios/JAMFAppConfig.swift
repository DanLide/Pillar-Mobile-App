import ManagedAppConfigLib
import Foundation

@objc class JAMFAppConfig: NSObject {
    @objc func getDeviceName() -> String? {
      guard let deviceName = ManagedAppConfig.shared.getConfigValue(forKey: "DeviceName") as? String else {
        return "Default Device Name"
      }
      return deviceName
    }
}
