import type { NextPage } from 'next'
import Head from 'next/head'
import { Grid } from "@mui/material";
import SignTxScreen from "../screens/SignTxScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import LoadingScreen from "../screens/LoadingScreen";
import SuccessScreen from "../screens/SuccessScreen";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>starkstonks wallet</title>
        <meta name="description" content="Starknet AMS Hackathon Project"/>
        <link rel="icon" href="/favicon.ico"/>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        {/*<SignTx />*/}
        {/*<LoadingScreen title="Signing..." />*/}
        {/*<RegistrationScreen />*/}
        {/*<SuccessScreen title="Successfully signed!" />*/}
      </Grid>
    </div>
  )
}

export default Home;
