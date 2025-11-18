import { Loader } from "@/component/loader"
import { PROTECTED_ROUTE } from "@/constants"
import { useAppSelector } from "@/hooks"
import { useRouter } from "next/router"
import { useEffect } from "react"

const RedirectLayout = () => {
  const router = useRouter()
  const { currentUser } = useAppSelector(({ user }) => user)
  useEffect(() => {
    if (currentUser.user.role) {
      router.replace(PROTECTED_ROUTE.dashboard)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname, currentUser.user.role])

  return <Loader loading />
}

export default RedirectLayout
