import { COMMON_VALIDATION_MASSAGE, MAIN_DATE_FORMAT, PROJECT_TYPE_VALUE, REGEX, TRANSLATION_PREFIX } from "@/constants"
import type { t } from "@/types"
import moment from "moment"
import * as Yup from "yup"
import { array, boolean, date, number, object, string } from "yup"

const commonVal = {
  max: 1000,
  min: 1,
}

export const commonUtil = (t: t) => {
  return {
    email: string().matches(REGEX.email, t(COMMON_VALIDATION_MASSAGE.emailValidation)).trim(),
    name: string()
      .min(commonVal.min, t(COMMON_VALIDATION_MASSAGE.minVal))
      .max(commonVal.max, t(COMMON_VALIDATION_MASSAGE.maxVal)),
    surname: string()
      .min(commonVal.min, t(COMMON_VALIDATION_MASSAGE.minVal))
      .max(commonVal.max, t(COMMON_VALIDATION_MASSAGE.maxVal))
      .trim(),
    url: string().matches(REGEX.website, t(COMMON_VALIDATION_MASSAGE.urlValidation)).trim(),
    description: string()
      .max(commonVal.max, t(COMMON_VALIDATION_MASSAGE.maxVal))
      .min(commonVal.min, t(COMMON_VALIDATION_MASSAGE.minVal))
      .trim(),
    password: string()
      .matches(
        REGEX.password,
        t(
          `${TRANSLATION_PREFIX.validation}password must contain at least one uppercase letter, one number, and one special character`,
        ),
      )
      .min(8)
      .trim(),
    date: date()
      .default(() => new Date())
      .test("is-future-date", t(`${TRANSLATION_PREFIX.validation}date_cannot_be_in_the_past`), value => {
        const today = moment().startOf("day")
        const selectedDate = value ? moment(value).startOf("day") : null
        return !!selectedDate && selectedDate.isSameOrAfter(today)
      }),
    dateV2: Yup.string()
      .required("Date is required")
      .test("is-valid-format", `${TRANSLATION_PREFIX.validation}invalid_date_format`, value =>
        moment(value, MAIN_DATE_FORMAT, true).isValid(),
      )
      .test("is-future-date", `${TRANSLATION_PREFIX.validation}date_cannot_be_in_the_past`, value => {
        const today = moment().startOf("day")
        const selectedDate = moment(value, MAIN_DATE_FORMAT, true)
        return selectedDate.isSameOrAfter(today)
      }),
    positiveNumber: number().positive().integer(),
    projectType: object().shape({
      value: string().required(t(COMMON_VALIDATION_MASSAGE.projectType)),
      label: string().required(t(COMMON_VALIDATION_MASSAGE.projectType)),
    }),
    confirmPass: string()
      .test("passwords-match", t(`${TRANSLATION_PREFIX.validation}passwords_must_match`), function (value) {
        return value === this.parent.newPassword
      })
      .trim(),
    cvsFile: object().shape({
      file: Yup.mixed()
        .required(t(`${TRANSLATION_PREFIX.validation}file_is_required`))
        .test("fileSize", t(`${TRANSLATION_PREFIX.validation}file_is_required`), function (val: any) {
          return val && val.length > 0
        })
        .test("fileType", t(`${TRANSLATION_PREFIX.validation}unsupported_file_type`), function (val: any) {
          return (
            val &&
            ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(
              val[0]?.type,
            )
          )
        }),
    }),
  }
}

export const AuthValidationUtil = object().shape({
  email: string()
    .matches(REGEX.email, COMMON_VALIDATION_MASSAGE.emailValidation)
    .required(COMMON_VALIDATION_MASSAGE.email)
    .trim(),
  password: string()
    .matches(
      REGEX.password,
      "Password must contain at least one uppercase letter, one number, and one special character",
    )
    .min(8)
    .required(COMMON_VALIDATION_MASSAGE.password),
})

export const ResetPasswordValidationUtil = (t: t) =>
  object().shape({
    oldPassword: commonUtil(t).password.required(t(COMMON_VALIDATION_MASSAGE.oldPassword)),
    newPassword: commonUtil(t).password.required(t(COMMON_VALIDATION_MASSAGE.password)),
    passwordConfirmation: commonUtil(t).confirmPass,
  })

