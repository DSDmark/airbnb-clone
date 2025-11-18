import { styled } from "@mui/material"

const LayoutStyled = styled("div")(() => ({
  "& .Main": {
    maxWidth: "1244px",
    margin: "0px auto",
    // paddingTop: "12px",
  },

  "& .main": {
    background: "#F6F6F6",
    // height: "100vh",
    maxHeight: "100%",
    minHeight: "100%",
    fontFamily: "Inter, sans-serif",
  },
}))
export default LayoutStyled
