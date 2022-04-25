import fs from "fs";
import RegisterFlow from "../flows/MainFlow";
import { NextPage } from "next";

interface RegisterPageProps {
  accountContract: string;
}

export const getStaticProps = () => {
  const accountContract = fs.readFileSync('../haskell-contract/build/main.json').toString();
  return { props: { accountContract } };
}

const RegisterPage: NextPage<RegisterPageProps> = ({ accountContract }) => <RegisterFlow compiledAccountContract={accountContract} />

export default RegisterPage;