export const DemographicValidationUtil = (t: t) =>
  object().shape({
    fName: string().when("isAnonymousOptionForSeiAv", {
      is: (a: boolean) => a,
      then: schema => schema.notRequired(),
      otherwise: () => commonUtil(t).name.required(t(TRANSLATION_PREFIX.validation + "first_name_is_required")),
    }),
    lName: string().when("isAnonymousOptionForSeiAv", {
      is: (a: boolean) => a,
      then: schema => schema.notRequired(),
      otherwise: () => commonUtil(t).name.required(t(TRANSLATION_PREFIX.validation + "last_name_is_required")),
    }),
    email: string().when("isAnonymousOptionForSeiAv", {
      is: (a: boolean) => a,
      otherwise: () => commonUtil(t).email.required(t(COMMON_VALIDATION_MASSAGE.email)),
      then: schema => schema.notRequired(),
    }),
    uniqueIdentifier: string().when("isAnonymousOptionForSeiAv", {
      is: true,
      then: () => commonUtil(t).name.required(t(TRANSLATION_PREFIX.validation + "Unique Identifier is required")),
      otherwise: schema => schema.notRequired(),
    }),
    age: number().when(["isBasicInfoOnly", "isAnonymousOptionForSeiAv", "projectType", "isTpProject"], {
      is: (a: boolean, b: boolean, c: string, d: boolean) => a || b || c === PROJECT_TYPE_VALUE.seiYouth || d,
      then: schema => schema.notRequired(),
      otherwise: () => commonUtil(t).positiveNumber.required(t(TRANSLATION_PREFIX.validation + "age_is_required")),
    }),
    // ethnicity: string().when("projectType", {
    //   is: (a: string) => a === PROJECT_TYPE_VALUE.seiYouth,
    //   then: () => commonUtil(t).name.required(t(TRANSLATION_PREFIX.validation + "ethnicity_is_required")),
    //   otherwise: schema => schema.notRequired(),
    // }),
    country: object().when(["isBasicInfoOnly", "isAnonymousOptionForSeiAv", "projectType", "isTpProject"], {
      is: (a: boolean, b: boolean, c: string, d: boolean) => a || b || c === PROJECT_TYPE_VALUE.seiYouth || d,
      then: schema => schema.notRequired(),
      otherwise: () =>
        object().shape({
          label: string().required(t(TRANSLATION_PREFIX.validation + "country_is_required")),
          value: string().required(t(TRANSLATION_PREFIX.validation + "country_is_required")),
        }),
    }),
    gender: string().when(["isBasicInfoOnly", "isAnonymousOptionForSeiAv", "isTpProject", "projectType"], {
      is: (a: boolean, b: boolean, c: boolean, d: string) => a || b || c || d === PROJECT_TYPE_VALUE.seiYouth,
      then: schema => schema.notRequired(),
      otherwise: () => string().required(t(COMMON_VALIDATION_MASSAGE.gender)),
    }),
    empId: string().when("isTpProject", {
      is: (a: string) => a,
      then: () => commonUtil(t).name.required(t(TRANSLATION_PREFIX.validation + "empId_is_required")),
      otherwise: schema => schema.notRequired(),
    }),
    empRole: object().when(["isTpProject"], {
      is: (a: boolean) => a,
      otherwise: schema => schema.notRequired(),
      then: () =>
        object().shape({
          label: string().required(t(TRANSLATION_PREFIX.validation + "emp_role_is_required")),
          value: string().required(t(TRANSLATION_PREFIX.validation + "emp_role_is_required")),
        }),
    }),
    appliedEmpRole: object().when(["isTpProject"], {
      is: (a: boolean) => a,
      otherwise: schema => schema.notRequired(),
      then: () =>
        object().shape({
          label: string().required(t(TRANSLATION_PREFIX.validation + "applied_emp_role_is_required")),
          value: string().required(t(TRANSLATION_PREFIX.validation + "applied_emp_role_is_required")),
        }),
    }),
  })

