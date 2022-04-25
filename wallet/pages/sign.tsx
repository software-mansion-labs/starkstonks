import SignTxScreen from "../screens/SignTxScreen";
import Head from "next/head";

const SignPage = () => <>
  <Head>
    <title>Sign transaction</title>
    <meta name="description" content="Starknet AMS Hackathon Project"/>
    <link rel="icon" href="/favicon.ico"/>
  </Head>
  <SignTxScreen onSign={() => {}}/>
</>;


export default SignPage;
