import React, { useEffect } from "react";
import { Button, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useGetKey } from "../utils/keys";
import LoadingScreen from "./LoadingScreen";
import useAccountContractAddress from "../hooks/useAccountContractAddress";

const Connect: React.FC = () => {
  const router = useRouter();
  const { data } = useGetKey();
  const [accountAddress] = useAccountContractAddress();

  useEffect(() => {
    if (data && !data.keys || !accountAddress) {
      router.replace("/register?redirectToConnect");
    }
  }, [accountAddress, data, router]);

  if (!data?.keys || !accountAddress) {
    return <LoadingScreen title="Getting your wallet..." />;
  }

  const onLogin = () => {
    window.opener.postMessage(
      {
        type: "connect",
        status: "success",
        address: accountAddress,
      },
      "*"
    );
    window.close();
  };

  return (
    <Grid item xs={3}>
      <h1>Connect to site</h1>
      <Button onClick={onLogin} fullWidth color="primary">
        Connect
      </Button>
    </Grid>
  );
};

export default Connect;
