import { useState } from "react";
import { db } from "./App";
import { Button, Typography } from "@mui/material";
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { BarChart } from "@mui/x-charts";

export default function Korelacja ()
{
    const [korelacja, setKorelacja] = useState([]);

    async function fetchOcenyByPrzedmiot (name)
    {
        const allOceny = await db.oceny.where("przedmiot").equals(name).toArray();
        return allOceny.map(n => n.ocena);
    }

    async function fetchData ()
    {
        await db.oceny; // preload

        const allPrzedmioty = await db.oceny.orderBy('przedmiot').uniqueKeys();

        const data = [];

        for (const przedmiot of allPrzedmioty) {
            const korelacje = [];

            const xOceny = await fetchOcenyByPrzedmiot(przedmiot);
            const xAvg = xOceny.reduce((a, b) => a + b) / xOceny.length;

            for (const koreluj of allPrzedmioty) {
                if (koreluj == przedmiot) {
                    korelacje.push('-');
                    continue;
                }

                const yOceny = await fetchOcenyByPrzedmiot(koreluj);
                const yAvg = yOceny.reduce((a, b) => a + b) / yOceny.length;

                let sumGora = 0;
                for (let i = 0; i < xOceny.length; i++) {
                    sumGora += (xOceny[i] - xAvg) * (yOceny[i] - yAvg);
                }

                let sumX = 0;
                let sumY = 0;

                for (let i = 0; i < xOceny.length; i++) {
                    sumX += Math.pow(xOceny[i] - xAvg, 2);
                    sumY += Math.pow(yOceny[i] - yAvg, 2);
                }

                const r = sumGora / (Math.sqrt(sumX) * Math.sqrt(sumY));


                korelacje.push(r.toFixed(2));
            }

            data.push({
                przedmiot: przedmiot,
                korelacje: korelacje
            });
        }

        console.log(data);
        setKorelacja(data);
    }

    React.useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Typography sx={{ marginTop: 1, textAlign: 'left' }} variant="h4">
                Współczynniki korelacji Pearsona
            </Typography>
            <Typography sx={{ marginTop: 1, textAlign: 'left'  }} variant="h6">
                Dla par przedmitów
            </Typography>
            <TableContainer component={Paper} sx={{ width: 800, marginTop: 6 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            {korelacja.map((el, key) => (
                                <TableCell align="right" key={key}>{el.przedmiot}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {korelacja.map((element, key) => (
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                key={key}
                            >
                                <TableCell component="th" scope="row">{element.przedmiot}</TableCell>
                                {element.korelacje.map((kor, key2) => (
                                    <TableCell align="right" key={key2}>{kor}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer> 
        </>
    )
}