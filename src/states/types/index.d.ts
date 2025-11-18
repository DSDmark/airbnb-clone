// import { AssessmentInvitationDetails } from "@/api/transforms/common"
// import type { IAssessmentDetails } from "@/api/types/assessment"
// import { UserAppAccess } from "@/api/types/common"
// import type { IGlobalTranslationLanguagesList } from "@/api/types/translation"
// import { ASSESSMENT_COMPLETED_STEPS, ASSESSMENT_STATUS } from "@/constants"
// import { ISelectWithSearch, UserDetail } from "@/types"

// export interface IUserInitialState {
//   currentUser: Omit<UserDetail, "permissions">
//   userAppAccess: UserAppAccess[]
//   isLoggedIn: boolean
// }

// type SearchCommonData = {
//   isLoading: boolean
//   data: ISelectWithSearch[]
// }
// export interface ISearchCommonDataInitialState {
//   isLoading: boolean
//   jobRole: SearchCommonData
//   countries: SearchCommonData
//   distributor: SearchCommonData
//   coach: SearchCommonData
//   educations: SearchCommonData
//   sector: SearchCommonData
//   jobsFunctions: SearchCommonData
//   norm: SearchCommonData
//   pricing: SearchCommonData
//   language: SearchCommonData
//   page: SearchCommonData
//   projectType: SearchCommonData
//   reportLanguages: SearchCommonData
//   empRoles: SearchCommonData
// }

// export interface ITranslationInitialState {
//   languageData: Record<string, string>
// }

// export interface IAssessmentInitialState {
//   assessmentDetails: IAssessmentDetails
//   invitations: AssessmentInvitationDetails[]
//   selectedLanguage: ISelectWithSearch
//   assessmentType: {
//     type: "public" | "private" | undefined
//     id1: undefined | string
//     id2: undefined | string
//     tempTestTakerId: string | undefined
//     testTaker: string | undefined
//     testTakerTime: null | number
//   }
//   status: (typeof ASSESSMENT_STATUS)[keyof typeof ASSESSMENT_STATUS]
//   completedStep: (typeof ASSESSMENT_COMPLETED_STEPS)[keyof typeof ASSESSMENT_COMPLETED_STEPS]
// }

// export interface IUiInitialState {
//   isCreditReqLinkVisited: boolean
//   globalLoader: boolean
//   pagePerItm: number
//   selectedInterFaceLanguage: any
//   interFaceLanguagesList: IGlobalTranslationLanguagesList[]
//   isDesktopCollapsed: boolean
// }
