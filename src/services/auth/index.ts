import { AxiosResponse } from "axios";

import { ACCESS_TOKEN_KEY } from "@/constants/cookie";
import { api } from "@/lib/axios";
import { LoginResponse, SignupResponse } from "@/types/auth";
import { removeCookie } from "@/utils/cookie";

import { ENDPOINT } from "../endpoint";

/** 로그인 API */
export const login = async (
  email: string,
  password: string,
): Promise<AxiosResponse<LoginResponse>> => {
  const res = await api.post<LoginResponse>(ENDPOINT.AUTH.LOGIN, {
    email,
    password,
  });

  const { accessToken } = res.data.credentials;

  await api.post(ENDPOINT.AUTH.SET_COOKIE, {
    accessToken,
  });

  return res;
};

/** 로그아웃 API */
export const logout = async (): Promise<AxiosResponse> => {
  const res = await api.post(ENDPOINT.AUTH.LOGOUT);
  removeCookie(ACCESS_TOKEN_KEY);

  return res;
};

/** 회원가입 API */
export const signup = async (
  name: string,
  email: string,
  password: string,
): Promise<AxiosResponse<SignupResponse>> => {
  const res = await api.post<SignupResponse>(ENDPOINT.AUTH.SIGNUP, {
    name,
    email,
    password,
  });

  return res;
};
