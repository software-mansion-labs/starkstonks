// import {
//   AdapterOptions,
//   EthAccount,
//   getAdapter,
// } from "eip712-starknet-account";
import {CircularProgress, Stack, TextField, Typography} from "@mui/material";
import {
    FormEventHandler,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {bnToUint256, uint256ToBN} from "starknet/utils/uint256";
import {hexToDecimalString, toBN} from "starknet/utils/number";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import ReactDOM from "react-dom";
import Skeleton from "@mui/material/Skeleton";
import {useTrackTxInProgress} from "./hooks";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import {Account, AccountInterface, defaultProvider, Provider} from "starknet";
import {WALLET_URL} from "./config";
import {StarkstonksSigner} from "./signer";
import {StarknetChainId} from "starknet/dist/constants";
import {openWallet} from "./utils";
import {useListener} from "./messages";

const erc20Address = "0x0096fcc7ed91f5710208b3d029d1159f204a6be7246184f0ed4ffbccdfb49baf";

const TokenWallet: React.FC<{ lib: AccountInterface }> = ({lib}) => {
    const {data: balance, mutate: revalidateBalance} = useSWR(
        lib.address && "balance",
        async () => {
            try {
                const {result} = await lib.callContract(
                    {
                        calldata: [hexToDecimalString(lib.address)],
                        contractAddress: erc20Address,
                        entrypoint: "balanceOf",
                    },
                    {blockIdentifier: "pending"}
                );

                const [low, high] = result;
                return uint256ToBN({low, high});
            } catch (e) {
                const err = e as Error;
                console.error(err.message);
                throw err;
            }
        }
    );

    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const {trackTx, txInProgress} = useTrackTxInProgress(lib, () =>
        revalidateBalance()
    );

    const calldata = useMemo(() => {
        if (!amount || !address) {
            return undefined;
        }

        try {
            const parsedAmount = bnToUint256(toBN(amount, 10));
            return [
                address,
                parsedAmount.low.toString(16),
                parsedAmount.high.toString(16),
            ];
        } catch (e) {
            console.error(e);
        }
        return undefined;
    }, [amount, address]);

    const transferTokens: FormEventHandler = (e) => {
        e.preventDefault();

        if (loading || !calldata || !lib) {
            return;
        }

        setLoading(true);

        lib
            .execute({
                contractAddress: erc20Address,
                entrypoint: "transfer",
                calldata,
            }, undefined, {maxFee: 0})
            .then(trackTx)
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const topUp = () => {
        if (loading) {
            return;
        }

        setLoading(true);

        lib
            .execute({
                contractAddress: erc20Address,
                entrypoint: "topup",
                calldata: [hexToDecimalString(lib.address)],
            }, undefined, {maxFee: 0})
            .then(trackTx)
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const onTestPress = async () => {
        const result = await lib.signer.signTransaction(
            [
                {
                    entrypoint: "transfer",
                    calldata: [],
                    contractAddress: "0x123",
                },
            ],
            {
                chainId: StarknetChainId.TESTNET,
                walletAddress: "0x999",
                version: 0,
                maxFee: 0,
                nonce: 0,
            }
        );

        console.log("result:", result);
    };

    return (
        <Stack gap={2}>
            <Typography variant="h3">ERC20 DEMO</Typography>
            <Typography>
                This demo operates on a dummy ERC20 with faucet functionality.
            </Typography>
            <Typography>
                Your StarkNet address:{" "}
                <a
                    href={`https://goerli.voyager.online/contract/${lib.address}#transactions`}
                >
                    {lib.address}
                </a>
            </Typography>
            <Typography>
                Your balance:{" "}
                {balance ? (
                    balance.toString()
                ) : (
                    <Skeleton style={{display: "inline-block", width: 100}}/>
                )}
            </Typography>
            <Stack gap={2}>
                <Typography variant="h6">Faucet</Typography>
                <LoadingButton
                    type="submit"
                    loading={loading || !!txInProgress}
                    variant="contained"
                    onClick={topUp}
                >
                    Get dummy tokens
                </LoadingButton>
            </Stack>
            <Stack gap={2} component="form" onSubmit={transferTokens}>
                <Typography variant="h6">Transfer</Typography>
                <TextField
                    label="Target address"
                    variant="outlined"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <TextField
                    label="Amount"
                    variant="outlined"
                    value={amount}
                    inputProps={{inputMode: "numeric", min: 0, pattern: "[0-9]*"}}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                />
                <LoadingButton
                    type="submit"
                    loading={loading || !!txInProgress}
                    disabled={!balance || !calldata}
                    variant="contained"
                >
                    Send tokens
                </LoadingButton>
            </Stack>
            <Button onClick={onTestPress} variant="contained">
                Test signing
            </Button>
        </Stack>
    );
};

// const CreateAccountForm: React.FC<{
//   lib: AccountInterface;
//   onCreate: () => void;
// }> = ({ lib, onCreate }) => {
//   const [loading, setLoading] = useState(false);
//   const { trackTx, txInProgress } = useTrackTxInProgress(lib, onCreate);
//   const createAccount: FormEventHandler = (e) => {
//     e.preventDefault();

//     if (loading) {
//       return;
//     }

//     setLoading(true);

//     lib
//       .deployAccount()
//       .then((tx) => trackTx(tx))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   };

//   return (
//     <Stack gap={1} component="form" onSubmit={createAccount}>
//       <Typography variant="h6">
//         It seems that you haven't created an account on StarkNet yet.
//       </Typography>
//       <Typography>
//         In order to send any transactions you need to create an account first.
//         We'll also ask you to add our adapter to MetaMask if it doesn't exist
//         there.
//       </Typography>
//       <LoadingButton
//         loading={!!txInProgress || loading}
//         type="submit"
//         variant="contained"
//       >
//         Create my account
//       </LoadingButton>
//     </Stack>
//   );
// };

// const config: AdapterOptions = {
//   starknet: { baseUrl: process.env.NODE_URL },
//   network: "goerli-alpha",
// };

type AccountResponse =
    | {
    status: "success";
    address: string;
}
    | {
    status: "error";
    errorMessage: string;
};

const provider = defaultProvider;

const LoginScreen: React.FC<{ onCreate: (account: Account) => void }> = ({
                                                                             onCreate,
                                                                         }) => {
    const [loading, setLoading] = useState(false);

    useListener("connect", (event) => {
        console.log("heree");
        if (event.origin !== WALLET_URL) {
            return;
        }

        const signer = new StarkstonksSigner();
        const account = new Account(provider, event.data.address, signer);

        onCreate(account);
    });

    const onClick = () => {
        openWallet("/connect");
    };

    return (
        <Grid
            spacing={0}
            display="grid"
            height="100vh"
            direction="column"
            alignItems="center"
            justifyContent="center">
                <LoadingButton
                    size="large"
                    onClick={onClick}
                    loading={loading}
                    type="submit"
                    variant="contained"
                >
                    Connect to demo
                </LoadingButton>
        </Grid>
    );
};

const App = () => {
    // const [requestedAccount, setRequestedAccount] = useState<AccountInterface>();
    // const { data } = useSWRImmutable("adapter", async () => {
    //   const adapter = await getAdapter(config);
    //   const accounts = await adapter.getAccounts();
    //   const account = accounts?.[0];
    //   return { adapter, account };
    // });

    const [account, setAccount] = useState<Account | undefined>(undefined);

    // const loadingAdapter = !data;
    // const { adapter, account } = data ?? {};
    // const lib = account || requestedAccount;

    // const [isDeployed, setIsDeployed] = useState<boolean | undefined>(undefined);
    // useEffect(() => {
    //   if (!lib) {
    //     return;
    //   }

    //   lib.isDeployed().then(setIsDeployed).catch(console.error);
    // }, [lib]);

    // const requestAccount = useCallback(async () => {
    //   const accounts = await adapter.requestAccounts();
    //   if (accounts && accounts[0]) {
    //     setRequestedAccount(accounts[0]);
    //   } else {
    //     alert("You don't have an account, please create it first");
    //   }
    // }, [adapter]);

    // if (loadingAdapter || (lib && isDeployed === undefined)) {
    //   return (
    //     <Grid
    //       container
    //       spacing={0}
    //       direction="column"
    //       alignItems="center"
    //       justifyContent="center"
    //       style={{ minHeight: "100vh" }}
    //     >
    //       <CircularProgress />
    //     </Grid>
    //   );
    // }

    // if (!lib) {
    //   return (
    //     <Dialog open={true}>
    //       <DialogTitle id="alert-dialog-title">Connect to Metamask</DialogTitle>
    //       <DialogContent>
    //         <DialogContentText>
    //           You need to connect to Metamask in order to use this application.
    //         </DialogContentText>
    //       </DialogContent>
    //       <DialogActions>
    //         <Button onClick={requestAccount} autoFocus>
    //           Connect
    //         </Button>
    //       </DialogActions>
    //     </Dialog>
    //   );
    // }

    console.log("account:", account);

    return account === undefined ? (
        <LoginScreen onCreate={setAccount}/>
    ) : (
        <TokenWallet lib={account}/>
    );
};

export default App;

// const app = document.getElementById("app");
// ReactDOM.render(<App />, app);
