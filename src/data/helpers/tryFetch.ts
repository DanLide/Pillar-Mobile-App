export interface ResponseError {
  error: string;
  error_description: string;
}

export const tryFetch = async <ResponseType>(
  url: string | URL,
  request?: RequestInit
): Promise<ResponseType> => {
  try {
    const response = await fetch(url, request);

    const data = await response.json();
    if (response.ok) {
      return data as ResponseType;
    } else {
      throw data as ResponseError;
    }
  } catch (error) {
    return error;
  }
};
