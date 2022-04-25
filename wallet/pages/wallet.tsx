import type { NextPage } from 'next'
import Head from 'next/head'
import {
  Chip,
  Paper, Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { defaultProvider } from "starknet";
import useSWR from "swr";
import React, {useEffect, useState} from "react";
import { bigNumberishArrayToDecimalStringArray } from "starknet/utils/number";
import { uint256ToBN } from "starknet/utils/uint256";
import BN from "bn.js";
import { CenteringBox } from "../components/layout";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useAccountContractAddress from "../hooks/useAccountContractAddress";


const starknet = defaultProvider;

const formatUint256 = ([low, high]: string[], decimals: number) => {
  const parsed = uint256ToBN({ low, high });
  const decimalPlaces = new BN(10).pow(new BN(decimals));
  return `${parsed.div(decimalPlaces).toString(10)},${parsed.mod(decimalPlaces)}`;
}

const TokenAmount: React.FC<{ userAddress: string, address: string; decimals: number }> = ({
                                                                                             userAddress,
                                                                                             address,
                                                                                             decimals
                                                                                           }) => {
  const { data } = useSWR(`token-balance-${address}`, () =>
    starknet.callContract({
      contractAddress: address,
      entrypoint: "balanceOf",
      calldata: bigNumberishArrayToDecimalStringArray([userAddress]),
    }));

  if (!data) {
    return <Skeleton variant="text"/>;
  }
  const { result } = data;

  return <span>{formatUint256(result, decimals)}</span>;
}

const contractAddress = "0x0096fcc7ed91f5710208b3d029d1159f204a6be7246184f0ed4ffbccdfb49baf";

const Home: NextPage = () => {
  const [savedUserAddress] = useAccountContractAddress();
  const [userAddress, setAddress] = useState("");
  useEffect(() => {
      setAddress(savedUserAddress as string | undefined ?? "");
  }, [savedUserAddress]);

  const rows = [{ name: "TKN", address: contractAddress, decimals: 0 }];
  return (
    <div>
      <Head>
        <title>Your wallet</title>
        <meta name="description" content="Starknet AMS Hackathon Project"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <CenteringBox>
        <Chip
          label={`${userAddress.substring(0, 5)}...${userAddress.substring(userAddress.length - 6, userAddress.length - 1)}`}
          onDelete={() => navigator.clipboard.writeText(userAddress)}
          onClick={() => navigator.clipboard.writeText(userAddress)}
          deleteIcon={<ContentCopyIcon/>}
        />
      </CenteringBox>
      <Typography variant="subtitle1" gutterBottom component="div">
        Your tokens
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
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
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">
                  <TokenAmount
                    decimals={row.decimals}
                    userAddress={userAddress}
                    address={row.address}
                  />
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
