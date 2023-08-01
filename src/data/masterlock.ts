import { NativeModules } from "react-native";

const {MasterLockModule} = NativeModules;
 
interface MasterLockInterface {
    configure(license: string): Promise<string>;
    initLock(deviceId: string, accessProfile: string, firmwareVersion: number): Promise<string>;
    unlock(deviceId: string): Promise<string>;
}
export default MasterLockModule as MasterLockInterface;
