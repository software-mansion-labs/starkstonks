import React, { useEffect, useState } from "react";
import { generateKeysFromPassphrase, useGetKey } from "../utils/keys";
import LoadingScreen from "../screens/LoadingScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import { Provider } from "starknet";
import { useRouter } from "next/router";
import { useLocalStorage } from "react-use";

const provider = new Provider({ baseUrl: "http://localhost:5000" });

interface RegisterFlowProps {
  compiledAccountContract: string;
}

const RegisterFlow: React.FC<RegisterFlowProps> = ({ compiledAccountContract }) => {
  const key = useGetKey();
  const router = useRouter();
  const [hasDeployed, setHasDeployed] = useLocalStorage('has-deployed-contract');
  const [creatingAccount, setCreatingAccount] = useState(false);
  if(key.data?.keys !== undefined){
    router.replace(`wallet`);
  }

  const createAccount = async (passphrase: string) => {
    setCreatingAccount(true);
    await generateKeysFromPassphrase(passphrase);
  }

  useEffect(() => {
    if (!key.data || key.data?.keys === undefined || hasDeployed) {
      return;
    }
    // Elligible for creating
    provider.deployContract({
      // FIXME
      // constructorCalldata: [key.data.keys?.publicKey]
      contract: compiledAccountContract
    }).then((addTxRes) => {
      provider.waitForTransaction(addTxRes.transaction_hash).then(() => {
        let redirect;
        if (typeof router.query.redirectToConnect === 'string') { //
          redirect = `connect`;
        } else {
          redirect = `wallet`;
        }
        setHasDeployed(true);
        router.replace(redirect);
      })
    });
  }, [compiledAccountContract, hasDeployed, key.data, key.data?.keys, router, router.query.redirectToConnect, setHasDeployed]);

  return <>
    {!creatingAccount && (<>
      {key.data === undefined && <LoadingScreen title="Loading your wallet..."/>}
      {key.data?.keys === undefined && <RegistrationScreen onRegister={createAccount}/>}
    </>)}
    {creatingAccount && <LoadingScreen title="Creating your account..."/>}
  </>;
};

export default RegisterFlow;