import { useState } from "react"
import { Button, Typography } from "@mui/material";
import { db } from "./App";

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { BarChart } from "@mui/x-charts";
export default function MiaryTendencji ()
{
    const [measures, setMeasures] = useState([]);

    const kinds = ["Średnia", "Mediana", "Dominanta", "Wariancja", "Odchylenie"];

    async function fetchOcenyByPrzedmiot (name)
    {
        const allOceny = await db.oceny.where("przedmiot").equals(name).toArray();
        return allOceny.map(n => n.ocena);
    }

    /**
     * Zgodnie z kinds dokonujemy obliczeń
     */

    const getMedian = function (oceny)
    {
        const sorted = oceny.sort();

        if (sorted % 2 != 0) {
            return sorted[parseInt(Math.floor(sorted.length / 2))];
        }

        const half = sorted.length / 2;
        return (oceny[half] + oceny[half - 1]) / 2;
    }

    const getDominion = function (oceny)
    {
        const counts = {};
        for (let i = 2.0; i <= 5.0; i += 0.5) {
            counts[`o${i}`] = 0;
        }

        for (let ocena of oceny) {
            counts[`o${ocena}`] += 1;
        }

        const domain = [];
        const most = Object.values(counts).reduce((a, b) => Math.max(a, b));
        for (const [k, v] of Object.entries(counts)) {
            if (v == most) {
                domain.push(k.substring(1));
            }
        }

        return domain.join(", ");
    }

    const prepMeasures = function (oceny)
    {
        const res = [];

        const avg = oceny.reduce((a, b) => a + b) / oceny.length;
        res.push(avg.toFixed(2));
        res.push(getMedian(oceny).toFixed(2));
        res.push(getDominion(oceny));

        const war = oceny.map(n => Math.pow(n - avg, 2)).reduce((a, b) => a + b) / oceny.length;
        res.push(war.toFixed(2));
        res.push(Math.sqrt(war).toFixed(2));

        return res;
    }

    async function fetchMeasures ()
    {
        await db.oceny; // preload

        const allPrzedmioty = await db.oceny.orderBy('przedmiot').uniqueKeys();
        const allOcenyBuff = [];

        const data = [];

        for (const przedmiot of allPrzedmioty) {
            const oceny = await fetchOcenyByPrzedmiot(przedmiot);
            allOcenyBuff.push(oceny);

            data.push({
                przedmiot: przedmiot,
                measures: prepMeasures(oceny)
            });
        }

        data.push({
            przedmiot: "Wszystkie",
            measures: prepMeasures(allOcenyBuff.flat())
        })
                    
        setMeasures(data);
    }

    React.useEffect(() => {
        fetchMeasures();
    }, []);

    return (
        <>
            <Typography sx={{ marginTop: 1, textAlign: 'left' }} variant="h4">
                Podstawowe miary rozkładu
            </Typography>
            <Typography sx={{ marginTop: 1, textAlign: 'left'  }} variant="h6">
                Z podziałem na przedmioty
            </Typography>
            <TableContainer component={Paper} sx={{ width: 800, marginTop: 6 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>LP.</TableCell>
                            <TableCell>Przedmiot</TableCell>
                            {kinds.map((kind, key) => (
                                <TableCell align="right" key={key}>{kind}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {measures.reverse().map((element, key) => (
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                key={key}
                            >
                                <TableCell component="th" scope="row">{key + 1}</TableCell>
                                <TableCell component="th" scope="row">{element.przedmiot}</TableCell>
                                {element.measures.map((measure, key2) => (
                                    <TableCell align="right" key={key2}>{measure}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer> 
            <Typography sx={{ marginTop: 8, textAlign: 'left' }} variant="h4">
                Średnia ocen studentów
            </Typography>
            <Typography sx={{ marginTop: 1, textAlign: 'left'  }} variant="h6">
                Z poszczególnych przedmiotów
            </Typography>
            {measures.length != 0 && (
                <BarChart
                    series={[{
                        label: "Średnia z przedmiotu",
                        data: measures.map(n => n.measures[0])
                    }]}
                    xAxis={[{ scaleType: 'band', data: measures.map(n => n.przedmiot) }]}
                    yAxis={[{ min: 2.0, label: "Średnia ocen" }]}
                    height={400}
                    margin={{ top: 50, bottom: 30, left: 40, right: 10 }}
                />
            )}
        </>
    )
}