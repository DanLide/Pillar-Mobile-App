import { SSOUser } from 'src/stores/SSOStore';
import { tryFetch, URLProvider } from '../helpers';

export const getSSOUsers = async (rn_token: string): Promise<SSOUser[]> => {
  const url = new URLProvider().getSSOUsers();

  return tryFetch<SSOUser[]>({
    url,
    request: {
      method: 'GET',
      headers: {
        rn_token,
        'Content-Type': 'application/json',
      },
    },
  });
};
