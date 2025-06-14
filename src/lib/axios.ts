import axios from "axios";

import { ACCESS_TOKEN_KEY } from "@/constants/cookie";
import {
  getConfigWithAuthorizationHeaders,
  reissueAccessToken,
} from "@/services/auth/token";
import { ENDPOINT } from "@/services/endpoint";
import { getCookie, setCookie } from "@/utils/cookie";

import { ApiError } from "./error";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_MOCK_ENABLED === "true"
      ? ""
      : process.env.NEXT_PUBLIC_SERVER_ADDRESS,
  withCredentials: true,
});

const noAuthPaths: string[] = [ENDPOINT.AUTH.LOGIN, ENDPOINT.AUTH.SIGNUP];

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
