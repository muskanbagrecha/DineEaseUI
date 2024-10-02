'use server';

import jwt from 'jsonwebtoken';

import { addCookie } from '../cookies';
import { makeRequest } from '../makeRequest';

interface LoginProps {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  userID: string;
}

type LoginResult =
  | {
      success: true;
      data: LoginResponse;
    }
  | {
      success: false;
      error: string;
    };

export async function loginFormHandler(
  props: LoginProps
): Promise<LoginResult> {
  const response = await makeRequest<LoginResponse, LoginProps>({
    method: 'post',
    endpoint: 'auth/login',
    auth: 'none',
    data: props,
    timeout: 5000,
  });

  if (!response.success) {
    return response;
  }

  const { token, userID } = response.data;

  if (!token) {
    return {
      success: false,
      error: 'Access token is missing from the response',
    };
  }

  const decodedToken = jwt.decode(token) as jwt.JwtPayload;

  if (!decodedToken || typeof decodedToken === 'string' || !decodedToken.exp) {
    return {
      success: false,
      error: 'Invalid token or missing expiration',
    };
  }

  const expiryDate = new Date(decodedToken.exp * 1000);

  await addCookie('token', token, {
    sameSite: 'strict',
    httpOnly: true,
    expires: expiryDate,
    secure: true,
  });

  return {
    success: true,
    data: { token, userID },
  };
}
