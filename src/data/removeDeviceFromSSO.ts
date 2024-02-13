import { Task, TaskExecutor } from './helpers';
import { deviceByRepairFacilityIdAPI, removeDeviceFromSSO } from './api/ssoAPI';
import { deviceInfoStore, ssoStore } from 'src/stores';
import { PartyRelationshipType } from 'src/constants/common.enum';

export const onRemoveDeviceFromSSO = async () => {
  return new TaskExecutor([new RemoveDeviceFromSSO()]).execute();
};

export class RemoveDeviceFromSSO extends Task {
  hasError: boolean;

  constructor() {
    super();
    this.hasError = false;
  }

  async run() {
    const deviceList = await deviceByRepairFacilityIdAPI();
    if (!deviceList.length) throw Error('Device list is empty!');

    const deviceName = deviceInfoStore.deviceName;
    const currentDevice = deviceList.find(
      device => device.leanTecSerialNo === deviceName,
    );
    if (!deviceName) throw Error('Device is not find!');

    const partyRoleID = ssoStore.getCurrentSSO?.pisaId;

    await removeDeviceFromSSO(currentDevice.partyRoleId.toString(), {
      partyRelationshipType: [
        {
          id: PartyRelationshipType.RepairFacilityToDevice,
          fromPartyRoleId: partyRoleID,
          toPartyRoleId: currentDevice.partyRoleId,
        },
      ],
    });
  }
}
