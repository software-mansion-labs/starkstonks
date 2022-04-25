import React from "react";
import { Box, Button, Grid, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";

const Login: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);

    setTimeout(() => setLoading(false), 3000);
  }, []);

  const onLogin = () => {
    window.opener.postMessage(
      {
        success: true,
        address:
          "0x0332d3a3d623bb62a4fb95f6d2c1415d47fb3daffc34587d38e839402bac4af4",
      },
      "*"
    );

    window.close();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

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
