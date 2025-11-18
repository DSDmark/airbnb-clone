import userAPIs from "@/api/user"
import { APP_NAME, APP_NAMES, FRONTEND_BASE_URL, LOGIN_REDIRECT_URL, PUBLIC_ROUTE, TOOLS_TOKEN_NAME } from "@/constants"
import { createAsyncThunk } from "@reduxjs/toolkit"
import Cookie from "js-cookie"
import Router from "next/router"

import { persistor, setIsLoggedIn } from ".."
import { resetPermissions, setPermissions, setTranslationPermissions } from "../reducers/permission"

export const getUserData = createAsyncThunk(
  "user/getUserDetails",
  async (id: number | null, { dispatch, rejectWithValue }) => {
    const res = await dispatch(userAPIs.endpoints.getUserDetails.initiate({ id }))
    if (res.data) {
      dispatch(
        setPermissions({
          role: res?.data?.data?.user.role,
          permissions: res.data?.data?.permissions,
          user: res?.data?.data?.user,
        }),
      )
      dispatch(getUserAppAccess(res?.data?.data?.user?.ssoId))
      return res.data.data
    } else {
      return rejectWithValue(res.error)
    }
  },
)

export const getUserAppAccess = createAsyncThunk(
  "user/userAppAccess",
  async (id: string, { dispatch, rejectWithValue }) => {
    const res = await dispatch(userAPIs.endpoints.userAppAccessList.initiate({ id }))
    if (res.data) {
      const isTranslation = res.data?.data?.some(i => i?.appAccess === APP_NAMES.translation) || false
      dispatch(setTranslationPermissions(isTranslation))
      return res.data.data
    } else {
      return rejectWithValue(res.error)
    }
  },
)

export const getTokenData = createAsyncThunk("user/getTokenData", async (_, { dispatch, rejectWithValue }) => {
  if (Object.values(PUBLIC_ROUTE).includes(Router.pathname.split("/[")[0])) return false
  const res = await dispatch(userAPIs.endpoints.getToken.initiate(null))
  if (res.data?.status === 200) {
    dispatch(setIsLoggedIn(true))
    return true
  } else {
    return rejectWithValue(res.error)
  }
})

export const resetUserData = createAsyncThunk("user/resetUser", async (_, { dispatch, rejectWithValue }) => {
  const res = await dispatch(userAPIs.endpoints.logout.initiate({}))
  if (res.data) {
    persistor.purge()
    Router.replace(
      `${LOGIN_REDIRECT_URL}/login?source=${APP_NAME}&returnUrl=${FRONTEND_BASE_URL + Router.pathname}` || "",
    )
    dispatch(resetPermissions())
    dispatch(setIsLoggedIn(false))
    Cookie.remove(TOOLS_TOKEN_NAME as string)
    return res.data.data
  } else {
    return rejectWithValue(res.error)
  }
})
