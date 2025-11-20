import { FormikConfig, FormikProps, FormikValues, useFormik } from "formik"

interface CustomFormikConfig<Values extends FormikValues> extends FormikConfig<Values> {}

const useFormikWithDefaultsProps = <Values extends FormikValues>(
  props: CustomFormikConfig<Values>,
): FormikProps<Values> => {
  return useFormik<Values>({
    validateOnChange: false,
    validateOnBlur: false,
    ...props,
  })
}

export default useFormikWithDefaultsProps
