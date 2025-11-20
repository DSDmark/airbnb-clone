import {
  CONFIG_ROUTE,
  INDEPENDENT_ROUTS,
  ITEMS_PER_PAGE,
  PROTECTED_ROUTE,
  ROLES,
  SEI_ROUTE,
  SERVER_ENVIRONMENTS,
  STRUCTURE_ROUTE,
  TOOLS_ENVIRONMENT,
  USER_ROUTER,
  VS_ROUTE,
} from "@/constants"
import { OnChange, OnClick, type Role, type UserPermissions } from "@/types"
import { SetStateAction } from "react"
import toast from "react-hot-toast"

import { formatDateUtil } from "./dates"

/**
 * Converts a string representation of a number to a boolean.
 * Returns true if the string can be parsed as a non-zero integer, otherwise false.
 *
 * @param {string} value - The string to convert to a boolean.
 * @returns {boolean} - The resulting boolean value.
 */
export const validBoolUtil = (value: string): boolean => {
  if (typeof value === "boolean") {
    return value
  }
  return Boolean(parseInt(value))
}

export function interpolateUtil(template: string, data: Record<string, any>, fallback = ""): string {
  if (!template) return ""
  return String(template).replace(/{{\s*([\w.]+)\s*}}/g, (_match, key) => {
    const value = key.split(".").reduce((o: any, k: any) => (o && o[k] !== undefined ? o[k] : undefined), data)
    return value === undefined || value === null ? fallback : String(value)
  })
}

/**
 * Finds the key in the ITEMS_PER_PAGE object that corresponds to the given numeric value.
 *
 * @param {number} value - The numeric value to look up.
 * @returns {string | undefined} - The corresponding key if found, otherwise undefined.
 */
export const getItemsPerPageUtil = (value: number): string | undefined => {
  const itemsPerPageArray = Object.entries(ITEMS_PER_PAGE) as [string, number][]
  const entry = itemsPerPageArray.find(([, val]) => val === value)
  return entry ? entry[0] : undefined
}

/**
 * Updates the page state with the given page number.
 *
 * @param {number} page - The page number to set.
 * @param {SetStateAction<any>} setState - The state setter function.
 */
export const handlePageUtil = (page: number, setState: SetStateAction<any>) => {
  setState((prev: any) => ({ ...prev, filters: { ...prev.filters, page: page - 1 } }))
}

/**
 * Removes empty values from an object recursively.
 *
 * @param {Record<string, any>} obj - The object to clean.
 * @returns {Record<string, any>} - The cleaned object.
 */
export const removeEmptyValuesUtil = (obj: Record<string, any>) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && Array.isArray(obj[key]) && obj[key].length === 0) {
      delete obj[key]
    } else if (obj[key] && typeof obj[key] === "object") {
      removeEmptyValuesUtil(obj[key])
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key]
      }
    } else if (obj[key] === undefined || obj[key] === null || obj[key] === "") {
      delete obj[key]
    }
  })
  return obj
}

/**
 * Formats a project type string by replacing underscores with spaces and capitalizing the first letter of each word.
 *
 * @param {any} type - The project type string to format.
 * @returns {string} - The formatted project type string.
 */
export const formatUnderscoreValue = (type: any) => {
  if (!type) return ""
  return type.replace(/_/g, " ").replace(/\b\w/g, (char: any) => char.toUpperCase())
}

/**
 * close all dialog by single function
 *
 * @param {any} setState - whole state to close all dialog
 * @returns {any} - All dialog updated state
 */
export const handleClose = (setState: any) => {
  setState((prevState: any) => {
    const updatedState = { ...prevState }
    Object.keys(updatedState).forEach(key => {
      if (key.endsWith("Dialog")) {
        updatedState[key] = false
      }
    })
    return updatedState
  })
}

/**
 * handling dialog to set true for dialog
 *
 * @param {any} state - whole state to set true dialog
 * @param {any} setState - whole state to dialog
 * @returns {any} - All dialog updated state
 */
export const handleOpen = (e: OnClick, state: any, setState: any) => {
  const name = e.target.name || e.currentTarget.dataset.name
  if (name === "addReportDialog") {
    if (!state.selectedReport.length) toast.error("Please select report first")
    else setState((prev: any) => ({ ...prev, [name]: true }))
  } else {
    setState((prev: any) => ({ ...prev, [name]: true, flag: true }))
  }
}

