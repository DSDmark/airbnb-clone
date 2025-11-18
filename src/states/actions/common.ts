import commonAPIs from "@/api/common"
import { DEFAULT_PARAMS } from "@/constants"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const searchCountriesData = createAsyncThunk("common/countries", async (_, { dispatch, rejectWithValue }) => {
  const res = await dispatch(commonAPIs.endpoints.getCountries.initiate())
  if (res.data) {
    return res.data.data
  } else {
    return rejectWithValue(res.error)
  }
})

export const searchJobsFunctionData = createAsyncThunk(
  "common/jobFunctions",
  async (_, { dispatch, rejectWithValue }) => {
    const res = await dispatch(commonAPIs.endpoints.getJobFunction.initiate())
    if (res.data) {
      return res.data.data
    } else {
      return rejectWithValue(res.error)
    }
  },
)

export const searchEducationData = createAsyncThunk("common/educations", async (_, { dispatch, rejectWithValue }) => {
  const res = await dispatch(commonAPIs.endpoints.getEducation.initiate())
  if (res.data) {
    return res.data.data
  } else {
    return rejectWithValue(res.error)
  }
})

export const searchJobsRoleData = createAsyncThunk("common/jobsRoles", async (_, { dispatch, rejectWithValue }) => {
  const res = await dispatch(commonAPIs.endpoints.getJobRoles.initiate())
  if (res.data) {
    return res.data.data
  } else {
    return rejectWithValue(res.error)
  }
})

export const searchSectorsData = createAsyncThunk("common/sectors", async (_, { dispatch, rejectWithValue }) => {
  const res = await dispatch(commonAPIs.endpoints.getSectors.initiate())
  if (res.data) {
    return res.data.data
  } else {
    return rejectWithValue(res.error)
  }
})

export const searchNormData = createAsyncThunk("common/norm", async (type: any, { dispatch, rejectWithValue }) => {
  const res = await dispatch(commonAPIs.endpoints.getNorms.initiate(type, { forceRefetch: true }))
  if (res.data) {
    return res.data.data
  } else {
    return rejectWithValue(res.error)
  }
})

export const searchProjectTypeData = createAsyncThunk(
  "common/projectTypes",
  async (type: any, { dispatch, rejectWithValue }) => {
    const res = await dispatch(commonAPIs.endpoints.getProjectTypes.initiate({ type }))
    if (res.data) {
      return res.data.data
    } else {
      return rejectWithValue(res.error)
    }
  },
)

export const searchPageOptionData = createAsyncThunk("common/pages", async (_, { dispatch, rejectWithValue }) => {
  const res = await dispatch(commonAPIs.endpoints.getPages.initiate())
  if (res.data) {
    return res.data.data
  } else {
    return rejectWithValue(res.error)
  }
})

export const searchLanguageData = createAsyncThunk("common/languages", async (_, { dispatch, rejectWithValue }) => {
  const res = await dispatch(commonAPIs.endpoints.getLanguages.initiate({}))
  if (res.data) {
    return res.data.data
  } else {
    return rejectWithValue(res?.error)
  }
})

export const searchDistributorData = createAsyncThunk(
  "common/distributors",
  async (val: any, { dispatch, rejectWithValue }) => {
    const res = await dispatch(commonAPIs.endpoints.getDistributors.initiate(val, { forceRefetch: true }))
    if (res.data) {
      return res.data.data
    } else {
      return rejectWithValue(res.error)
    }
  },
)

export const searchCoachesData = createAsyncThunk("common/coaches", async (val: any, { dispatch, rejectWithValue }) => {
  const res = await dispatch(
    commonAPIs.endpoints.getCoaches.initiate({ ...val, ...DEFAULT_PARAMS }, { forceRefetch: true }),
  )
  if (res.data) {
    return res.data.data
  } else {
    return rejectWithValue(res.error)
  }
})

export const searchPricingData = createAsyncThunk("common/pricing", async (_, { dispatch, rejectWithValue }) => {
  const res = await dispatch(commonAPIs.endpoints.getPricing.initiate())
  if (res.data) {
    return res.data.data
  } else {
    return rejectWithValue(res.error)
  }
})

export const searchReportLanguageData = createAsyncThunk(
  "common/reportLang",
  async (_, { dispatch, rejectWithValue }) => {
    const res = await dispatch(commonAPIs.endpoints.getReportsByLanguages.initiate())
    if (res.data) {
      return res.data.data
    } else {
      return rejectWithValue(res.error)
    }
  },
)

export const searchEmpRolesData = createAsyncThunk("common/empRoles", async (_, { dispatch, rejectWithValue }) => {
  const res = await dispatch(commonAPIs.endpoints.getEmpRoles.initiate())
  if (res.data) {
    return res.data.data
  } else {
    return rejectWithValue(res.error)
  }
})
