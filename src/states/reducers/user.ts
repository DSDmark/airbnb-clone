import { createSlice } from "@reduxjs/toolkit"

import { getTokenData, getUserAppAccess, getUserData, resetUserData } from "../actions"
import { userInitialState } from "../constants"

const userDetailSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser.additionalData = action.payload.additionalData
      state.currentUser.user = action.payload.user
    },
    resetUser: state => {
      state.currentUser = userInitialState.currentUser
    },
    setNotification: (state, action) => {
      state.currentUser.user.notificationCount = action.payload
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload
    },
    setUserAppAccess: (state, action) => {
      state.userAppAccess = action.payload
    },
  },
  extraReducers: builder => {
    // user
    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.currentUser.user = action.payload.user
      state.currentUser.additionalData = action.payload.additionalData
    })
    // reset
    builder.addCase(resetUserData.fulfilled, state => {
      state.currentUser = userInitialState.currentUser
    })
    // token
    builder.addCase(getTokenData.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload || false
    })
    // appAccess
    builder.addCase(getUserAppAccess.fulfilled, (state, action) => {
      state.userAppAccess = action.payload
    })
  },
})

export const { setCurrentUser, resetUser, setIsLoggedIn, setNotification } = userDetailSlice.actions
export default userDetailSlice.reducer
