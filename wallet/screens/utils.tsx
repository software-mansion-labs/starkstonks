import React, { PropsWithChildren } from "react";

import { Grid, Stack } from "@mui/material";

export const ScreenWrapper: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <Grid item xs={3}>
    <Stack spacing="1rem">
      {children}
    </Stack>
  </Grid>
);
