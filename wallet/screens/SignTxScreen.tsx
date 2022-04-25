import React from "react";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { decode, encode } from "../utils/messages";
import { ScreenWrapper } from "./utils";
import { LoadingButton } from "@mui/lab";
import { defaultProvider, Signature, Signer } from "starknet";
import { getKeyPair } from "starknet/dist/utils/ellipticCurve";
import { useGetKey } from "../utils/keys";
import { ec as EC } from "elliptic";
import { toBN } from "starknet/utils/number";

interface SignTxProps {
  onSign: () => void | Promise<void>;
}

const provider = defaultProvider;

const SignTxScreen: React.FC<SignTxProps> = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const { data } = useGetKey();

  // React.useEffect(() => {
  //   // const txContent = decode(router.query.tx as string);
  // }, [router.query.tx]);

  if (typeof router.query.tx !== "string") {
    return null;
    // return null; FIXME
  }

  const txContent = decode(router.query.tx);

  const onSignatureReceived = (signature: Signature) => {
    window.opener.postMessage(
      {
        type: "sign",
        status: "success",
        signature,
      },
      "*"
    );
    window.close();
  };

  const onSign = async () => {
    setLoading(true);

    // if (
    //   data !== undefined &&
    //   txContent.transactions &&
    //   txContent.transactionsDetail
    // ) {
    //   window.crypto.subtle.sign(
    //     { name: "ECDSA", hash: "SHA-256" },
    //     data.keys.privateKey,
    //     new Buffer(txContent)
    //   );
    // }

    // TODO

    onSignatureReceived(["0", "123", "234", "345", "567"]);
  };

  return (
    <ScreenWrapper>
      <Typography variant="h4" mb={2}>
        Outgoing Transaction
      </Typography>
      <Typography paragraph>Payload</Typography>
      <pre
        style={{
          border: "black 1px solid",
          borderRadius: "15px",
          padding: "20px 10px",
        }}
      >
        {JSON.stringify(txContent, null, 4)}
      </pre>
      <LoadingButton
        loading={loading}
        onClick={onSign}
        fullWidth
        color="primary"
        variant="contained"
      >
        Sign!
      </LoadingButton>
    </ScreenWrapper>
  );
};

export default SignTxScreen;
