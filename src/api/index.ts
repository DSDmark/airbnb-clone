import { AUTH_ROUTE, SERVER_STATUS_CODE } from "@/constants"
import {
  BASE_URL_WITH_POSTFIX,
  DEV,
  SSO_FRONTEND_BASE_URL,
  SSO_UN_AUTHORIZED_REDIRECT,
  TOOLS_TOKEN_NAME,
} from "@/constants/env"
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import Cookies from "js-cookie"
import Router from "next/router"

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${BASE_URL_WITH_POSTFIX}`,
    credentials: "include",
    prepareHeaders: headers => {
      return headers
    },
  })

  const result = await rawBaseQuery(args, api, extraOptions)
  return result
}

const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === SERVER_STATUS_CODE.forbidden) {
    window.dispatchEvent(new Event("storage"))
    Router.push(DEV ? AUTH_ROUTE.login : SSO_FRONTEND_BASE_URL || "")
  } else if (result.error && result.error.status === SERVER_STATUS_CODE.authenticationDenied) {
    window.dispatchEvent(new Event("storage"))
    Router.push(SSO_UN_AUTHORIZED_REDIRECT || "")
    Cookies.remove(TOOLS_TOKEN_NAME as string)
  }

  return result
}

export const baseApi = createApi({
  reducerPath: "apiService",
  baseQuery: baseQueryWithReAuth,
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})
