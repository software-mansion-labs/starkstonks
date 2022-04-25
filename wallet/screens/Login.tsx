import React from "react";
import { Button, Grid } from "@mui/material";
import { useRouter } from "next/router";

const Login: React.FC = () => {
  const router = useRouter();

  const onLogin = () => {
    console.log(window.parent);

    window.parent.postMessage({ type: "dupa" }, "*");
  };

  return (
    <Grid item xs={3}>
      <h1>Please log in</h1>
      <Button onClick={onLogin} fullWidth color="primary">
        Login!
      </Button>
    </Grid>
  );
};

export default Login;
