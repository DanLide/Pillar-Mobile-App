import { getLogoutListener } from './getLogoutListener';
import { LogoutListener } from './tryFetch';

export const AUTO_LOGOUT_TIMEOUT = 300000; // 5 minutes

class AutoLogoutService {
  _logoutListener: null | LogoutListener = null;
  timeOutId: NodeJS.Timeout | null = null;
  lastTouchTimeStamp: Date | null = null;

  constructor(logoutListener: LogoutListener) {
    this._logoutListener = logoutListener;
  }

  onTouch = () => {
    this.clearTimer();
    this.timeOutId = setTimeout(
      () => this.logOutCallBack(),
      AUTO_LOGOUT_TIMEOUT,
    );
    this.lastTouchTimeStamp = new Date();
  };

  logOutCallBack() {
    this._logoutListener?.onAutoLogout();
  }
  clearTimer() {
    this.timeOutId && clearTimeout(this.timeOutId);
  }
}

export default new AutoLogoutService(getLogoutListener());
