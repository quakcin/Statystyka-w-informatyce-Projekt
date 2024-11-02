import './App.css';

import { Route, Router, Routes } from 'react-router-dom';
import Main from './Main';
import { useEffect } from 'react';

import Dexie from 'dexie';

export const db = new Dexie("Usos");

function App() 
{

  useEffect(() => {
    db.version(1).stores({
      oceny: "++id,student,przedmiot,ocena"
    });

  }, []);

  return (
    <Routes>
      <Route path="/" Component={() => <Main />} />
    </Routes>
  );
}

export default App;
