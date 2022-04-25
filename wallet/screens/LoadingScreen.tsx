import { Box, CircularProgress } from "@mui/material";
import React from "react";
import InfoScreen from "./InfoScreen";
import { CenteringBox } from "../components/layout";

interface LoadingScreenProps {
  title: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ title }) => (
  <InfoScreen title={title || "Loading..."}>
    <CenteringBox>
      <CircularProgress size="5rem"/>
    </CenteringBox>
  </InfoScreen>
);

export default LoadingScreen;