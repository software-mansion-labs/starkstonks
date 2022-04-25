import type { NextPage } from 'next'
import Head from 'next/head'
import { Container, Grid } from "@mui/material";
import SignTx from "../screens/SignTx";

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
        <SignTx />
      </Grid>
    </div>
  )
}

export default Home;
