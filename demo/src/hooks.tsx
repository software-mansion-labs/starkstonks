import { useMemo, useState } from "react";

import { AccountInterface, AddTransactionResponse } from "starknet";
import useSWR from "swr";

export type TrackTxStatus = (response: AddTransactionResponse) => void;

const mapStatus = (status: string) => {
  switch (status) {
    case "ACCEPTED_ON_L2":
      return "Transaction accepted on L2";
    case "ACCEPTED_ON_L1":
      return "Transaction accepted on L1";
    case "REJECTED":
      return "Transaction rejected";
    default:
      return null;
  }
};

export const useTrackTxInProgress = (
  lib: AccountInterface,
  onEnd: () => void
): { trackTx: TrackTxStatus; txInProgress?: string } => {
  const [txInProgress, setTxInProgress] = useState("");
  useSWR(
    txInProgress && `tx-${txInProgress}`,
    async () => {
      console.log("tx in progress", txInProgress);
      const result = await lib.getTransactionStatus(txInProgress);
      console.log("tx result", result);
      console.log(result);
      const { tx_status: status } = result;

      if (mapStatus(status)) {
        onEnd();
        setTxInProgress("");
        alert(mapStatus(status));
      }
    },
    { refreshInterval: 5000 }
  );

  return useMemo(
    () => ({
      trackTx: (response: AddTransactionResponse) =>
        setTxInProgress(response.transaction_hash),
      txInProgress,
    }),
    [txInProgress]
  );
};
