import { WALLET_URL } from "./config";

export const encode = (obj: Record<string, any>): string =>
  Buffer.from(JSON.stringify(obj)).toString("base64");
export const decode = (value: string): Record<string, any> =>
  JSON.parse(Buffer.from(value, "base64").toString());

export const openWallet = (path: string) => {
  return window.open(
    `${WALLET_URL}${path}`,
    "popUpWindow",
    "height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes"
  );
};
