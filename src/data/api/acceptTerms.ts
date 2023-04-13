// import { URLProvider, tryAuthFetch } from '../helpers';
// import { PartySettingsType } from '../../constants';

export const acceptTermsAPI = () => {
  // TODO: uncomment when API fix is released
  // const url = new URLProvider().getAcceptTermsUrl();
  //
  // const body = JSON.stringify([
  //   { id: PartySettingsType.IsTermsAccepted, value: true },
  // ]);
  //
  // return tryAuthFetch<Response>({ url, request: { method: 'PUT', body } });
  return new Promise<void>(resolve => setTimeout(resolve, 1000));
};
