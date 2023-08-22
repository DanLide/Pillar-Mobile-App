import { EmitterSubscription, NativeModules } from "react-native";

const {MasterLockModule} = NativeModules;

 
interface MasterLockInterface {
    configure(license: string): Promise<string>;
    deinit(): Promise<string>;
    initLock(deviceId: string, accessProfile: string, firmwareVersion: number): Promise<string>;
    readRelockTime(deviceId: string): Promise<string>;
    writeRelockTime(deviceId: string, time: number): Promise<string>; // time range is 4..60
    unlock(deviceId: string): Promise<string>;

    addListener(
        eventType: string,
        listener: (event: any) => void,
        context?: Object,
      ): EmitterSubscription;
}
export default MasterLockModule as MasterLockInterface;
