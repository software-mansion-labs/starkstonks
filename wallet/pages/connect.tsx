import type { NextPage } from "next";
import Head from "next/head";
import { Grid } from "@mui/material";
import Connect from "../screens/Connect";

const Page: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Login</title>
        <meta name="description" content="Starknet AMS Hackathon Project" />
        <link rel="icon" href="/favicon.ico" />
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
        style={{ minHeight: "100vh" }}
      >
        <Connect />
      </Grid>
    </div>
  );
};

export default Page;