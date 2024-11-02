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
    if (Math.random() < 0.5) {
        return `${randomArrayElement(_nazwiska_meskie)} ${randomArrayElement(_imiona_meskie)}`;
    }

    return `${randomArrayElement(_nazwiska_damskie)} ${randomArrayElement(_imiona_damskie)}`;
}

function getRandomName ()
{
    let name;
    do {
        name = getRandomNameExact();
    } while (namebuffer.includes(name));
    namebuffer.push(name);
    return name;
}

async function generateMarks ()
{
    db.oceny.clear()
    for (let i = 0; i < 30; i++) {
        const student = getRandomName();
        for (const przedmiot of _przedmioty) {
            // oceny: "++id,student,przedmiot,ocena"
            const ocena = {
                student: `${student}`,
                przedmiot: przedmiot,
                ocena: Math.round(2.0 + Math.random() * (5.0 - 2.5)) + (Math.random() < 0.5 ? 0.5 : 0.0)
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