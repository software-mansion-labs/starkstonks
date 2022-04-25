import React, { PropsWithChildren } from "react";
import { Typography } from "@mui/material";
import { ScreenWrapper } from "./utils";

interface ProgressScreenProps {
  title: string;
}

const InfoScreen: React.FC<PropsWithChildren<ProgressScreenProps>> = ({ title, children }) => (
  <ScreenWrapper>
    <Typography variant="h3" sx={{ marginBottom: "2rem" }}>{title}</Typography>
    {children}
  </ScreenWrapper>
);

export default InfoScreen;
