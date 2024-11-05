import { Menu, MenuItem, Select } from "@mui/material";
import { _przedmioty } from "./lut";
import { useEffect, useState } from "react";
import { db } from "./App";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Porownywarka ()
{
    const [przedmiot1, setPrzedmiot1] = useState(_przedmioty[0]);
    const [przedmiot2, setPrzedmiot2] = useState(_przedmioty[1]);

    const [porownanie, setPorownanie] = useState([]);

    async function fetchPorownanie ()
    {
        const przedmioty = [przedmiot1, przedmiot2];
        const data = [];

        for (const przedmiot of przedmioty) {
            const zdali = (await db.oceny.where("przedmiot").equals(przedmiot).toArray()).filter(n => n.ocena > 2.0);
            const kobiety = zdali.filter(n => n.plec == false);
            const chlopy = zdali.filter(n => n.plec == true);

            // const wszyscy = kobiety.length + chlopy.length;

            data.push({
                przedmiot: przedmiot, 
                statystyki: [
                    kobiety.length, chlopy.length, (kobiety.length / 30 * 100).toFixed(2) + '%', (chlopy.length / 30 * 100).toFixed(2) + '%'
                ]
            });
        }

        setPorownanie(data);
    }

    useEffect(() => {
        if (db != null) {
            fetchPorownanie();
        }
    }, [przedmiot1, przedmiot2]);


    return (
        <>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center'}}>
                Porównaj 
                <Select onChange={(e) => setPrzedmiot1(e.target.value)} value={przedmiot1}>
                    {_przedmioty.map((p, k) => <MenuItem value={p} key={k} selected={p == przedmiot1}>{p}</MenuItem>)}
                </Select>
                z
                <Select onChange={(e) => setPrzedmiot2(e.target.value)} value={przedmiot2}>
                    {_przedmioty.map((p, k) => <MenuItem value={p} key={k} selected={p == przedmiot2}>{p}</MenuItem>)}
                </Select>
            </div>


            <TableContainer component={Paper} sx={{ width: 800}}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Przedmiot</TableCell>
                            <TableCell align="right">Il. Kobiet</TableCell>
                            <TableCell align="right">Il. Mężczyzn</TableCell>
                            <TableCell align="right">% Kobiet</TableCell>
                            <TableCell align="right">% Mężczyzn</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {porownanie.map((element, key) => (
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                key={key}
                            >
                                <TableCell component="th" scope="row">{element.przedmiot}</TableCell>
                                {element.statystyki.map((dana, key2) => (
                                    <TableCell align="right" key={key2}>{dana}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}