export const CreateSeiAdultProjectValidationUtil = (t: t) =>
  object().shape({
    name: commonUtil(t).name.required(t(COMMON_VALIDATION_MASSAGE.name)),
    maxCredits: Yup.number().when("unlimitedCredits", {
      is: true,
      then: function () {
        return Yup.number()
          .test(
            "credits-validation",
            t(
              `${TRANSLATION_PREFIX.validation}spendable credits must be greater than the Spent Credits for the project or the Total credits for a single test`,
            ),
            function (value) {
              const { totalCredits } = this.parent
              if (value) {
                if (value < totalCredits) {
                  return false
                }
              }
              return true
            },
          )
          .required(t(TRANSLATION_PREFIX.validation + "max_credits_is_required"))
      },
      otherwise: () => Yup.number(),
    }),
    allowDuplicateTestTakers: Yup.boolean().required(
      t(TRANSLATION_PREFIX.validation + "allow_duplicate_test_takers_is_required"),
    ),
    sendReportsToTestTakerAnyway: Yup.boolean().required(
      t(TRANSLATION_PREFIX.validation + "send_reports_to_test_taker_anyway_is_required"),
    ),
    saveAssessToSalesforce: Yup.boolean(),
    customCompletionUrl: commonUtil(t).url,
    itemsPerPage: object().shape({
      value: number().required(t(TRANSLATION_PREFIX.validation + "items_per_page_is_required")),
      label: string().required(t(TRANSLATION_PREFIX.validation + "items_per_page_is_required")),
    }),
    projectType: commonUtil(t).projectType,
    itemLanguage: object().shape({
      id: number().required(t(COMMON_VALIDATION_MASSAGE.language)),
      value: string().required(t(COMMON_VALIDATION_MASSAGE.language)),
      label: string().required(t(COMMON_VALIDATION_MASSAGE.language)),
    }),
    reportNorm: object().shape({
      id: number().required(t(TRANSLATION_PREFIX.validation + "report_norm_is_required")),
      value: string().required(t(TRANSLATION_PREFIX.validation + "report_norm_is_required")),
      label: string().required(t(TRANSLATION_PREFIX.validation + "report_norm_is_required")),
    }),
    reportLanguage: object().shape({
      id: number().required(t(COMMON_VALIDATION_MASSAGE.report)),
      value: string().required(t(TRANSLATION_PREFIX.validation + "report_language_is_required")),
      label: string().required(t(COMMON_VALIDATION_MASSAGE.report)),
    }),

    freeProject: object().shape({
      isFreeProject: Yup.boolean(),
      creditForFreeProject: number().when("isFreeProject", {
        is: true,
        then: () => commonUtil(t).positiveNumber.required(t(COMMON_VALIDATION_MASSAGE.credit)),
        otherwise: () => commonUtil(t).positiveNumber,
      }),
      freeProjectFor: string().when("isFreeProject", {
        is: true,
        then: () => commonUtil(t).name.required(t(COMMON_VALIDATION_MASSAGE.name)),
        otherwise: () => commonUtil(t).name,
      }),
      whoApprovedFreeProject: string().when("isFreeProject", {
        is: true,
        then: () =>
          commonUtil(t).description.required(t(TRANSLATION_PREFIX.validation + "approver's_name_is_required")),
        otherwise: () => commonUtil(t).description,
      }),
      dateForFreeProject: date().when("isFreeProject", {
        is: true,
        then: () => commonUtil(t).date.required(t(COMMON_VALIDATION_MASSAGE.date)),
        otherwise: () => date(),
      }),
    }),

    projectReportOptions: Yup.array().of(
      Yup.object().shape({
        reportType: number(),
        sendToCoach: boolean(),
        sendToOthers: boolean(),
        sendToTestTaker: boolean(),
        sendToOtherAddresses: Yup.string().when("sendToOthers", {
          is: true,
          then: (schema: any) =>
            schema
              .required(t(COMMON_VALIDATION_MASSAGE.email))
              .test(
                "multiple-emails",
                t("Please enter valid email(s) separated by comma or semicolon"),
                (value: any) => {
                  if (!value) return false
                  // split on comma or semicolon, allow spaces, remove empty tokens
                  const emails = value
                    .split(/[;,]+/)
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                  if (emails.length === 0) return false
                  // simple, robust email regex (not full RFC but practical)
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                  return emails.every((e: string) => emailRegex.test(e))
                },
              ),
          otherwise: (schema: any) => schema.notRequired(),
        }),
      }),
    ),
  })

export const AddInvitedValidationUtil = (t: t) =>
  object().shape({
    name: commonUtil(t).name.required(t(COMMON_VALIDATION_MASSAGE.name)),
    surname: commonUtil(t).surname.required(t(COMMON_VALIDATION_MASSAGE.surname)),
    email: commonUtil(t).email.required(COMMON_VALIDATION_MASSAGE.email),
    isNewHire: boolean(),
    empId: commonUtil(t).name.when(["isTpProject"], {
      is: (a: boolean) => a,
      then: schema => schema.required(t(TRANSLATION_PREFIX.validation + "emp_id_is_required")),
      otherwise: schema => schema.notRequired(),
    }),
  })

export const SendInvitationValidationUtil = (t: t) =>
  object().shape({
    bodyHeader: string().required(t(TRANSLATION_PREFIX.validation + "header_text_is_required")),
    subject: string().required(t(TRANSLATION_PREFIX.validation + "subject_is_required")),
  })

export const AddSeiAdultReportInitialValidationUtil = (t: t) =>
  object().shape({
    projectType: object().required(t(COMMON_VALIDATION_MASSAGE.projectType)),
  })

export const AddSeiGroupValidationUtil = (t: t) =>
  object().shape({
    name: commonUtil(t).name.required(t(COMMON_VALIDATION_MASSAGE.name)),
    date: date().required(t(COMMON_VALIDATION_MASSAGE.date)),
  })

