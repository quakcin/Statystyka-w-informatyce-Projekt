import { useState } from "react";
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { db } from "./App";
import { Button } from "@mui/material";


export default function Summary() 
{
    const [oceny, setOceny] = useState([]);
    const [przedmioty, setPrzedmioty] = useState([])

    React.useEffect(() => {
        fetchOceny();
    }, []);

    async function fetchOceny() 
    {
        await db.oceny; // preload
        const allPrzedmioty = await db.oceny.orderBy('przedmiot').uniqueKeys();//.sort();

        const sortedPrzedmioty = allPrzedmioty.sort();
        setPrzedmioty(sortedPrzedmioty);

        const dane = [];
        const studenci = await db.oceny.orderBy('student').uniqueKeys();
        const sortedStudenci = studenci.sort();

        /** Pobieramy oceny studenta */
        for (const student of sortedStudenci) {
            const ocenyForStudent = await db.oceny
                .where("student")
                .equals(student)
                .sortBy("przedmiot");

            dane.push({
                student: student,
                oceny: ocenyForStudent.map(n => n.ocena)
            });
        }

        console.log(dane);
        setOceny(dane);
    }

    return (
        <TableContainer component={Paper} sx={{ width: 900 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>LP.</TableCell>
                        <TableCell>Student</TableCell>
                        {przedmioty.map((przedmiot, key) => (
                            <TableCell align="right" key={key}>{przedmiot}</TableCell>
                        ))}
                        <TableCell>Średnia</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {oceny.map((element, key) => (
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            key={key}
                        >
                            <TableCell component="th" scope="row">{key + 1}</TableCell>
                            <TableCell component="th" scope="row">{element.student}</TableCell>
                            {element.oceny.map((ocena, key2) => (
                                <TableCell align="right" key={key2}>{ocena}</TableCell>
                            ))}
                            <TableCell align="right">{(element.oceny.reduce((a, b) => a + b) / element.oceny.length).toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}