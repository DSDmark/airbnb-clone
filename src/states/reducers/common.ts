import { createSlice } from "@reduxjs/toolkit"

import {
  searchCoachesData,
  searchCountriesData,
  searchDistributorData,
  searchEducationData,
  searchEmpRolesData,
  searchJobsFunctionData,
  searchJobsRoleData,
  searchLanguageData,
  searchNormData,
  searchPageOptionData,
  searchPricingData,
  searchProjectTypeData,
  searchReportLanguageData,
  searchSectorsData,
} from "../actions"
import { searchCommonDataInitialState } from "../constants"

const searchCommonDataSlice = createSlice({
  name: "searchCommonData",
  initialState: searchCommonDataInitialState,
  reducers: {
    setCountry: (state, action) => {
      state.countries = action.payload
    },
    setDistributor: (state, action) => {
      state.distributor.isLoading = action.payload.isLoading
      state.distributor.data = action.payload.data
    },
    setReportLanguage: (state, action) => {
      state.reportLanguages.isLoading = action.payload.isLoading
      state.reportLanguages.data = action.payload.data
    },
  },
  extraReducers: builder => {
    // countries
    builder.addCase(searchCountriesData.pending, state => {
      state.countries.data = []
      state.countries.data = searchCommonDataInitialState.countries.data
      state.countries.isLoading = true
    })
    builder.addCase(searchCountriesData.fulfilled, (state, action) => {
      state.countries.isLoading = false
      state.countries.data = action.payload
    })
    builder.addCase(searchCountriesData.rejected, state => {
      state.countries.isLoading = false
    })
    // education
    builder.addCase(searchEducationData.pending, state => {
      state.educations.data = []
      state.educations.data = searchCommonDataInitialState.educations.data
      state.educations.isLoading = true
    })
    builder.addCase(searchEducationData.fulfilled, (state, action) => {
      state.educations.isLoading = false
      state.educations.data = action.payload
    })
    builder.addCase(searchEducationData.rejected, state => {
      state.educations.isLoading = false
    })
    // job function
    builder.addCase(searchJobsFunctionData.pending, state => {
      state.jobsFunctions.data = []
      state.jobsFunctions.data = searchCommonDataInitialState.jobsFunctions.data
      state.jobsFunctions.isLoading = true
    })
    builder.addCase(searchJobsFunctionData.fulfilled, (state, action) => {
      state.jobsFunctions.isLoading = false
      state.jobsFunctions.data = action.payload
    })
    builder.addCase(searchJobsFunctionData.rejected, state => {
      state.jobsFunctions.isLoading = false
    })
    // jobRole
    builder.addCase(searchJobsRoleData.pending, state => {
      state.jobRole.data = []
      state.jobRole.data = searchCommonDataInitialState.jobRole.data
      state.jobRole.isLoading = true
    })
    builder.addCase(searchJobsRoleData.fulfilled, (state, action) => {
      state.jobRole.isLoading = false
      state.jobRole.data = action.payload
    })
    builder.addCase(searchJobsRoleData.rejected, state => {
      state.jobRole.isLoading = false
    })
    // sector
    builder.addCase(searchSectorsData.pending, state => {
      state.sector.data = []
      state.sector.data = searchCommonDataInitialState.sector.data
      state.sector.isLoading = true
    })
    builder.addCase(searchSectorsData.fulfilled, (state, action) => {
      state.sector.isLoading = false
      state.sector.data = action.payload
    })
    builder.addCase(searchSectorsData.rejected, state => {
      state.sector.isLoading = false
    })
    // page
    builder.addCase(searchPageOptionData.pending, state => {
      state.page.data = []
      state.page.data = searchCommonDataInitialState.page.data
      state.page.isLoading = true
    })
    builder.addCase(searchPageOptionData.fulfilled, (state, action) => {
      state.page.isLoading = false
      state.page.data = action.payload
    })
    builder.addCase(searchPageOptionData.rejected, state => {
      state.page.isLoading = false
    })
    // language
    builder.addCase(searchLanguageData.pending, state => {
      state.language.data = []
      state.language.data = searchCommonDataInitialState.language.data
      state.language.isLoading = true
    })
    builder.addCase(searchLanguageData.fulfilled, (state, action) => {
      state.language.isLoading = false
      state.language.data = action.payload
    })
    builder.addCase(searchLanguageData.rejected, state => {
      state.language.isLoading = false
    })
    // norm
    builder.addCase(searchNormData.pending, state => {
      state.norm.data = []
      state.norm.data = searchCommonDataInitialState.norm.data
      state.norm.isLoading = true
    })
    builder.addCase(searchNormData.fulfilled, (state, action) => {
      state.norm.isLoading = false
      state.norm.data = action.payload
    })
    builder.addCase(searchNormData.rejected, state => {
      state.norm.isLoading = false
    })
    // project type
    builder.addCase(searchProjectTypeData.pending, state => {
      state.projectType.data = []
      state.projectType.data = searchCommonDataInitialState.projectType.data
      state.projectType.isLoading = true
    })
    builder.addCase(searchProjectTypeData.fulfilled, (state, action) => {
      state.projectType.isLoading = false
      state.projectType.data = action.payload
    })
    builder.addCase(searchProjectTypeData.rejected, state => {
      state.projectType.isLoading = false
    })
    // distributor
    builder.addCase(searchDistributorData.pending, state => {
      state.distributor.data = []
      state.distributor.data = searchCommonDataInitialState.distributor.data
      state.distributor.isLoading = true
    })
    builder.addCase(searchDistributorData.fulfilled, (state, action) => {
      state.distributor.isLoading = false
      state.distributor.data = action.payload
    })
    builder.addCase(searchDistributorData.rejected, state => {
      state.distributor.isLoading = false
    })
    // coach
    builder.addCase(searchCoachesData.pending, state => {
      state.coach.data = []
      state.coach.data = searchCommonDataInitialState.coach.data
      state.coach.isLoading = true
    })
    builder.addCase(searchCoachesData.fulfilled, (state, action) => {
      state.coach.isLoading = false
      state.coach.data = action.payload
    })
    builder.addCase(searchCoachesData.rejected, state => {
      state.coach.isLoading = false
    })
    // pricing
    builder.addCase(searchPricingData.pending, state => {
      state.pricing.data = []
      state.pricing.data = searchCommonDataInitialState.pricing.data
      state.pricing.isLoading = true
    })
    builder.addCase(searchPricingData.fulfilled, (state, action) => {
      state.pricing.isLoading = false
      state.pricing.data = action.payload
    })
    builder.addCase(searchPricingData.rejected, state => {
      state.pricing.isLoading = false
    })
    // reports language
    builder.addCase(searchReportLanguageData.pending, state => {
      state.reportLanguages.data = []
      state.reportLanguages.data = searchCommonDataInitialState.pricing.data
      state.reportLanguages.isLoading = true
    })
    builder.addCase(searchReportLanguageData.fulfilled, (state, action) => {
      state.reportLanguages.isLoading = false
      state.reportLanguages.data = action.payload
    })
    builder.addCase(searchReportLanguageData.rejected, state => {
      state.reportLanguages.isLoading = false
    })
    // emp roles
    builder.addCase(searchEmpRolesData.pending, state => {
      state.empRoles.data = []
      state.empRoles.data = searchCommonDataInitialState.pricing.data
      state.empRoles.isLoading = true
    })
    builder.addCase(searchEmpRolesData.fulfilled, (state, action) => {
      state.empRoles.isLoading = false
      state.empRoles.data = action.payload
    })
    builder.addCase(searchEmpRolesData.rejected, state => {
      state.empRoles.isLoading = false
    })
  },
})

export const { setReportLanguage } = searchCommonDataSlice.actions
export default searchCommonDataSlice.reducer