export const AddDistributorValidationUtil = (t: t) =>
  object().shape({
    addDistributorPaymentData: object().shape({
      name: commonUtil(t).name.required(t(COMMON_VALIDATION_MASSAGE.name)),
      parentDistributor: object().shape({
        id: string().required(t(COMMON_VALIDATION_MASSAGE.parentDistributor)),
        label: string().required(t(COMMON_VALIDATION_MASSAGE.parentDistributor)),
        value: string().required(t(COMMON_VALIDATION_MASSAGE.parentDistributor)),
      }),
      pricingScheme: object().shape({
        id: string().required(t(COMMON_VALIDATION_MASSAGE.pricing)),
        label: string().required(t(COMMON_VALIDATION_MASSAGE.pricing)),
        value: string().required(t(COMMON_VALIDATION_MASSAGE.pricing)),
      }),
      paymentType: string().required(t(TRANSLATION_PREFIX.validation + "payment_type_is_required")),
      // allowInvoices: Yup.boolean().required(t(TRANSLATION_PREFIX.validation + "Allow_Invoices_is_required")),
      amount: number()
        .nullable()
        .required(t(COMMON_VALIDATION_MASSAGE.amount))
        .typeError(t(TRANSLATION_PREFIX.validation + "amount_must_be_a_number")),
      allowCreditCards: Yup.boolean().required(t(TRANSLATION_PREFIX.validation + "allow_credit_cards_is_required")),
      credits: number().nullable().required(t(COMMON_VALIDATION_MASSAGE.credit)).typeError("credits_must_be_a_number"),
      paymentCurrency: string().required(t(TRANSLATION_PREFIX.validation + "payment_currency_is_required")),
    }),
    distributorDetails: object().shape({
      name: string().when("isId", {
        is: true,
        then: () => string(),
        otherwise: () => commonUtil(t).name.required(t(COMMON_VALIDATION_MASSAGE.name)),
      }),
      surname: string().when("isId", {
        is: true,
        then: () => string(),
        otherwise: () => commonUtil(t).surname.required(t(COMMON_VALIDATION_MASSAGE.surname)),
      }),
      email: string().when("isId", {
        is: true,
        then: () => string(),
        otherwise: () => commonUtil(t).email.required(t(COMMON_VALIDATION_MASSAGE.email)),
      }),
      language: object().when("isId", {
        is: true,
        then: () => object(),
        otherwise: () =>
          object().shape({
            id: string().required(t(COMMON_VALIDATION_MASSAGE.language)),
            label: string().required(t(COMMON_VALIDATION_MASSAGE.language)),
            value: string().required(t(COMMON_VALIDATION_MASSAGE.language)),
          }),
      }),
      organization: string().when("showOrganizationNameOnReports", {
        is: true,
        then: () =>
          string().required(
            t(TRANSLATION_PREFIX.validation + "organization_can't_be_empty_if_show_organization_name_on_reports"),
          ),
        otherwise: () => string(),
      }),
      showOrganizationNameOnReports: Yup.boolean(),
      showOrganizationLogoOnReports: Yup.boolean(),
      basicInfoOnlyOptionForSevAv: Yup.boolean().when("isId", {
        is: true,
        then: () => Yup.boolean(),
        otherwise: () =>
          Yup.boolean().required(t(TRANSLATION_PREFIX.validation + "basic_info_only_option_for_sevav_is_required")),
      }),
      organizationLogo: Yup.mixed().when("isId", {
        is: true,
        then: () => Yup.mixed(),
        otherwise: () =>
          Yup.mixed()
            .required(t(COMMON_VALIDATION_MASSAGE.orgLogo))
            .test("fileSize", t(COMMON_VALIDATION_MASSAGE.orgLogo), function (val: any) {
              if (this.parent.showOrganizationLogoOnReports) {
                if (typeof val === "string" && val) return true
                if (typeof val === "object" && val.name) return true
                return false
              }
              return true
            }),
      }),
      // reports: Yup.array().of(string()).required("Reports are required"),
    }),
  })

