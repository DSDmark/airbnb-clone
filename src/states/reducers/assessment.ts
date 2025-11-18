import { ASSESSMENT_COMPLETED_STEPS, ASSESSMENT_STATUS } from "@/constants"
import { createSlice } from "@reduxjs/toolkit"

import { assessmentInitialState } from "../constants"

const userDetailSlice = createSlice({
  name: "assessment",
  initialState: assessmentInitialState,
  reducers: {
    setAssessmentDetails: (state, action) => {
      state.assessmentDetails = action.payload
      if (action.payload?.invitation?.length) {
        const temp = state.assessmentType?.id2?.split("-") || []
        const id = temp[temp.length - 1]
        const filteredInvitations = action.payload?.invitation?.filter((itm: any) => {
          const linkParts = itm.link.split("-")
          const linkLastPart = linkParts[linkParts.length - 1]
          return linkLastPart === id
        })

        state.invitations = filteredInvitations

        if (filteredInvitations.length) {
          filteredInvitations.forEach((itm: any) => {
            if (itm?.testTaker?.id) {
              state.assessmentType.tempTestTakerId = itm?.testTaker?.id || null
              state.assessmentType.testTaker = itm?.tempTestTaker?.id || null
              if (itm.taken) {
                state.completedStep = ASSESSMENT_COMPLETED_STEPS.demographic
                state.status = ASSESSMENT_STATUS.pending
              } else {
                state.completedStep = ASSESSMENT_COMPLETED_STEPS.started
                state.status = ASSESSMENT_STATUS.pending
              }
            }
          })
        }
      }
    },
    setAssessmentStatusAndSteps: (state, action) => {
      state.status = action.payload.status
      state.completedStep = action.payload.completedStep
      state.assessmentType = action.payload.assessmentType
    },
    setSelectedLang: (state, action) => {
      state.selectedLanguage = action.payload
    },
  },
})

export const { setAssessmentDetails, setAssessmentStatusAndSteps, setSelectedLang } = userDetailSlice.actions
export default userDetailSlice.reducer
