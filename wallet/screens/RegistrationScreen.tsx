import React, { useState } from "react";
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";

interface RegistrationScreenProps {
  onRegister: (passphrase: string) => Promise<void> | void
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegister }) => {
  const [passphrase, setPassphrase] = useState("");
  return <Grid item>
    <Stack spacing="1rem" style={{marginLeft: -20, maxWidth: "350px"}}>
      <Typography variant="h4">Registration</Typography>
      <Typography paragraph>Enter a passphrase which you will use later for account recovery</Typography>
      <TextField
        multiline
        minRows={3}
        id="passphrase"
        label="Passphrase"
        variant="outlined"
        onChange={(e) => setPassphrase(e.target.value)}
        value={passphrase}
      />
      <Button onClick={() => onRegister(passphrase)}>Submit</Button>
    </Stack>
  </Grid>;
};
export default RegistrationScreen;