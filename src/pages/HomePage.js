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
import Autocomplete from '@mui/material/Autocomplete';
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
import { motion } from 'framer-motion';

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
  const [todosScalettaBlock, setTodosScalettaBlock] = React.useState([]);
  

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

  const [dataSc, setDataSc] = React.useState("");
  const [quotaTot, setQuotaTot] = React.useState(0);

  const [searchTerm, setSearchTerm] = useState("");  //search
  const inputRef= useRef();
  const [popupActive, setPopupActive] = useState(false);  

  //permessi utente
  let sup= supa.includes(localStorage.getItem("uid"))
  let gui= guid.includes(localStorage.getItem("uid"))
  let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

  let navigate = useNavigate();


  function handleInputChange(event, value) {
    var quTot;
    setDataSc(value)
    todosScaletta.map((nice) => {  //qui va a prendere la quota totale da parte dell'array scaldatBlock
      if (value == nice.data) {
        quTot= nice.totalQuota;
      }
  })
  setQuotaTot(quTot);
}

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
    const q = query(collectionRef, orderBy("dataMilli"));

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
  }, [todosNumNote]);

//******************Per il grafico Vendite********************************************************************* */
  React.useEffect(() => {    //va a prendere la quota totale dalla scalettaDat quella bloccata
    const collectionRef = collection(db, "scalDatBloccata");
    const q = query(collectionRef, orderBy("dataMilli"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        if(doc.data().dataMilli >= localStorage.getItem("bho1")) {
          let car = { data: doc.data().data,  totalQuota: doc.data().totalQuota}
          todosArray.push(car);
        }
      });
      setTodosScaletta(todosArray);
    });
    return () => unsub();
  }, [day]);

  React.useEffect(() => {    //se la variabile cambia allora viene eseguita questa funzione
    handleTotQuota();
  }, [todosScaletta]);

  
//******************Per la tabella scaletta chiusa********************************************************************* */
React.useEffect(() => {
  const collectionRef = collection(db, "scalettaBloccata");
  const q = query(collectionRef, orderBy("nomeC"));

  const unsub = onSnapshot(q, (querySnapshot) => {
    let todosArray = [];
    querySnapshot.forEach((doc) => {
      todosArray.push({ ...doc.data(), id: doc.id });
    });
    setTodosScalettaBlock(todosArray);
  });
  return () => unsub();
}, [popupActive == true]);


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
    labels: todosScaletta.map((dati) => dati.data ),
    datasets: [{
      label: "Vendite",
      data: todosScaletta.map((dati) => dati.totalQuota ),
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
    <motion.div
        initial= {{opacity: 0}}
        animate= {{opacity: 1}}
        transition={{ duration: 0.7 }}>
    <h1 className='title mt-3'> HomePage Supervisore</h1>
    <div>
        <span><button onClick={() => {setPopupActive(!popupActive)}}>Scalette Chiuse</button></span>
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
          defaultValue={91}
          onChange={handleChangeDataSelect1}
        >
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
          defaultValue={91}
          onChange={handleChangeDataSelect}
        >
          <MenuItem value={91}>Ultimi 90 giorni</MenuItem>
          <MenuItem value={366}>Ultimi 365 giorni</MenuItem>
        </Select>
      </FormControl>
      <Line data={dataTotQuota} options={optionsTotQuota}/>
    </div>
  </div>
</div>

{/***********Tabella scalette chiuse filtro tramite le date di scal Dat*************************** */}
{popupActive &&
<div className='todo_containerScalet mt-5'>
  <div className='row'> 
  <div className='col'><p className='colTextTitle'> Scalette chiuse</p>
  <p style={{textAlign: "left"}}>Quota Totale: {quotaTot}€</p>
  </div>
  <div className='col' style={{paddingLeft: "0px"}}>
        <Autocomplete
        freeSolo
      value={dataSc}
      options={todosScaletta.map((option) => option.data)}
      onInputChange={handleInputChange}
      componentsProps={{ popper: { style: { width: 'fit-content' } } }}
      renderInput={(params) => <TextField {...params} label="Seleziona la data" />}/>
  </div>


</div>
  <div className='row' style={{marginRight: "5px"}}>
      <div className='col-3'><p className='coltext' >Cliente</p> </div>
      <div className='col-1' style={{padding: "0px"}}><p className='coltext'>Debito</p></div>
      <div className='col-1' style={{padding: "0px"}}><p className='coltext'>Vendita</p></div>
      <div className='col-1' style={{padding: "0px"}}><p className='coltext'>quota</p></div>
      <div className='col-3' style={{padding: "0px"}}><p className='coltext'>note</p></div>
      <hr style={{margin: "0"}}/>
    </div>
    <div className="scroll">
  {todosScalettaBlock.map((col) => (
    <div key={col.id}>
    { dataSc == col.dataScal &&
    <div className='row' style={{padding: "0px"}}>
      <div className='col-3 diviCol'><p className='inpTab'>{col.nomeC} </p> </div>
      <div className='col-1 diviCol' style={{padding: "0px"}}><p className='inpTab'>{col.debito}</p></div>
      <div className='col-1 diviCol' style={{padding: "0px"}}><p className='inpTab'>{col.sommaTotale}</p></div>
      <div className='col-1 diviCol' style={{padding: "0px"}}><p className='inpTab'>{col.quota}</p></div>
      <div className='col-3 diviCol' style={{padding: "0px"}}><textarea style={{textAlign: "left", width:"500px", margin: "0px"}} className='inpTab'>{col.note}</textarea></div>
      <hr style={{margin: "0"}}/>
    </div>
    }
    </div>
    ))}
  </div>
  </div>
 }

  </motion.div>
    </>
      )
}
export default HomePage;

//questo file sta combinato insieme a todoClient