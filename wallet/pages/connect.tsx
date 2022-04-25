import type { NextPage } from "next";
import Head from "next/head";
import Connect from "../screens/Connect";

const ConnectPage: NextPage = () => (
  <div>
    <Head>
      <title>Connect wallet to this dApp</title>
      <meta name="description" content="Starknet AMS Hackathon Project"/>
      <link rel="icon" href="/favicon.ico"/>
    </Head>
    <Connect/>
  </div>
);

export default ConnectPage;
