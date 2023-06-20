import React, { useEffect, useState, useRef } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, orderBy, serverTimestamp, getCountFromServer, limit, where, getDocs} from 'firebase/firestore';
import TextField from '@mui/material/TextField';
import { Input } from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from "../firebase-config";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { notifyErrorCliEm, notifyUpdateCli, notifyErrorCliList } from '../components/Notify';
import CloseIcon from '@mui/icons-material/Close';
import TodoClient from '../components/TodoClient';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { supa } from '../components/utenti';
import { guid } from '../components/utenti';
import { tutti } from '../components/utenti';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { Bar } from 'react-chartjs-2';
import { optionsNumCart, optionsTotQuota, optionsNumAsc } from '../components/OptionsGrafici';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function HomePage(  ) {

  const [todosNumNote, setTodosNumNote] = React.useState([]);
  const [todosScaletta, setTodosScaletta] = React.useState([]);
  

  const [dataNumNot, setDataNumNot] = useState({
    labels: "",
    datasets: [{
      label: "Numero note",
      data: "",
    }]
  })

  const [dataTotQuota, setDataTotQuota] = useState({
    labels: "",
    datasets: [{
      label: "Numero note",
      data: "",
    }]
  })

  const [dataTotAsc, setDataTotAsc] = useState({
    labels: "",
    datasets: [{
      label: "Numero note",
      data: "",
    }]
  })

  const [flagDelete, setFlagDelete] = useState(false);  
  const timeElapsed = Date.now();  //prende la data attuale in millisecondi
  const today = new Date(timeElapsed);    //converte
  const [day, setday] = React.useState("");
  const [day1, setday1] = React.useState("");  //primo flitro dei giorni

  const [searchTerm, setSearchTerm] = useState("");  //search
  const inputRef= useRef();


  //permessi utente
  let sup= supa.includes(localStorage.getItem("uid"))
  let gui= guid.includes(localStorage.getItem("uid"))
  let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

  let navigate = useNavigate();

  const handleChangeDataSelect = (event) => {
    setday(event.target.value);      //prende il valore del select
    var ok= event.target.value
    today.setDate(today.getDate() - ok);   //fa la differenza rispetto al valore del select sottraendo, il risultato sarà in millisecondi
     localStorage.setItem("bho", today.getTime())
  };


  const handleChangeDataSelect1 = (event) => {
    setday1(event.target.value);      //prende il valore del select
    var ok= event.target.value
    today.setDate(today.getDate() - ok);   //fa la differenza rispetto al valore del select sottraendo, il risultato sarà in millisecondi
     localStorage.setItem("bho1", today.getTime())
  };
   //_________________________________________________________________________________________________________________
     //confirmation notification to remove the collection
     const Msg = () => (
      <div style={{fontSize: "16px"}}>
        <p style={{marginBottom: "0px"}}>Sicuro di voler eliminare</p>
        <p style={{marginBottom: "0px"}}>(perderai tutti i dati)</p>
        <button className='buttonApply ms-4 mt-2 me-1 rounded-4' onClick={Remove}>Si</button>
        <button className='buttonClose mt-2 rounded-4'>No</button>
      </div>
    )

      const Remove = () => {
          handleDelete(localStorage.getItem("IDscal"), localStorage.getItem("NomeCliProd") );
          toast.clearWaitingQueue(); 
               }

    const displayMsg = () => {
      toast.warn(<Msg/>, {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Slide,
        theme: "dark",
        className: "rounded-4"
        })}



//******************Per il grafico Ordini********************************************************************* */
  React.useEffect(() => {    //si va a prendere il numero di note nelle varie date solo le
    const collectionRef = collection(db, "ordDatBloccata");
    const q = query(collectionRef, orderBy("dataMilli"), limit(30));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        if(doc.data().dataMilli >= localStorage.getItem("bho1")) {
          let car = { data: doc.data().data,  numeroNote: doc.data().numeroNote}
          todosArray.push(car);
        }
      });
      setTodosNumNote(todosArray);
    });
    return () => unsub();
  }, [day1]);

  React.useEffect(() => {    //se la variabile cambia allora viene eseguita questa funzione
    handleNumNot();
    handleTotQuota();
  }, [todosNumNote]);


//**************************************************************************** */
const handleNumNot = async () => {
    setDataNumNot({
      labels: todosNumNote.map((dati) => dati.data ),
      datasets: [{
        label: "Ordini",
        data: todosNumNote.map((dati) => dati.numeroNote ),
        backgroundColor: ["#CCB497"],
        borderColor: ["#CCB497"],
        tension: 0.4,
      }]
    })
};

const handleTotQuota = async () => {
  setDataTotQuota({
    labels: todosNumNote.map((dati) => dati.data ),
    datasets: [{
      label: "Totale Quota",
      data: todosNumNote.map((dati) => dati.totalQuota ),
      backgroundColor: ["#CCB497"],
      borderColor: ["#CCB497"],
      tension: 0.4,
    }]
  })
};



  const handleDelete = async (id, nomeCli) => {
    const colDoc = doc(db, "clin", id); 
    //infine elimina la data
    await deleteDoc(colDoc); 
  };

//**************************************************************************** */
//                              NICE
//********************************************************************************** */
    return ( 
    <>  
    <h1 className='title mt-3'> HomePage Supervisore</h1>
    <div>
        <span><button>In ordine</button></span>
        <span><button onClick={() => {setFlagDelete(!flagDelete)}}>elimina</button></span>
      </div>

<div className='row mt-2'>
  <div className='col'>
    <div className='grafici'>
    <FormControl >
        <InputLabel id="demo-simple-select-label"></InputLabel>
        <Select sx={{height:39, marginLeft:-1, width: 200}}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={31}
          onChange={handleChangeDataSelect1}
        >
          <MenuItem value={8}>Ultimi 7 giorni</MenuItem>
          <MenuItem value={31}>Ultimi 30 giorni</MenuItem>
          <MenuItem value={91}>Ultimi 90 giorni</MenuItem>
          <MenuItem value={366}>Ultimi 365 giorni</MenuItem>
        </Select>
      </FormControl>
      <Line data={dataNumNot} options={optionsNumCart}/>
    </div>
  </div>
  <div className='col'>
    <div className='grafici'>
    <FormControl >
        <InputLabel id="demo-simple-select-label"></InputLabel>
        <Select sx={{height:39, marginLeft:-1, width: 200}}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={31}
          onChange={handleChangeDataSelect}
        >
          <MenuItem value={8}>Ultimi 7 giorni</MenuItem>
          <MenuItem value={31}>Ultimi 30 giorni</MenuItem>
          <MenuItem value={91}>Ultimi 90 giorni</MenuItem>
          <MenuItem value={366}>Ultimi 365 giorni</MenuItem>
        </Select>
      </FormControl>
      <Line data={dataTotQuota} options={optionsTotQuota}/>
    </div>
  </div>
</div>

    </>
      )
}
export default HomePage;

//questo file sta combinato insieme a todoClient