import React from "react";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";

interface ProgressScreenProps {
  title: string;
}

const ProgressScreen: React.FC<ProgressScreenProps> = ({ title }) => {
  return (
    <Grid item xs={3}>
      <Typography variant="h3" sx={{ marginBottom: "3rem" }}>{title}</Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress size="5rem"/>
      </Box>
    </Grid>
  );
}

export default ProgressScreen;