/**
 * Truncates a given string to a specified maximum length.
 * If the string exceeds the maximum length, appends an ellipsis ("...").
 *
 * @param {string} val - The input string to be truncated.
 * @param {number} [maxTruncateVal=15] - The maximum length of the truncated string. Default is 15.
 * @returns {string} - The truncated string with an ellipsis appended if it exceeds the maximum length, or the original string if it is within the limit.
 */
export const truncateVal = (val: string, maxTruncateVal = 15) => {
  return val.length > maxTruncateVal ? val.substring(0, maxTruncateVal) + "..." : val
}

/**
 * Formats two string values into a single string.
 * If the first value is defined, concatenates the first and second values separated by a comma.
 * If the first value is not defined, returns the second value as is.
 * If both values are undefined, returns an empty string.
 *
 * @param {string} [val1] - The first string value.
 * @param {string} [val2] - The second string value.
 * @returns {string} - A formatted string combining the first and second values with a comma if the first value is defined, or just the second value if the first is not defined. Returns an empty string if both values are undefined.
 */
export function formatTwoValues(val1?: string, val2?: any, symbol: string = ","): string {
  return val1 ? `${val1}${symbol} ${val2}` : val2 || ""
}

/**
 * Removes properties with `undefined` values from an object.
 *
 * This function takes an object and filters out any properties where the value is `undefined`.
 * It returns a new object containing only the properties with defined values.
 *
 * @param {Object} params - The object containing key-value pairs to be filtered.
 * @param {any} params[key] - The value associated with each key in the object. Only properties with defined values are retained.
 * @returns {Object} - A new object with all `undefined` values removed.
 *                     The resulting object includes only the properties with defined values.
 *
 * @example
 * const originalParams = { id: 123, name: undefined, age: 30 };
 * const filteredParams = removeUndefinedParams(originalParams);
 * console.log(filteredParams); // Output: { id: 123, age: 30 }
 */
export const removeUndefinedParams = (params: any) => {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null))
}

/**
 * Prefixes a link with "https://" if it does not already start with it.
 *
 * @param {string} link - The link to be prefixed.
 * @returns {string} - The prefixed link.
 *                     If the input link already starts with "https://", the input link is returned unchanged.
 *                     Otherwise, the input link is prefixed with "https://" and returned.
 *
 * @example
 * const prefixedLink = url("example.com");
 * console.log(prefixedLink); // Output: "https://example.com"
 */
/**
 * Converts an object's values to match its keys
 * @param obj - The object to convert
 * @returns A new object where each value is the same as its key
 */
export function convertObjectKeysToValues<T extends Record<string, any>>(obj: T): Record<keyof T, string> {
  return Object.keys(obj).reduce(
    (acc, key) => {
      acc[key as keyof T] = key
      return acc
    },
    {} as Record<keyof T, string>,
  )
}

export const addTimestampToImageUtil = (imageUrl?: string): string => {
  if (!imageUrl || imageUrl.trim().length === 0) {
    return ""
  }
  return `${imageUrl}?t=${new Date().getTime()}`
}

export const handleAllSelectTableEntriesUtils = (e: OnChange, setState: any, data: any, name: any) => {
  if (e.target.checked) {
    setState((prev: any) => ({
      ...prev,
      filters: { ...prev.filters, selectedAll: data?.map((i: any) => i[name]) },
    }))
  } else {
    setState((prev: any) => ({
      ...prev,
      filters: { ...prev.filters, selectedAll: [] },
    }))
  }
}

/**
 * Sorts an array of objects in-place and returns the sorted array.
 *
 * @param {T[]} [array=[]] - The array of objects to be sorted.
 * @param {keyof T} [key="id"] - The key of the object to sort by.
 * @param {"asc" | "desc"} [order="desc"] - The sort order.
 * @returns {T[]} - The sorted array.
 *
 * @example
 * const unsortedArray = [{ id: 3, name: "John" }, { id: 1, name: "Alice" }, { id: 2, name: "Bob" }]
 * const sortedArray = sort(unsortedArray, "name", "asc")
 * console.log(sortedArray); // Output: [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }, { id: 3, name: "John" }]
 */

