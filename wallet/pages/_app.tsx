import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Grid } from "@mui/material";

const MyApp = ({ Component, pageProps }: AppProps) =>
  <>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh', margin: "0 20px" }}
    >
      <Component {...pageProps} />
    </Grid>
  </>

export default MyApp
