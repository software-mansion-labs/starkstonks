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

  const createAccount = async (passphrase: string) => {
    setCreatingAccount(true);
    await generateKeysFromPassphrase(passphrase);
  }

  useEffect(() => {
    if (!key.data || key.data?.keys === undefined || accountContractAddress) {
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
        if (typeof router.query.redirectToConnect === 'string') {
          redirect = 'connect';
        } else {
          redirect = 'wallet';
        }
        setAccountContractAddress(addTxRes.address);
        router.replace(redirect);
      })
    });
  }, [compiledAccountContract, accountContractAddress, key.data, key.data?.keys, router, router.query.redirectToConnect, setAccountContractAddress]);

  if (key.data?.keys !== undefined && accountContractAddress) {
    router.replace(`wallet`);
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