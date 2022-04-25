import React from "react";

import InfoScreen from "./InfoScreen";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Button } from "@mui/material";
import { CenteringBox } from "../components/layout";

interface SuccessScreenProps {
  onClose: () => Promise<void> | void;
  title?: string;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ title , onClose }) => (
  <InfoScreen title={title || "Success!"}>
    <CenteringBox>
      <CheckCircleOutlineIcon sx={{ width: "5rem", height: "5rem" }} />
    </CenteringBox>
    <Button onClick={onClose}>Exit</Button>
  </InfoScreen>
);

export default SuccessScreen;