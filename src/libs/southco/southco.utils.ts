import { Buffer } from 'buffer';

export function getSCLockParams(manufacturerData: string) {
  const decoded = Buffer.from(manufacturerData, 'base64').toString('hex');
  return {
    macAddress: decoded.substring(0, 12),
    sensorStatus: decoded.substring(16, 18),
    isRegister: parseInt(decoded.substring(12, 14), 16) === 0x0,
  };
}
