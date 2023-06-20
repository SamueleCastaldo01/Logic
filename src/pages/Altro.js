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

function Altro(  ) {

  const [todos, setTodos] = React.useState([]);
  const [todosInSospeso, setTodosInSospeso] = React.useState([]);
  const [todosNumNote, setTodosNumNote] = React.useState([]);
  const [todosScaletta, setTodosScaletta] = React.useState([]);
  
  const [flagAnaCli, setFlagAnaCli] = useState(true);   
  const [flagDelete, setFlagDelete] = useState(false);  
  const [popupActiveCrono, setPopupActiveCrono] = useState(false);  
  const timeElapsed = Date.now();  //prende la data attuale in millisecondi
  const today = new Date(timeElapsed);    //converte
  const [day, setday] = React.useState("");
  const [day1, setday1] = React.useState("");  //primo flitro dei giorni

  const [searchTerm, setSearchTerm] = useState("");  //search
  const [searchTermSosp, setSearchTermSosp] = useState("");  //search
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

//********************************************************************************** */
      //todos in ordine
React.useEffect(() => {
    const collectionRef = collection(db, "inOrdine");
    const q = query(collectionRef, orderBy("nomeC"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
      today.setDate(today.getDate() - 31);   //fa la differenza rispetto al valore del select sottraendo, il risultato sarà in millisecondi
      localStorage.setItem("bho", today.getTime())
      localStorage.setItem("bho1", today.getTime())
    });
    return () => unsub();

  }, []);

  React.useEffect(() => {
    const collectionRef = collection(db, "inSospeso");
    const q = query(collectionRef, orderBy("nomeC"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodosInSospeso(todosArray);
    });
    return () => unsub();

  }, []);

//******************Per il grafico Ordini********************************************************************* */
  React.useEffect(() => {    //si va a prendere il numero di note nelle varie date solo le
    const collectionRef = collection(db, "ordDat");
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
    <h1 className='title mt-3'> Altro</h1>
    <div>
        <span><button>Bho</button></span>

      </div>


{/********************tabella In ordine************************************************************************/}
{flagAnaCli &&
<div className='todo_containerInOrdine mt-5'>
<div className='row' > 
<div className='col-8'>
<p className='colTextTitle'> In ordine </p>
</div>
<div className='col'>
<TextField
      inputRef={inputRef}
      className="inputSearch"
      onChange={event => {setSearchTermSosp(event.target.value)}}
      type="text"
      placeholder="Ricerca Cliente"
      InputProps={{
      startAdornment: (
      <InputAdornment position="start">
      <SearchIcon color='secondary'/>
      </InputAdornment>
                ),
                }}
       variant="outlined"/>
</div>
</div>
<div className='row' style={{marginRight: "5px"}}>
<div className='col-4' >
<p className='coltext' >Cliente</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext' >Qt</p>
</div>
<div className='col-5' style={{padding: "0px"}}>
<p className='coltext' >Prodotto</p>
</div>
<div className='col-2' style={{padding: "0px"}}>
<p className='coltext' >Data Inserimento</p>
</div>
    <hr style={{margin: "0"}}/>
</div>

{todos.filter((val)=> {
        if(searchTermSosp === ""){
          return val
      } else if (val.nomeC.toLowerCase().includes(searchTermSosp.toLowerCase()) ) {
        return val
                }
            }).map((todo) => (
    <div key={todo.id}>
    <div className='row' style={{padding: "0px", marginRight: "5px"}}>
      <div className='col-4 diviCol'><p className='inpTab'>{todo.nomeC} </p> </div>
      <div className='col-1 diviCol' style={{padding: "0px"}}><p className='inpTab'>{todo.qtProdotto}</p></div>
      <div className='col-5 diviCol' style={{padding: "0px"}}><p className='inpTab'>{todo.prodottoC}</p></div>
      <div className='col-2 diviCol' style={{padding: "0px"}}><p className='inpTab'>{todo.dataC}</p></div>
      <hr style={{margin: "0"}}/>
    </div>
    </div>
  ))}

  </div>  
  }   

{/********************tabella In Sospeso************************************************************************/}
  <div className='todo_containerInOrdine mt-5'>
<div className='row' > 
<div className='col-8'>
<p className='colTextTitle'> In Sospeso </p>
</div>
<div className='col'>
<TextField
      inputRef={inputRef}
      className="inputSearch"
      onChange={event => {setSearchTerm(event.target.value)}}
      type="text"
      placeholder="Ricerca Cliente"
      InputProps={{
      startAdornment: (
      <InputAdornment position="start">
      <SearchIcon color='secondary'/>
      </InputAdornment>
                ),
                }}
       variant="outlined"/>
</div>
</div>
<div className='row' style={{marginRight: "5px"}}>
<div className='col-4' >
<p className='coltext' >Cliente</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext' >Qt</p>
</div>
<div className='col-5' style={{padding: "0px"}}>
<p className='coltext' >Prodotto</p>
</div>
<div className='col-2' style={{padding: "0px"}}>
<p className='coltext' >Data Inserimento</p>
</div>
    <hr style={{margin: "0"}}/>
</div>

{todosInSospeso.filter((val)=> {
        if(searchTerm === ""){
          return val
      } else if (val.nomeC.toLowerCase().includes(searchTerm.toLowerCase()) ) {
        return val
                }
            }).map((todo) => (
    <div key={todo.id}>
    <div className='row' style={{padding: "0px", marginRight: "5px"}}>
      <div className='col-4 diviCol'><p className='inpTab'>{todo.nomeC} </p> </div>
      <div className='col-1 diviCol' style={{padding: "0px"}}><p className='inpTab'>{todo.qtProdotto}</p></div>
      <div className='col-5 diviCol' style={{padding: "0px"}}><p className='inpTab'>{todo.prodottoC}</p></div>
      <div className='col-2 diviCol' style={{padding: "0px"}}><p className='inpTab'>{todo.dataC}</p></div>
      <hr style={{margin: "0"}}/>
    </div>
    </div>
  ))}

  </div>

    </>
      )
}
export default Altro;