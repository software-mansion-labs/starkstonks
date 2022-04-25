import fs from "fs";
import RegisterFlow from "../flows/MainFlow";
import { NextPage } from "next";
import Head from "next/head";

interface RegisterPageProps {
  accountContract: string;
}

export const getStaticProps = () => {
  const accountContract = fs.readFileSync('../haskell-contract/build/main.json').toString();
  return { props: { accountContract } };
}

const RegisterPage: NextPage<RegisterPageProps> = ({ accountContract }) =>
  <div>
    <Head>
      <title>Login</title>
      <meta name="description" content="Starknet AMS Hackathon Project"/>
      <link rel="icon" href="/favicon.ico"/>
    </Head>
    <RegisterFlow compiledAccountContract={accountContract}/>
  </div>

export default RegisterPage;