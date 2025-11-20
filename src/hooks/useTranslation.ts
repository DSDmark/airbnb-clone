import { useAddMultipleTranslationsMutation, useGetGlobalTranslationListQuery } from "@/api/translation"
import { APP_NAME } from "@/constants"
import { setGlobalLoader } from "@/states"
// import { setGlobalLoader } from "@/states"
import { useCallback, useEffect } from "react"

import { useAppDispatch, useAppSelector } from "./useRtk"

function useTranslation() {
  const { languageData } = useAppSelector(({ translationData }) => translationData)
  const { selectedInterFaceLanguage } = useAppSelector(({ ui }) => ui)
  const dispatch = useAppDispatch()

  const {
    data: globalTranslation,
    isSuccess: isGlobalTranslationSuccess,
    isLoading: isGlobalTranslationLoading,
    isFetching: isGlobalTranslationFetching,
  } = useGetGlobalTranslationListQuery(
    {
      lang: selectedInterFaceLanguage?.value,
      source: APP_NAME,
    },
    { skip: !selectedInterFaceLanguage?.value },
  )
  const [addMultipleTranslations] = useAddMultipleTranslationsMutation()

  const postMissingKeysToApi = async (missingKeys: any[]) => {
    const filteredKeys = missingKeys
      .filter((key: any) => key !== "")
      .map((key: any) => ({
        lang_key: key?.toLowerCase(),
        lang_vale: key,
      }))

    if (filteredKeys.length > 0) {
      const payload = {
        lang: selectedInterFaceLanguage?.value,
        translate: filteredKeys,
        source: APP_NAME,
      }
      addMultipleTranslations(payload)
    }
  }

  const trans = useCallback(
    (key: string) => {
      if (typeof key !== "string") return key

      const leading = (key.match(/^\s*/) || [""])[0]
      const trailing = (key.match(/\s*$/) || [""])[0]
      const trimmedKey = key.trim()

      const matchKey = (k: string) => (k || "").trim().toLowerCase() === trimmedKey.toLowerCase()

      // try local languageData first
      const normalizedKey = Object.keys(languageData || {}).find(k => matchKey(k))
      if (!isGlobalTranslationSuccess) {
        const found = languageData[normalizedKey || trimmedKey] ?? languageData[trimmedKey] ?? null
        if (found) return `${leading}${found}${trailing}`
        return key
      }

      if (isGlobalTranslationSuccess) {
        const normalizedKey2 = Object.keys(globalTranslation?.data || {}).find(k => matchKey(k))
        if (globalTranslation?.data[normalizedKey2 || trimmedKey]) {
          return `${leading}${globalTranslation.data[normalizedKey2 || trimmedKey]}${trailing}`
        } else {
          const storedKeys: string[] = JSON.parse(localStorage.getItem("translationKeysToSend") || "[]")
          const trimmedStoredKeys = storedKeys.map(k => (typeof k === "string" ? k.trim() : k))
          if (!trimmedStoredKeys.includes(trimmedKey)) {
            trimmedStoredKeys.push(trimmedKey)
            localStorage.setItem("translationKeysToSend", JSON.stringify(trimmedStoredKeys))
          }
          return key
        }
      } else {
        return key
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [globalTranslation?.data, isGlobalTranslationSuccess, languageData],
  )

  useEffect(() => {
    if (isGlobalTranslationFetching || isGlobalTranslationLoading) {
      dispatch(setGlobalLoader(true))
    }
    if (isGlobalTranslationSuccess) {
      dispatch(setGlobalLoader(false))
    }
  }, [dispatch, isGlobalTranslationFetching, isGlobalTranslationLoading, isGlobalTranslationSuccess])

  useEffect(() => {
    return () => {
      const storedKeys = JSON.parse(localStorage.getItem("translationKeysToSend") || "[]")
      postMissingKeysToApi(storedKeys)
      localStorage.removeItem("translationKeysToSend")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return trans
}

export default useTranslation