export const sort = <T extends Record<string, any>>(
  array: T[] = [],
  key: keyof T = "id",
  order: "asc" | "desc" = "desc",
): T[] => {
  const orderBy = () => {
    const userAgent = navigator.userAgent.toLowerCase()

    if (userAgent.includes("firefox")) {
      return order === "desc" ? "asc" : "desc"
    } else if (userAgent.includes("safari")) {
      return order === "asc" ? "desc" : "desc"
    } else {
      return order
    }
  }

  return [...array].sort((a: any, b: any) => {
    const valueA = a[key]
    const valueB = b[key]
    const userAgent = navigator.userAgent.toLowerCase()
    let comparison: number

    if (key === "id" || (typeof valueA === "number" && typeof valueB === "number")) {
      comparison = Number(valueA) - Number(valueB)
      return orderBy() === "asc" ? -comparison : comparison
    } else if (typeof valueA === "string" && typeof valueB === "string") {
      if (userAgent.includes("firefox")) {
        comparison = valueA.localeCompare(valueB)
        return comparison
      } else {
        comparison = valueA.localeCompare(valueB)
        return orderBy() === "asc" ? -comparison : comparison
      }
    } else {
      comparison = String(valueA).localeCompare(String(valueB))
      return orderBy() === "asc" ? -comparison : comparison
    }
  })
}

