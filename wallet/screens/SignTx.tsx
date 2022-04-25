import React from "react";
import { Button, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { decode, encode } from "../utils/messages";

interface SignTxProps {
  onSign: () => void | Promise<void>;
}

const SignTx: React.FC<SignTxProps> = ({ onSign }) => {
  const router = useRouter();
  if (typeof router.query.tx !== "string") {
    // return null; FIXME
  }
  router.query.tx = encode({
    tx1: "param1",
    tx2: "param2",
  }); // FIXME
  const txContent = decode(router.query.tx);
  return <Grid item xs={3}>
    <h1>Outgoing Transaction</h1>
    <pre>{JSON.stringify(txContent, null, 4)}</pre>
    <Button onSubmit={onSign} fullWidth color="primary">Sign!</Button>
  </Grid>;
};

export default SignTx;