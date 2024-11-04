import { useState } from "react";
import { db } from "./App";
import { Button } from "@mui/material";
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

    async function fetchData ()
    {
        const allPrzedmioty = await db.oceny.orderBy('przedmiot').uniqueKeys();

        const data = [];

        for (const przedmiot of allPrzedmioty) {
            const korelacje = [];

            for (const koreluj of allPrzedmioty) {
                if (koreluj == przedmiot) {
                    korelacje.push('-');
                    continue;
                }

                korelacje.push(0);
            }

            data.push({
                przedmiot: przedmiot,
                korelacje: korelacje
            });
        }

        console.log(data);
        setKorelacja(data);
    }

    return (
        <>
            <Button onClick={(e) => fetchData() }>Załaduj</Button>
            <TableContainer component={Paper} sx={{ width: 800}}>
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