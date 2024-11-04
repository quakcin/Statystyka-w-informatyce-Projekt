import { Button } from "@mui/material";
import { db } from "./App";
import { useState } from "react";

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from "@mui/x-charts";


export default function Histogram ()
{
    const [chartSeries, setChartSeries] = useState(null);
    const [histogram, setHistogram] = useState([]);
    const ocenyHist = (new Array(7)).fill(0).map((n, i) => 2.0 + i * 0.5);

    async function fetchOcenyByPrzedmiot (name)
    {
        const allOceny = await db.oceny.where("przedmiot").equals(name).toArray();
        return allOceny.map(n => n.ocena);
    }

    const ocenyToHistogram = function (oceny)
    {
        const hist = {};
        for (let i = 2.0; i <= 5.0; i+= 0.5) {
            hist[`o${i}`] = 0;
        }

        for (const ocena of oceny) {
            hist[`o${ocena}`] += 1;
        }

        return Object.values(hist);
    }

    async function fetchHisrograms () 
    {
        const allPrzedmioty = await db.oceny.orderBy('przedmiot').uniqueKeys();
        const allOcenyBuff = [];

        const data = [];

        for (const przedmiot of allPrzedmioty) {
            const oceny = await fetchOcenyByPrzedmiot(przedmiot);
            allOcenyBuff.push(oceny);
            data.push({
                przedmiot: przedmiot,
                hist: ocenyToHistogram(oceny)
            });
        }

        const allOceny = allOcenyBuff.flat();
        data.push({
            przedmiot: "Wszystkie",
            hist: ocenyToHistogram(allOceny)
        });

        console.log(data);
        setHistogram(data);

        const series = [];
        for (let i = 0; i < 7; i++) {
            series[i] = {
                label: `${2.0 + i * 0.5}`,
                data: [],
            };
        }
        console.log(series);

        for (let przedmiot of data) {
            
            if(przedmiot.przedmiot === 'Wszystkie')
                continue;
            let i = 0;
            for (let ocena of przedmiot.hist) {
                series[i].data.push(ocena);
                i++;
            }
        }
        setChartSeries(series);
    }

    return (
        <>
            <Button onClick={(e) => fetchHisrograms() }>Załaduj</Button>
            <TableContainer component={Paper} sx={{ width: 1000}}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>LP.</TableCell>
                            <TableCell>Przedmiot</TableCell>
                            {ocenyHist.map((ocena, key) => (
                                <TableCell align="right" key={key}>{ocena}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {histogram.reverse().map((element, key) => (
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                key={key}
                            >
                                <TableCell component="th" scope="row">{key + 1}</TableCell>
                                <TableCell component="th" scope="row">{element.przedmiot}</TableCell>
                                {element.hist.map((ilosc, key2) => (
                                    <TableCell align="right" key={key2}>{ilosc}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {chartSeries != null && (
                <BarChart
                    series={chartSeries}
                    height={400}
                    xAxis={[{ data: histogram.reverse().filter(n => n.przedmiot != "Wszystkie").map(n => n.przedmiot), scaleType: 'band' }]}
                    margin={{ top: 50, bottom: 30, left: 40, right: 10 }}
                />
            )}
            
            {histogram.length != 0 && (
                <PieChart 
                    width={600}
                    height={300}
                    series={[{
                        arcLabel: (item) => `${item.value}%`,
                        arcLabelMinAngle: 35,
                        arcLabelRadius: '60%',
                        data: histogram.filter(n => n.przedmiot == "Wszystkie").at(0).hist.map((n, i) => {
                            return {
                                id: i,
                                value: n,
                                label: `Ocena ${2.0 + i * 0.5}`
                            }
                        })
                    }]}
                    sx={{
                        
                      }}
                />
            )}
        </>
    )
}