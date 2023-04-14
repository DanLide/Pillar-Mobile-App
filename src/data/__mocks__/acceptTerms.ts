import * as AcceptTermsAPI from '../api/acceptTerms';

export const mockAcceptTermsSuccess = () =>
  jest
    .spyOn(AcceptTermsAPI, 'acceptTermsAPI')
    .mockReturnValue(Promise.resolve());

export const mockAcceptTermsError = () =>
  jest.spyOn(AcceptTermsAPI, 'acceptTermsAPI').mockImplementation(() => {
    throw new Error();
  });