export const AddCoachValidationUtil = (t: t) =>
  object().shape({
    coachDetails: object().shape({
      name: commonUtil(t).name.required(t(COMMON_VALIDATION_MASSAGE.name)),
      surname: commonUtil(t).surname.required(t(COMMON_VALIDATION_MASSAGE.surname)),
      email: commonUtil(t).email.required(t(COMMON_VALIDATION_MASSAGE.email)),
      language: object().shape({
        id: string().required(t(COMMON_VALIDATION_MASSAGE.language)),
        label: string().required(t(COMMON_VALIDATION_MASSAGE.language)),
        value: string().required(t(COMMON_VALIDATION_MASSAGE.language)),
      }),
      parentDistributor: object().shape({
        id: string(),
        label: string(),
        value: string(),
      }),
      company: object().when("isRoleMaster", {
        is: true,
        then: () =>
          object().shape({
            id: string(),
            label: string(),
            value: string(),
          }),
        otherwise: () =>
          object().shape({
            id: string().required(t(COMMON_VALIDATION_MASSAGE.company)),
            label: string().required(t(COMMON_VALIDATION_MASSAGE.company)),
            value: string().required(t(COMMON_VALIDATION_MASSAGE.company)),
          }),
      }),
      pricingScheme: object().shape({
        id: string().required(t(COMMON_VALIDATION_MASSAGE.pricing)),
        label: string().required(t(COMMON_VALIDATION_MASSAGE.pricing)),
        value: string().required(t(COMMON_VALIDATION_MASSAGE.pricing)),
      }),
      organization: string().when("showOrganizationNameOnReports", {
        is: true,
        then: () =>
          string().required(
            t(TRANSLATION_PREFIX.validation + "organization_can't_be_empty_if_show_organization_name_on_reports"),
          ),
        otherwise: () => string(),
      }),
      credits: number()
        .nullable()
        .required(COMMON_VALIDATION_MASSAGE.credit)
        .typeError(t(TRANSLATION_PREFIX.validation + "credits_must_be_a_number")),
      showOrganizationNameOnReports: Yup.boolean(),
      showOrganizationLogoOnReports: Yup.boolean(),
      anonymousOptionForSeiAv: Yup.boolean(),
      isTpProject: Yup.boolean(),
      basicInfoOnlyOptionForSevAv: Yup.boolean().required(
        t(TRANSLATION_PREFIX.validation + "basic_info_only_option_for_sevav_is_required"),
      ),
      tempExpiryDate: Yup.string().when("status", {
        is: (val: string) => val === "temp",
        then: () => Yup.string().required(t(TRANSLATION_PREFIX.validation + "temp_expiry_is_required")),
        otherwise: () => Yup.string(),
      }),
      organizationLogo: Yup.mixed().when("showOrganizationLogoOnReports", {
        is: true,
        then: () =>
          Yup.mixed().test("fileSize", COMMON_VALIDATION_MASSAGE.orgLogo, function (val: any) {
            if (typeof val === "string" && val) return true
            if (typeof val === "object" && val.name) return true
            return false
          }),
        otherwise: () => Yup.mixed().notRequired(),
      }),
    }),
  })

export const EditUserProfileValidationUtil = (t: t) =>
  object().shape({
    firstName: commonUtil(t).name.required(t(TRANSLATION_PREFIX.validation + "first_name_is_required")),
    lastName: commonUtil(t).name.required(t(TRANSLATION_PREFIX.validation + "last_name_is_required")),
    title: string(),
    company: string(),
    websitesUrl: commonUtil(t).url,
    areaOfWork: Yup.array(),
    linkedinUrl: commonUtil(t).url,
    languages: Yup.array(),
    myAddress: string(),
    miniBio: string(),
    myBiography: string(),
    certAllowEmailContact: Yup.boolean(),
  })

export const CreditSummaryValidation = (t: t) =>
  object().shape({
    coach: object().shape({
      id: string().required(t(COMMON_VALIDATION_MASSAGE.coach)),
      label: string().required(t(COMMON_VALIDATION_MASSAGE.coach)),
      value: string().required(t(COMMON_VALIDATION_MASSAGE.coach)),
    }),
    notes: string().required(t(COMMON_VALIDATION_MASSAGE.notes)),
    amount: commonUtil(t).positiveNumber.required(t(COMMON_VALIDATION_MASSAGE.amount)),
    addOrSub: string().required(t(TRANSLATION_PREFIX.validation + "operation_is_required")),
  })

export const SendRequestValidation = (t: t) =>
  object().shape({
    notes: string().required(t(COMMON_VALIDATION_MASSAGE.notes)),
    amount: number().required(t(COMMON_VALIDATION_MASSAGE.amount)).min(1),
  })

