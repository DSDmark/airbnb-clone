import { createSlice } from "@reduxjs/toolkit"

import { uiInitialState } from "../constants"

const uiSlice = createSlice({
  name: "ui",
  initialState: uiInitialState,
  reducers: {
    setGlobalLoader: (state, action) => {
      state.globalLoader = action.payload
    },
    setPagePerItm: (state, action) => {
      state.pagePerItm = action.payload
    },
    setSelectedTranslationUILanguage: (state, action) => {
      state.selectedInterFaceLanguage = action.payload
    },
    setInterFaceLanguagesList: (state, action) => {
      state.interFaceLanguagesList = action.payload
    },
    setIsDesktopCollapsed: (state, action) => {
      state.isDesktopCollapsed = action.payload
    },
    setIsCreditReqLinkVisited: (state, action) => {
      state.isCreditReqLinkVisited = action.payload
    },
  },
})

export const {
  setGlobalLoader,
  setPagePerItm,
  setSelectedTranslationUILanguage,
  setInterFaceLanguagesList,
  setIsDesktopCollapsed,
  setIsCreditReqLinkVisited,
} = uiSlice.actions
export default uiSlice.reducer
