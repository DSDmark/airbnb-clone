import { createSlice } from "@reduxjs/toolkit"

import { translationInitialState } from "../constants"

const translationSlice = createSlice({
  name: "translationSlice",
  initialState: translationInitialState,
  reducers: {
    setTranslationData: (state, action) => {
      state.languageData = action.payload
    },
  },
})

// export const { setTranslationData } = translationSlice.actions
export default translationSlice.reducer
