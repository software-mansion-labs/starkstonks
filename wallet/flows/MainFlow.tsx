import React, { useEffect, useState } from "react";
import { generateKeysFromPassphrase, useGetKey } from "../utils/keys";
import LoadingScreen from "../screens/LoadingScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import {defaultProvider, Provider} from "starknet";
import { useRouter } from "next/router";
import useAccountContractAddress from "../hooks/useAccountContractAddress";

const provider = defaultProvider;

interface RegisterFlowProps {
  compiledAccountContract: string;
}

const RegisterFlow: React.FC<RegisterFlowProps> = ({ compiledAccountContract }) => {
  const key = useGetKey();
  const router = useRouter();
  const [accountContractAddress, setAccountContractAddress] = useAccountContractAddress();
  const [creatingAccount, setCreatingAccount] = useState(false);

  const keyPair = key.data?.keys;

  const createAccount = async (passphrase: string) => {
    setCreatingAccount(true);
    const keys = await generateKeysFromPassphrase(passphrase);
    key.mutate({keys})
  }

  useEffect(() => {
    if (!creatingAccount || !keyPair || accountContractAddress) {
      return;
    }
    provider.deployContract({
      constructorCalldata: [1], // FIXME
      contract: compiledAccountContract
    }).then((addTxRes) => {
      provider.waitForTransaction(addTxRes.transaction_hash).then(() => {
        let redirect;
        if (!addTxRes.address) {
          throw new Error("No address returned for account contract from gateway");
        }
        // if (typeof router.query.redirectToConnect === 'string') {
        //   redirect = '/connect';
        // } else {
        //   redirect = '/wallet';
        // }
        setAccountContractAddress(addTxRes.address);
        router.replace("/connect");
      })
    });
  }, [creatingAccount, compiledAccountContract, accountContractAddress, keyPair, router, router.query.redirectToConnect, setAccountContractAddress]);

  if (keyPair && accountContractAddress) {
    // router.replace(`wallet`);
    return <LoadingScreen title="Loading your wallet..."/>;
  }

  return <>
    {!creatingAccount && (<>
      {key.data === undefined && <LoadingScreen title="Loading your wallet..."/>}
      {key.data && key.data.keys === undefined && <RegistrationScreen onRegister={createAccount}/>}
    </>)}
    {creatingAccount && <LoadingScreen title="Creating your account..."/>}
  </>;
};

export default RegisterFlow;