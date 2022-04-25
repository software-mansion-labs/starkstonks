import {
  Abi,
  Invocation,
  InvocationsSignerDetails,
  Signature,
  SignerInterface,
} from "starknet";
import { WALLET_URL } from "./config";
import { encode, openWallet } from "./utils";

export class StarkstonksSigner implements SignerInterface {
  async getPubKey(): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async signMessage(): Promise<Signature> {
    throw new Error("Method not implemented.");
  }

  signTransaction(
    transactions: Invocation[],
    transactionsDetail: InvocationsSignerDetails,
    abis?: Abi[]
  ): Promise<Signature> {
    return new Promise((resolve, reject) => {
      const data = {
        transactions,
        transactionsDetail,
      };

      const dataEncoded = encode(data);

      openWallet(`/wallet?tx=${dataEncoded}`);

      const listener = (event: MessageEvent) => {
        if (event.origin !== WALLET_URL) return;

        if (event.data.status === "success") {
          resolve(event.data.signature);
        } else {
          reject(event.data.errorMessage);
        }

        window.removeEventListener("message", listener);
      };

      window.addEventListener("message", listener, false);
    });
  }
}
