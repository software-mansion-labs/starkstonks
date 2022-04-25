import React from "react";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { decode, encode } from "../utils/messages";
import { ScreenWrapper } from "./utils";

interface SignTxProps {
  onSign: () => void | Promise<void>;
}

const SignTxScreen: React.FC<SignTxProps> = ({ onSign }) => {
  const router = useRouter();
  if (typeof router.query.tx !== "string") {
    // return null; FIXME
  }
  router.query.tx = encode({
    tx1: "param1",
    tx2: "param2",
  }); // FIXME
  const txContent = decode(router.query.tx);
  return (<ScreenWrapper>
    <Typography variant="h4" mb={2}>Outgoing Transaction</Typography>
    <Typography paragraph>Payload</Typography>
    <pre style={{
      border: "black 1px solid",
      borderRadius: "15px",
      padding: "20px 10px",
    }}>
      {JSON.stringify(txContent, null, 4)}
    </pre>
    <Button onSubmit={onSign} fullWidth color="primary">Sign!</Button>
  </ScreenWrapper>)
};

export default SignTxScreen;