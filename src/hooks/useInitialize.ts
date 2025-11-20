import { useGetGlobalTranslationLanguagesListQuery } from "@/api/translation"
import { DEFAULT_LANGUAGE } from "@/constants"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { resetUser, setInterFaceLanguagesList, setSelectedTranslationUILanguage } from "@/states"
import { getTokenData, getUserData } from "@/states/actions/user"
import { useCallback, useEffect } from "react"

function useInitialize() {
  const dispatch = useAppDispatch()
  const { currentUser, isLoggedIn } = useAppSelector(({ user }) => user)
  const { data, isSuccess } = useGetGlobalTranslationLanguagesListQuery({}, { skip: !isLoggedIn })

  const checkUserData = useCallback(() => {
    if (isLoggedIn && !currentUser?.user?.id) {
      dispatch(getUserData(null))
    } else if (currentUser.user.id) {
      // eslint-disable-next-line no-console
      console.log("initializing...")
    } else {
      dispatch(resetUser())
    }
  }, [currentUser.user.id, dispatch, isLoggedIn])

  useEffect(() => {
    if (isLoggedIn) {
      checkUserData()
    }
    if (isSuccess) {
      dispatch(setInterFaceLanguagesList(data?.data))
      if (currentUser.user.id) {
        const interfaceLang = data?.data.find(
          (item: any) => item.label === currentUser?.additionalData?.uiInterFaceLang,
        )
        dispatch(setSelectedTranslationUILanguage(interfaceLang?.label ? interfaceLang : DEFAULT_LANGUAGE))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    checkUserData,
    currentUser.user.id,
    isSuccess,
    currentUser?.additionalData?.uiInterFaceLang,
    isLoggedIn,
    dispatch,
  ])

  useEffect(() => {
    dispatch(getTokenData())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export default useInitialize
