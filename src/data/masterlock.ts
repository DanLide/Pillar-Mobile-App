import { EmitterSubscription, NativeModules } from "react-native";

const {MasterLockModule} = NativeModules;

 
interface MasterLockInterface {
    configure(license: string): Promise<string>;
    initLock(deviceId: string, accessProfile: string, firmwareVersion: number): Promise<string>;
    unlock(deviceId: string): Promise<string>;

    addListener(
        eventType: string,
        listener: (event: any) => void,
        context?: Object,
      ): EmitterSubscription;
}
export default MasterLockModule as MasterLockInterface;
