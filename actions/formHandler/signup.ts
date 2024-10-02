'use server';

import jwt from 'jsonwebtoken';

import { addCookie } from '../cookies';
import { makeRequest } from '../makeRequest';

type role = 'RESTAURANT_MANAGER' | 'CUSTOMER';

interface SignupProps {
  email: string;
  password: string;
  role: role;
}

interface SignupResponse {
  token: string;
  userID: string;
  userRole: role;
  message: string;
}

type SignupResult =
  | {
      success: true;
      data: SignupResponse;
    }
  | {
      success: false;
      error: string;
    };

export async function signupFormHandler(
  props: SignupProps
): Promise<SignupResult> {
  const response = await makeRequest<SignupResponse, SignupProps>({
    method: 'post',
    endpoint: 'auth/signup',
    auth: 'none',
    data: props,
    timeout: 5000,
  });

  if (!response.success) {
    return response;
  }
  console.log('res', response);
  const { token, userID, message, userRole } = response.data;

  if (!token) {
    return {
      success: false,
      error: 'Access token is missing from the response',
    };
  }
  const decodedToken = jwt.decode(token) as jwt.JwtPayload;
  console.log('decodedToken', decodedToken);
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
    data: { token, userID, message, userRole },
  };
}
