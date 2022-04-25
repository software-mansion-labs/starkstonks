import type {NextPage} from 'next'
import Head from 'next/head'
import {
    Button, Chip,
    Paper, Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import {defaultProvider} from "starknet";
import useSWR from "swr";
import React from "react";
import {bigNumberishArrayToDecimalStringArray} from "starknet/utils/number";
import {uint256ToBN} from "starknet/utils/uint256";
import BN from "bn.js";

const starknet = defaultProvider;

const formatUint256 = ([low, high]: string[], decimals: number) => {
    const parsed = uint256ToBN({low, high});
    const decimalPlaces = new BN(10).pow(new BN(decimals));
    return `${parsed.div(decimalPlaces).toString(10)},${parsed.mod(decimalPlaces)}`;
}

const TokenAmount: React.FC<{ userAddress: string, address: string; decimals: number }> = ({
                                                                                               userAddress,
                                                                                               address,
                                                                                               decimals
                                                                                           }) => {
    const {data} = useSWR(`token-balance-${address}`, () =>
        undefined && starknet.callContract({
            contractAddress: address,
            entrypoint: "getBalance",
            calldata: bigNumberishArrayToDecimalStringArray([userAddress]),
        }));

    if (!data) {
        return <Skeleton variant="text"/>;
    }
    const {result} = data;

    return <span>{formatUint256(result, decimals)}</span>;
}

const userAddress = "0x0332d3a3d623bb62a4fb95f6d2c1415d47fb3daffc34587d38e839402bac4af4";
const contractAddress = "0x0332d3a3d623bb62a4fb95f6d2c1415d47fb3daffc34587d38e839402bac4af4";

// TODO: Get user's address
const Home: NextPage = () => {
    const rows = [{name: "TKN", address: contractAddress, decimals: 8}];
    return (
        <div>
            <Head>
                <title>Your wallet</title>
                <meta name="description" content="Starknet AMS Hackathon Project"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Chip label={userAddress}/>
            <Typography variant="subtitle1" gutterBottom component="div">
                Your tokens
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Token</TableCell>
                            <TableCell align="right">Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">
                                    <TokenAmount decimals={row.decimals} userAddress={userAddress}
                                                 address={row.address}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Home;
