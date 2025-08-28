import axios from "axios";

import { ACCESS_TOKEN_KEY } from "@/constants/cookie";
import {
  getConfigWithAuthorizationHeaders,
  reissueAccessToken,
} from "@/services/auth/token";
import { ENDPOINT } from "@/services/endpoint";
import { getCookie, setCookie } from "@/utils/cookie";

import { ApiError } from "./error";

const isMockEnabled = process.env.NEXT_PUBLIC_MOCK_ENABLED;
const isProduction = process.env.NODE_ENV === "production";

const getBaseURL = () => {
  if (isMockEnabled) {
    return isProduction
      ? process.env.NEXT_PUBLIC_SITE_URL
      : process.env.NEXT_PUBLIC_LOCAL_SITE_URL;
  }

  return process.env.NEXT_PUBLIC_SERVER_ADDRESS;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

const noAuthPaths: string[] = [
  ENDPOINT.AUTH.LOGIN,
  ENDPOINT.AUTH.SET_COOKIE,
  ENDPOINT.AUTH.SIGNUP,
];

api.interceptors.request.use(
  async (config) => {
    if (config.url && noAuthPaths.includes(config.url)) {
      return config;
    }

    const accessToken = await getCookie(ACCESS_TOKEN_KEY);

    if (accessToken) {
      return getConfigWithAuthorizationHeaders(config, accessToken);
    }

    const newAccessToken = await reissueAccessToken();

    if (newAccessToken) {
      setCookie(ACCESS_TOKEN_KEY, newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });

      return getConfigWithAuthorizationHeaders(config, newAccessToken);
    }

    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(new ApiError(error)),
);
