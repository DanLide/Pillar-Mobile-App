import { NativeModules } from "react-native";

const {MasterLockModule} = NativeModules;
 
interface MasterLockInterface {
    configureWithLicense(license: string): void;
    initLock(deviceId: string, accessProfile: string, firmwareVersion: number): void;
    unlock(deviceId: string, success:(descr: string) => any, error:(descr: string) => any ): void;
}
export default MasterLockModule as MasterLockInterface;
