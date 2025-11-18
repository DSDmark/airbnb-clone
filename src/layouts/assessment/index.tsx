import { useAppDispatch, useAppSelector } from "@/hooks"
import { setSelectedTranslationUILanguage } from "@/states"
import { Box } from "@mui/material"
import React, { useEffect } from "react"

import Footer from "../../component/footer"
import Header from "../../component/header"
import LayoutStyled from "./layoutStyled"

interface ILayout {
  children: React.ReactNode
}
const Layout = ({ children }: ILayout) => {
  const { assessmentDetails } = useAppSelector(({ assessment }) => assessment)
  const dispatch = useAppDispatch()
  useEffect(() => {
    document.body.style.backgroundColor = "#F6F6F6"
    dispatch(
      setSelectedTranslationUILanguage({
        flag: "/images/us.png",
        label: assessmentDetails?.itemLanguage?.label,
        value: assessmentDetails?.itemLanguage?.value,
        code: assessmentDetails?.itemLanguage?.value,
      }),
    )
    return () => {
      document.body.style.backgroundColor = ""
    }
  }, [])
  return (
    <>
      <LayoutStyled>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Header />
          <Box className="main" sx={{ flex: 1 }}>
            <Box className="Main"> {children} </Box>
          </Box>
          <Footer />
        </Box>
      </LayoutStyled>
    </>
  )
}

export default Layout
