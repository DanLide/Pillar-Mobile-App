import { AcceptTermsTask, SaveAcceptTermsDataTask } from '../acceptTerms';
import {
  mockAcceptTermsError,
  mockAcceptTermsSuccess,
} from '../__mocks__/acceptTerms';
import { AuthStore } from '../../stores/AuthStore';

describe('acceptTerms', () => {
  it('should execute AcceptTerms task', async () => {
    const mockedAcceptTermsSuccess = mockAcceptTermsSuccess();
    const acceptTermsTask = new AcceptTermsTask();

    await expect(acceptTermsTask.run()).resolves.not.toThrow();
    expect(mockedAcceptTermsSuccess).toBeCalled();
  });

  it('should throw error on AcceptTerms task', async () => {
    const mockedAcceptTermsError = mockAcceptTermsError();
    const acceptTermsTask = new AcceptTermsTask();

    await expect(acceptTermsTask.run()).rejects.toThrow();
    expect(mockedAcceptTermsError).toBeCalled();
  });

  it('should execute SaveAcceptTermsData task', async () => {
    const authStore = new AuthStore();
    const saveAcceptTermsDataTask = new SaveAcceptTermsDataTask(authStore);

    await expect(saveAcceptTermsDataTask.run()).resolves.not.toThrow();
    expect(authStore.isTnCSelected).toBeTruthy();
  });
});
