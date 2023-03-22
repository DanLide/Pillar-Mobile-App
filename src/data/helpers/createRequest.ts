export interface ResponseError {
  error: string;
  error_description: string;
}

export const createRequest = async <ResponseType>(
  url: string | URL,
  request?: RequestInit
): Promise<ResponseType> => {
  const response = await fetch(url, request);

  const data = await response.json();
  if (response.ok) {
    return data as ResponseType;
  } else {
    throw data as ResponseError;
  }
};