export const AddReferentValidationUtil = (t: t) =>
  object().shape({
    name: commonUtil(t).name.required(t(COMMON_VALIDATION_MASSAGE.name)),
    surname: commonUtil(t).surname.required(t(COMMON_VALIDATION_MASSAGE.surname)),
    email: commonUtil(t).email.required(t(COMMON_VALIDATION_MASSAGE.email)),
    belongTo: object().shape({
      id: string().required(t(COMMON_VALIDATION_MASSAGE.parentDistributor)),
      label: string().required(t(COMMON_VALIDATION_MASSAGE.belongTo)),
      value: string().required(t(COMMON_VALIDATION_MASSAGE.belongTo)),
    }),
    language: object().shape({
      id: string().required(t(COMMON_VALIDATION_MASSAGE.parentDistributor)),
      label: string().required(t(COMMON_VALIDATION_MASSAGE.language)),
      value: string().required(t(COMMON_VALIDATION_MASSAGE.language)),
    }),
    organization: string().when("showOrganizationNameOnReports", {
      is: true,
      then: () =>
        string().required(
          t(TRANSLATION_PREFIX.validation + "organization_can't_be_empty_if_show_organization_name_on_reports"),
        ),
      otherwise: () => string(),
    }),
    showOrganizationNameOnReports: Yup.boolean(),
    showOrganizationLogoOnReports: Yup.boolean(),
    basicInfoOnlyOptionForSevAv: Yup.boolean().required(
      t(TRANSLATION_PREFIX.validation + "basic_info_only_option_for_sevav_is_required"),
    ),
    organizationLogo: Yup.mixed().when("showOrganizationLogoOnReports", {
      is: true,
      then: () =>
        Yup.mixed().test("fileSize", COMMON_VALIDATION_MASSAGE.orgLogo, function (val: any) {
          if (typeof val === "string" && val) return true
          if (typeof val === "object" && val.name) return true
          return false
        }),
      otherwise: () => Yup.mixed().notRequired(),
    }),
  })

export const ForgetPasswordValidation = object().shape({
  newPassword: string()
    .matches(
      REGEX.password,
      "Password must contain at least one uppercase letter, one number, and one special character",
    )
    .min(8)
    .required(COMMON_VALIDATION_MASSAGE.password),
  passwordConfirmation: string().test("passwords-match", "passwords_must_match", function (value) {
    return value === this.parent.newPassword
  }),
  code: string().min(4).required("code_is_required"),
})

// ======
export const StoreTemplateValidation = (t: t) =>
  object().shape({
    name: commonUtil(t).name.required(COMMON_VALIDATION_MASSAGE.name),
    language_name: string().required(COMMON_VALIDATION_MASSAGE.language),
    language_id: string().required(t(TRANSLATION_PREFIX.validation + "language_id_is_required")),
    report_type_id: string().required(t(TRANSLATION_PREFIX.validation + "report_type_id_is_required")),
    report_type_name: string().required(t(TRANSLATION_PREFIX.validation + "report_type_name_is_required")),
    subject: string().required(t(TRANSLATION_PREFIX.validation + "subject_is_required")),
    fromAddress: string().required(t(TRANSLATION_PREFIX.validation + "fromaddress_is_required")),
    html: string().required(t(TRANSLATION_PREFIX.validation + "html_is_required")),
  })

export const UpdateAssessmentValidation = (t: t) =>
  object().shape({
    title: string().required(t(TRANSLATION_PREFIX.validation + "title_is_required")),
    subtitle: string().required(t(TRANSLATION_PREFIX.validation + "subtitle_is_required")),
    box1: object().shape({
      title: string().required(t(TRANSLATION_PREFIX.validation + "title_is_required")),
      description: string().required(t(TRANSLATION_PREFIX.validation + "Description is required")),
    }),
    box2: object().shape({
      title: string().required(t(TRANSLATION_PREFIX.validation + "Title is required")),
      description: string().required(t(TRANSLATION_PREFIX.validation + "Description is required")),
    }),
    box3: object().shape({
      title: string().required(t(TRANSLATION_PREFIX.validation + "Title is required")),
      description: string().required(t(TRANSLATION_PREFIX.validation + "Description is required")),
    }),
    terms: object().shape({
      title: string().required(t(TRANSLATION_PREFIX.validation + "Title is required")),
      description: string().required(t(TRANSLATION_PREFIX.validation + "Description is required")),
    }),

    buttonTitle: string().required(t(TRANSLATION_PREFIX.validation + "Title is required")),
  })

