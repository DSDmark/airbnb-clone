import { FormikProps } from "formik"
import moment from "moment"

import { fileToBase64 } from "./file"

export const handleChangeFormikValUtil = (e: any, formik: FormikProps<any>) => {
  formik.setFieldValue(e.target.name, e.target.value)
}

export const convertToFormData = async (data: any) => {
  const formData = new FormData()
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || !value || (Array.isArray(value) && !value.length)) {
      continue
    }
    if (typeof value === "object") {
      if (value instanceof File) {
        if (key.endsWith("_logo")) {
          const base64 = await fileToBase64(value)
          formData.append(key, base64)
        } else {
          formData.append(key, value)
        }
      } else if (moment.isDate(value) || value instanceof Date) {
        formData.append(key, value as unknown as string)
      } else {
        formData.append(key, JSON.stringify(value))
      }
    } else if (value instanceof File) {
      formData.append(key, value)
    } else if (key === "email" && typeof value === "string") {
      formData.append(key, value.toLowerCase())
    } else {
      formData.append(key, value as any)
    }
  }

  return formData
}

export default convertToFormData
