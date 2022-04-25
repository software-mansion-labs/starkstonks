import React, {useEffect} from "react";
import {Button, Grid} from "@mui/material";
import {useRouter} from "next/router";
import {useGetKey} from "../utils/keys";
import LoadingScreen from "./LoadingScreen";

const Connect: React.FC = () => {
    const router = useRouter();
    const {data} = useGetKey();

    useEffect(() => {
        if (!data?.keys) {
            router.replace("/register?redirectToConnect")
        }
    }, [data?.keys, router]);

    if (!data?.keys) {
        return <LoadingScreen title="Getting your keys..."/>;
    }


    const onLogin = () => {
        console.log(window.parent);
        // TODO: Address
        window.parent.postMessage({
            type: "connect",
            address: "0x0332d3a3d623bb62a4fb95f6d2c1415d47fb3daffc34587d38e839402bac4af4"
        }, "*");
        window.close();
    };

    return (
        <Grid item xs={3}>
            <h1>Connect to site</h1>
            <Button onClick={onLogin} fullWidth color="primary">
                Connect
            </Button>
        </Grid>
    );
};

export default Connect;