export const CreateVsTvsProjectValidationUtil = (t: t) =>
  object().shape({
    project: object().shape({
      name: commonUtil(t).name.required(t(COMMON_VALIDATION_MASSAGE.name)),
      projectType: commonUtil(t).projectType,
      officialName: commonUtil(t).name,
      description: commonUtil(t).description,
      companySize: object().shape({
        value: string().required(t(TRANSLATION_PREFIX.validation + "company_size_is_required")),
        label: string().required(t(TRANSLATION_PREFIX.validation + "company_size_is_required")),
      }),
    }),
    questionnaires: object().shape({
      compilationExpiryDate: commonUtil(t).date.required(t(COMMON_VALIDATION_MASSAGE.date)),
      itemLanguage: array().min(1, t(COMMON_VALIDATION_MASSAGE.language)),
      // instructionList: commonUtil(t).editor.required(t(COMMON_VALIDATION_MASSAGE.description)),
      instructionList: Yup.array()
        .of(
          Yup.object().shape({
            text: Yup.string()
              .required(t(COMMON_VALIDATION_MASSAGE.description))
              .test(
                "no-placeholder-text",
                t(
                  "Please replace text starting and ending with '@@@' including the '@@@' with the actual project or team name.",
                ),
                value => !/@@@[^@]+@@@/.test(value || ""),
              ),
          }),
        )
        .min(1, t(TRANSLATION_PREFIX.validation + "At least one instruction is required")),
    }),
    configureReports: object().shape({
      language: object().shape({
        id: number().required(t(COMMON_VALIDATION_MASSAGE.language)),
        label: string().required(t(COMMON_VALIDATION_MASSAGE.language)),
        value: string().required(t(COMMON_VALIDATION_MASSAGE.language)),
      }),
      norm: object().shape({
        label: string().required(t(COMMON_VALIDATION_MASSAGE.reportNorm)),
        value: string().required(t(COMMON_VALIDATION_MASSAGE.reportNorm)),
      }),
    }),
    fieldsData: object().shape({
      personalData: array().of(
        Yup.object().shape({
          id: number(),
          data: Yup.array()
            .of(
              Yup.object()
                .shape({
                  hide: Yup.bool(),
                  label: string().when("hide", {
                    is: true,
                    then: () => string(),
                    otherwise: () => string(),
                  }),
                  langId: number(),
                  data: Yup.array().of(
                    Yup.object({
                      value: string(),
                    }),
                  ),
                })
                .test("options-length-across-langs", t("Please fill at least two options"), function (langs: any) {
                  const isValid =
                    !langs?.label || (langs?.label && langs?.data?.slice(0, 2).every((i: any) => Boolean(i?.value)))
                  if (!isValid) {
                    return new Yup.ValidationError(
                      [
                        this.createError({
                          path: `${this.path}.data[0].value`,
                          message: t("Please fill at least two options"),
                        }),
                        this.createError({
                          path: `${this.path}.data[1].value`,
                          message: t("Please fill at least two options"),
                        }),
                      ],
                      langs,
                      this.path,
                    )
                  }
                  return true
                }),
            )
            .test("labels-all-or-none", t("Please fill all field name in all languages"), function (langs: any) {
              if (!Array.isArray(langs)) return true

              const allFilled = langs.every((i: any) => !!i?.label?.trim())
              const allEmpty = langs.every((i: any) => !i?.label?.trim())

              if (allFilled || allEmpty) return true

              const errors = langs.map((_: any, index: number) =>
                this.createError({
                  path: `${this.path}[${index}].label`,
                  message: t("Please fill this label or leave all labels empty"),
                }),
              )
              throw new Yup.ValidationError(errors)
            })
            .test("options-length-across", "Options should be equal in each language", function (langs: any) {
              const { path, createError } = this
              if (!Array.isArray(langs)) return true
              if (langs.length === 0) return true
              const lengths = langs.map((l: any) => (Array.isArray(l?.data) ? l.data.length : 0))
              const refIndex = lengths.findIndex(len => len > 0)
              const referenceLength = refIndex === -1 ? 0 : lengths[refIndex]
              if (!lengths.every(len => len === referenceLength)) {
                let offendingIndex = lengths.findIndex(len => len < referenceLength)
                if (offendingIndex === -1) {
                  offendingIndex = lengths.findIndex(len => len !== referenceLength)
                }
                return createError({
                  path: `${path}[${offendingIndex}].data`,
                  message: `All languages must have ${referenceLength} options`,
                })
              }
              if (referenceLength === 0) {
                const labelledIndex = langs.findIndex((l: any) => !!(l?.label && l.label.toString().trim()))
                if (labelledIndex !== -1) {
                  return createError({
                    path: `${path}[${labelledIndex}].data`,
                    message: `Please add options for the labelled language`,
                  })
                }
                return true
              }
              for (let idx = 0; idx < referenceLength; idx++) {
                const presence = langs.map(
                  (l: any) => !!(l?.data?.[idx] && l.data[idx].value && l.data[idx].value.toString().trim()),
                )
                const allTrue = presence.every(Boolean)
                const allFalse = presence.every(p => !p)
                if (!(allTrue || allFalse)) {
                  const firstEmptyLang = presence.findIndex(p => !p)
                  return createError({
                    path: `${path}[${firstEmptyLang}].data[${idx}].value`,
                    message: `Option #${idx + 1} must have the same presence of 'value' across all languages`,
                  })
                }
              }

              return true
            }),
        }),
      ),
      dropDown: array().of(
        Yup.object().shape({
          id: number(),
          data: Yup.array()
            .of(
              Yup.object()
                .shape({
                  hide: Yup.bool(),
                  label: string().when("hide", {
                    is: true,
                    then: () => string(),
                    otherwise: () => string(),
                  }),
                  langId: number(),
                  data: Yup.array().of(
                    Yup.object({
                      value: string(),
                    }),
                  ),
                })
                .test("options-length-across-langs", t("Please fill at least two options"), function (langs: any) {
                  const isValid =
                    !langs?.label || (langs?.label && langs?.data?.slice(0, 2).every((i: any) => Boolean(i?.value)))
                  if (!isValid) {
                    return new Yup.ValidationError(
                      [
                        this.createError({
                          path: `${this.path}.data[0].value`,
                          message: t("Please fill at least two options"),
                        }),
                        this.createError({
                          path: `${this.path}.data[1].value`,
                          message: t("Please fill at least two options"),
                        }),
                      ],
                      langs,
                      this.path,
                    )
                  }
                  return true
                })
                .test("options-length-across-langs", t("Please fill field name first"), function (langs: any) {
                  if (!langs?.label && Array.isArray(langs?.data)) {
                    const index = langs.data.findIndex((i: any) => Boolean(i?.value))
                    if (index !== -1) {
                      return this.createError({
                        path: `${this.path}.data[${index}].value`,
                        message: t("Please fill field name first"),
                      })
                    }
                  }
                  return true
                }),
            )
            .test("labels-all-or-none", t("Please fill all field name in all languages"), function (langs: any) {
              if (!Array.isArray(langs)) return true

              const allFilled = langs.every((i: any) => !!i?.label?.trim())
              const allEmpty = langs.every((i: any) => !i?.label?.trim())

              if (allFilled || allEmpty) return true

              const errors = langs.map((_: any, index: number) =>
                this.createError({
                  path: `${this.path}[${index}].label`,
                  message: t("Please fill this label or leave all labels empty"),
                }),
              )

              throw new Yup.ValidationError(errors)
            })
            .test("options-length-across", "Options should be equal in each language", function (langs: any) {
              const { path, createError } = this
              if (!Array.isArray(langs)) return true
              if (langs.length === 0) return true
              const lengths = langs.map((l: any) => (Array.isArray(l?.data) ? l.data.length : 0))
              const refIndex = lengths.findIndex(len => len > 0)
              const referenceLength = refIndex === -1 ? 0 : lengths[refIndex]
              if (!lengths.every(len => len === referenceLength)) {
                let offendingIndex = lengths.findIndex(len => len < referenceLength)
                if (offendingIndex === -1) {
                  offendingIndex = lengths.findIndex(len => len !== referenceLength)
                }
                return createError({
                  path: `${path}[${offendingIndex}].data`,
                  message: `All languages must have ${referenceLength} options`,
                })
              }
              if (referenceLength === 0) {
                const labelledIndex = langs.findIndex((l: any) => !!(l?.label && l.label.toString().trim()))
                if (labelledIndex !== -1) {
                  return createError({
                    path: `${path}[${labelledIndex}].data`,
                    message: `Please add options for the labelled language`,
                  })
                }
                return true
              }
              for (let idx = 0; idx < referenceLength; idx++) {
                const presence = langs.map(
                  (l: any) => !!(l?.data?.[idx] && l.data[idx].value && l.data[idx].value.toString().trim()),
                )
                const allTrue = presence.every(Boolean)
                const allFalse = presence.every(p => !p)
                if (!(allTrue || allFalse)) {
                  const firstEmptyLang = presence.findIndex(p => !p)
                  return createError({
                    path: `${path}[${firstEmptyLang}].data[${idx}].value`,
                    message: `Option #${idx + 1} must have the same presence of 'value' across all languages`,
                  })
                }
              }

              return true
            }),
        }),
      ),
    }),
  })

export const createVsReportValidationUtil = (t: t) =>
  object().shape({
    name: commonUtil(t).name.required(t(COMMON_VALIDATION_MASSAGE.name)),
    language: object().shape({
      id: number().required(t(COMMON_VALIDATION_MASSAGE.language)),
      label: string().required(t(COMMON_VALIDATION_MASSAGE.language)),
      value: string().required(t(COMMON_VALIDATION_MASSAGE.language)),
    }),
    considerAll: boolean().required(t(TRANSLATION_PREFIX.validation + "consider_all_is_required")),
    options: array(),
  })
