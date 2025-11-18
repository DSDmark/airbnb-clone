import { transformUserPermissions } from "@/api/transforms/common"
import { ROLES } from "@/constants"
import type { UserPermissions } from "@/types"
import { createSlice } from "@reduxjs/toolkit"

import { permissionsInitialState } from "../constants"

const permissionsSlice = createSlice({
  name: "permissions",
  initialState: permissionsInitialState,
  reducers: {
    resetPermissions: state => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state = permissionsInitialState
    },
    setPermissions: (state, action) => {
      if (action.payload?.role) {
        if (action?.payload?.role === ROLES.referent) {
          state.options = action?.payload?.permissions.options
          state.routes = action?.payload?.permissions.routes
        } else if (action.payload.role === ROLES.coach) {
          // const permissions = transformUserPermissions({}, false)
          const permissionsForCoach: UserPermissions = {
            ...action?.payload?.permissions,
            options: {
              ...action?.payload?.permissions,
              canViewEditProjects: true,
              canApproveExtendFreeProjects: true,
            },
          }
          state.options = permissionsForCoach.options
          state.routes = permissionsForCoach.routes
        } else {
          const permissions = transformUserPermissions({}, true)
          state.options = permissions.options
          state.routes = permissions.routes
        }
      } else {
        state = action.payload
      }
    },
    setTranslationPermissions: (state, action) => {
      state.routes.canEditEmailTemplates = action.payload
      state.routes.canEditLangAndTrans = action.payload
    },
  },
})

export const { resetPermissions, setPermissions, setTranslationPermissions } = permissionsSlice.actions
export default permissionsSlice.reducer
