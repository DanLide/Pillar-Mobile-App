import { Task, TaskExecutor } from './helpers';
import { getSSORNToken } from 'src/helpers/localStorage';
import { setPinAPI } from 'src/data/api/login';

export const onSetPin = async (b2cUserId: string, pin: string) =>
  new TaskExecutor([new SetPinTask(b2cUserId, pin)]).execute();

export class SetPinTask extends Task {
  b2cUserId: string;
  pin: string;

  constructor(b2cUserId: string, pin: string) {
    super();
    this.b2cUserId = b2cUserId;
    this.pin = pin;
  }

  async run() {
    const rnToken = await getSSORNToken();

    if (!rnToken) throw new Error();

    await setPinAPI(rnToken.rnToken, this.b2cUserId, this.pin);
  }
}
