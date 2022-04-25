import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Grid } from "@mui/material";

function MyApp({ Component, pageProps }: AppProps) {
  return <Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: '100vh', margin: "0 20px" }}
  ><Component {...pageProps} /></Grid>
}

export default MyApp
