import { db } from "./App";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { _imiona_damskie, _imiona_meskie, _nazwiska_damskie, _nazwiska_meskie, _przedmioty } from "./lut";

function randomArrayElement (arr)
{
    const idx = Math.round(Math.random() * arr.length - 1);
    return arr.at(idx);
}

const namebuffer = [];

function getRandomNameExact ()
{
    const isMen = Math.random() < 0.5;
    if (isMen) {
        return [true, `${randomArrayElement(_nazwiska_meskie)} ${randomArrayElement(_imiona_meskie)}`];
    }

    return [false, `${randomArrayElement(_nazwiska_damskie)} ${randomArrayElement(_imiona_damskie)}`];
}

function getRandomName ()
{
    let name;
    let isMan;

    do {
        [isMan, name] = getRandomNameExact();
    } while (namebuffer.includes(name));
    namebuffer.push(name);
    return [isMan, name];
}

const getRandomOcena = function ()
{
    const oceny = [];
    for (let i = 2.0; i <= 5.0; i += 0.5) {
        if (i == 2.5) {
            continue;
        }

        oceny.push(i);
    }
    return randomArrayElement(oceny);
}

async function generateMarks ()
{
    db.oceny.clear()

    for (let i = 0; i < 30; i++) {
        const [isMan, student] = getRandomName();
        let matma = 2.0;

        for (const przedmiot of _przedmioty) {
            let losowaOcena = getRandomOcena();


            if (przedmiot == "Informatyka" && losowaOcena >= 4.0 && Math.random() < 0.8) { // MB
                losowaOcena -= 2.0;
            }

            if (przedmiot == "Język obcy" && Math.random() < 0.3) {
                losowaOcena = Math.random() < 0.5 ? 5.0 : 4.5;
            }

            if (przedmiot == "Język obcy" && losowaOcena <= 3.0 && Math.random() < 0.5) {
                losowaOcena = 4.0;
            }

            if (przedmiot == "Fizyka") {
                if (Math.random() < 0.5) {
                    losowaOcena = matma;
                } else {
                    if (matma > 3.0 && matma < 5.0) {
                        losowaOcena = matma + (Math.random() < 0.5 ? -0.5 : 0.5);
                    }
                }
            }

            if (losowaOcena == 2.5) {
                if (Math.random() < 0.5) {
                    losowaOcena -= 0.5;
                } else {
                    losowaOcena += 0.5;
                }
            }

            if (przedmiot == "Matematyka") {
                matma = losowaOcena;
            }

            if (przedmiot == "WF" && losowaOcena == 2.0) {
                losowaOcena = 3.0;
            }

            const ocena = {
                student: `${student}`,
                przedmiot: przedmiot,
                ocena: losowaOcena,
                plec: isMan
            }

            await db.oceny.add(ocena);
        }
    }
}
export default function Generator() {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Generator Losowych Ocen
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={(e) => generateMarks() }>Uruchom</Button>
            </CardActions>
        </Card>
    )
}