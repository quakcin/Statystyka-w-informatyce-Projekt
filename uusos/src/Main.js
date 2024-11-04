import { Button } from "@mui/material";
import Header from "./Header";
import Dexie from "dexie";
import { db } from "./App";
import Generator from "./Generator";
import Summary from "./Summary";
import CustomTabs from "./CustomTabs";



async function dumpDatabse ()
{
    const oceny = await db.oceny.toArray();
    console.log(oceny);
}

export default function Main ()
{
    const onLog = function (e)
    {
        dumpDatabse();
    }

    return (
        <>
            <Header />
            <center>
                <Generator />
                <Summary />
                <CustomTabs />
            </center>
        </>
    )
}