// any permission to be assign here base on the role
export const pageAccessPermissionsBaseOnRoleUtil = (permissions: UserPermissions, role: Role): string[] => {
  const { routes } = permissions
  const pagePermission: Record<Role, string[]> = {
    [ROLES.master]: [...Object.values(PROTECTED_ROUTE)],
    [ROLES.referent]: [
      PROTECTED_ROUTE.dashboard,
      ...Object.values({
        ...CONFIG_ROUTE,
        ...USER_ROUTER,

        // credits
        transactions: routes.canViewTransactionCreditHistory ? USER_ROUTER.regularCredits : "",

        // pricing
        pricing: routes?.addEditPricing ? CONFIG_ROUTE.pricing : "",
        createPricing: routes?.addEditPricing ? CONFIG_ROUTE.createPricing : "",

        // translation & languages
        languages: routes?.canEditLangAndTrans ? CONFIG_ROUTE.languages : "",
        translations: routes?.canEditLangAndTrans ? CONFIG_ROUTE.translations : "",

        // norms sections
        impression: routes?.canEditNorms ? CONFIG_ROUTE.impression : "",
        norms: routes?.canEditNorms ? CONFIG_ROUTE.norms : "",
        areaParameters: routes?.canEditNorms ? CONFIG_ROUTE.areaParameters : "",
        correctionFactors: routes?.canEditNorms ? CONFIG_ROUTE.correctionFactors : "",
        completionTimeRange: routes?.canEditNorms ? CONFIG_ROUTE.completionTimeRange : "",
        positiveImpressionRange: routes?.canEditNorms ? CONFIG_ROUTE.positiveImpressionRange : "",

        // questionnaire
        items: routes?.canEditItemsTemplates ? CONFIG_ROUTE.items : "",
        editItems: routes?.canEditItemsTemplates ? CONFIG_ROUTE.editItems : "",

        // email template
        email: routes?.canEditEmailTemplates ? CONFIG_ROUTE.email : "",
        emailAddEdit: routes?.canEditEmailTemplates ? CONFIG_ROUTE.emailAddEdit : "",
        emailSent: routes?.canEditEmailTemplates ? CONFIG_ROUTE.emailSent : "",

        // editor
        assessmentEditor: routes?.canEditAssessmentEditor ? CONFIG_ROUTE.assessmentEditor : "",
        vsInstructionEditor: routes?.canEditAssessmentEditor ? CONFIG_ROUTE.vsInstructionEditor : "",

        // structure
        distributorList: routes.canAddEditDistributor ? STRUCTURE_ROUTE.distributorList : "",
        editDistributor: routes.canAddEditDistributor ? STRUCTURE_ROUTE.editDistributor : "",
        addDistributor: routes.canAddEditDistributor ? STRUCTURE_ROUTE.addDistributor : "",

        addEditReferent: routes.canCreateNewEditCoachesReferents ? STRUCTURE_ROUTE.addEditReferent : "",
        coachList: routes.canCreateNewEditCoachesReferents ? STRUCTURE_ROUTE.coachList : "",
        addEditCoach: routes.canCreateNewEditCoachesReferents ? STRUCTURE_ROUTE.addEditCoach : "",

        // report
        reports: routes.canViewConfigReport ? CONFIG_ROUTE.reports : "",
        reportsEditor:
          routes.canViewConfigReport && TOOLS_ENVIRONMENT !== SERVER_ENVIRONMENTS.production
            ? CONFIG_ROUTE.reportsEditor
            : "",

        // ================= report according permission =================
        // sei - adult - projects
        adultProjectList: routes.canSeiProjects ? SEI_ROUTE.adultProjectList : "",
        adultProjectCreate: routes.canSeiProjects ? SEI_ROUTE.adultProjectCreate : "",
        adultProjectReportList: routes.canSeiProjects ? SEI_ROUTE.adultProjectReportList : "",
        adultPrivateLinkList: routes.canSeiProjects ? SEI_ROUTE.adultPrivateLinkList : "",

        // sei - adult - groups
        adultGroupList: routes.canSeiGroup ? SEI_ROUTE.adultGroupList : "",
        adultGroupMembersList: routes.canSeiGroup ? SEI_ROUTE.adultGroupMembersList : "",
        adultGroupMembersAdd: routes.canSeiGroup ? SEI_ROUTE.adultGroupMembersAdd : "",

        // sei - youth - projects
        youthProjectList: routes.canYvProject ? SEI_ROUTE.youthProjectList : "",
        youthProjectCreate: routes.canYvProject ? SEI_ROUTE.youthProjectCreate : "",
        youthProjectReportList: routes.canYvProject ? SEI_ROUTE.youthProjectReportList : "",
        youthPrivateLinkList: routes.canYvProject ? SEI_ROUTE.youthPrivateLinkList : "",

        // sei - youth - groups
        youthGroupList: routes.canYvGroup ? SEI_ROUTE.youthGroupList : "",
        youthGroupMembersList: routes.canYvGroup ? SEI_ROUTE.youthGroupMembersList : "",
        youthGroupMembersAdd: routes.canYvGroup ? SEI_ROUTE.youthGroupMembersAdd : "",

        // sei - 360
        _360projectList: routes.canProject360 ? SEI_ROUTE._360projectList : "",

        // tvs
        vsTvsProjectsList: routes.canTvsProject ? VS_ROUTE.vsTvsProjectsList : "",
        vsTvsProjectsAddEdit: routes.canTvsProject ? VS_ROUTE.vsTvsProjectsAddEdit : "",
        vsTvsProjectsReportList: routes.canTvsProject ? VS_ROUTE.vsTvsProjectsReportList : "",
        vsTvsProjectsReportDetails: routes.canTvsProject ? VS_ROUTE.vsTvsProjectsReportDetails : "",
        vsTvsProjectsReportLists: routes.canTvsProject ? VS_ROUTE.vsTvsProjectsReportLists : "",

        // ovs
        vsOvsProjectsList: routes.canOvsProject ? VS_ROUTE.vsOvsProjectsList : "",
        vsOvsProjectsReportDetails: routes.canOvsProject ? VS_ROUTE.vsOvsProjectsReportDetails : "",
        vsOvsProjectsAddEdit: routes.canOvsProject ? VS_ROUTE.vsOvsProjectsAddEdit : "",
        vsOvsReports: routes.canOvsProject ? VS_ROUTE.vsOvsReports : "",

        // evs
        vsEvsProjectsList: routes.canEvsProject ? VS_ROUTE.vsEvsProjectsList : "",
        vsEvsProjectsReportDetails: routes.canEvsProject ? VS_ROUTE.vsEvsProjectsReportDetails : "",
        vsEvsProjectsAddEdit: routes.canEvsProject ? VS_ROUTE.vsEvsProjectsAddEdit : "",
        vsEvsReports: routes.canEvsProject ? VS_ROUTE.vsEvsReports : "",

        // lvs
        vsLvsProjectsList: routes.canLvsProject ? VS_ROUTE.vsLvsProjectsList : "",
      }),
    ],
    [ROLES.coach]: [
      ...Object.values({
        ...INDEPENDENT_ROUTS,
        ...USER_ROUTER,
        // ================= report according permission =================
        // sei - adult - projects
        adultProjectList: routes.canSeiProjects ? SEI_ROUTE.adultProjectList : "",
        adultProjectCreate: routes.canSeiProjects ? SEI_ROUTE.adultProjectCreate : "",
        adultProjectReportList: routes.canSeiProjects ? SEI_ROUTE.adultProjectReportList : "",
        adultPrivateLinkList: routes.canSeiProjects ? SEI_ROUTE.adultPrivateLinkList : "",

        // sei - adult - groups
        adultGroupList: routes.canSeiGroup ? SEI_ROUTE.adultGroupList : "",
        adultGroupMembersList: routes.canSeiGroup ? SEI_ROUTE.adultGroupMembersList : "",
        adultGroupMembersAdd: routes.canSeiGroup ? SEI_ROUTE.adultGroupMembersAdd : "",

        // sei - youth - projects
        youthProjectList: routes.canYvProject ? SEI_ROUTE.youthProjectList : "",
        youthProjectCreate: routes.canYvProject ? SEI_ROUTE.youthProjectCreate : "",
        youthProjectReportList: routes.canYvProject ? SEI_ROUTE.youthProjectReportList : "",
        youthPrivateLinkList: routes.canYvProject ? SEI_ROUTE.youthPrivateLinkList : "",

        // sei - youth - groups
        youthGroupList: routes.canYvGroup ? SEI_ROUTE.youthGroupList : "",
        youthGroupMembersList: routes.canYvGroup ? SEI_ROUTE.youthGroupMembersList : "",
        youthGroupMembersAdd: routes.canYvGroup ? SEI_ROUTE.youthGroupMembersAdd : "",

        // sei - 360
        _360projectList: routes.canProject360 ? SEI_ROUTE._360projectList : "",

        // tvs
        vsTvsProjectsList: routes.canTvsProject ? VS_ROUTE.vsTvsProjectsList : "",
        vsTvsProjectsAddEdit: routes.canTvsProject ? VS_ROUTE.vsTvsProjectsAddEdit : "",
        vsTvsProjectsReportList: routes.canTvsProject ? VS_ROUTE.vsTvsProjectsReportList : "",
        vsTvsProjectsReportDetails: routes.canTvsProject ? VS_ROUTE.vsTvsProjectsReportDetails : "",
        vsTvsProjectsReportLists: routes.canTvsProject ? VS_ROUTE.vsTvsProjectsReportLists : "",

        // ovs
        vsOvsProjectsList: routes.canOvsProject ? VS_ROUTE.vsOvsProjectsList : "",
        vsOvsProjectsReportDetails: routes.canOvsProject ? VS_ROUTE.vsOvsProjectsReportDetails : "",
        vsOvsProjectsAddEdit: routes.canOvsProject ? VS_ROUTE.vsOvsProjectsAddEdit : "",
        vsOvsReports: routes.canOvsProject ? VS_ROUTE.vsOvsReports : "",

        // evs
        vsEvsProjectsList: routes.canEvsProject ? VS_ROUTE.vsEvsProjectsList : "",
        vsEvsProjectsReportDetails: routes.canEvsProject ? VS_ROUTE.vsEvsProjectsReportDetails : "",
        vsEvsProjectsAddEdit: routes.canEvsProject ? VS_ROUTE.vsEvsProjectsAddEdit : "",
        vsEvsReports: routes.canEvsProject ? VS_ROUTE.vsEvsReports : "",

        // lvs
        vsLvsProjectsList: routes.canLvsProject ? VS_ROUTE.vsLvsProjectsList : "",
      }),
    ],
    [ROLES.distributor]: [],
  }
  return pagePermission[role].filter(Boolean)
}

export function transformPermissionsDataUtil(data: any, reportData: boolean = true) {
  return Object.entries(data)
    .map(([key, value]: any) => {
      let transformedData
      if (Array.isArray(value)) {
        transformedData = value
      } else if (typeof value === "object" && value !== null) {
        if (value?.id) {
          transformedData = [value]
        } else {
          transformedData = Object.entries(value).map(([subKey, subValue]: any) => {
            if (Array.isArray(subValue)) {
              if (!reportData) {
                return {
                  label: subKey,
                  data: subValue,
                }
              } else {
                return {
                  label: subKey,
                  reporttype: "Cert",
                  selected: false,
                  expireddates: formatDateUtil(new Date(), "date"),
                  data: subValue,
                  certified: false,
                }
              }
            } else {
              return subValue
            }
          })
        }
      } else {
        transformedData = [value]
      }

      if (transformedData.length) {
        if (!reportData) {
          return {
            label: key,
            data: transformedData,
          }
        } else {
          return {
            label: key,
            reporttype: "Cert",
            expireddates: formatDateUtil(new Date(), "date"),
            selected: false,
            data: transformedData,
            certified: false,
          }
        }
      } else {
        return null
      }
    })
    .filter(item => item !== null)
}
