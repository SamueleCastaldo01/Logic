import React, { useEffect, useState, useRef } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, where, getDocs, orderBy, serverTimestamp} from 'firebase/firestore';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';
import { TextField } from '@mui/material';
import { auth, db } from "../firebase-config";
import useMediaQuery from '@mui/material/useMediaQuery';
import { AutoCompProd } from '../components/TodoClient';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { notifyError } from '../components/Notify';
import Todo from '../components/Todo';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {notifyErrorProd, notifyUpdateProd, notifyErrorPrezzoUni, notifyErrorProdList } from '../components/Notify';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import { AutoComp } from './ScaletData';
import { supa } from '../components/utenti';
import { guid } from '../components/utenti';
import { tutti } from '../components/utenti';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import TodoProdClin from '../components/TodoProdClin';
import ShareIcon from '@mui/icons-material/Share';
import SearchIcon from '@mui/icons-material/Search';
import { WhatsappShareButton, WhatsappIcon } from 'react-share';
import { motion } from 'framer-motion';

function DashClienti({ clientId, nomeCli, getNotaDash }) {

  const [todos, setTodos] = React.useState([]);
  const [todosOrdChiu, setTodosOrdChiu] = React.useState([]);

  const timeElapsed = Date.now();  //prende la data attuale in millisecondi
  const today = new Date(timeElapsed);    //converte
  const [day, setday] = React.useState("");

  const [sommaTotIncasso, setSommaTotIncasso] = React.useState(0);
  const [sommaTotVendita, setSommaTotVendita] = React.useState(0);

  const componentRef = useRef();  //serve per la stampa
  let navigate = useNavigate();

  const [flagTabellaProdotti, setFlagTabellaProdotti] = useState(false);  
  const [FlagStampa, setFlagStampa] = useState(false);

  const matches = useMediaQuery('(max-width:600px)');  //media query true se è uno smartphone
  const [popupActive, setPopupActive] = useState(false); 

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

    const [searchTerm, setSearchTerm] = useState("");  //search
    const inputRef= useRef();

//_________________________________________________________________________________________________________________
     //messaggio di conferma per cancellare la trupla
     const Msg = () => (
      <div style={{fontSize: "16px"}}>
        <p style={{marginBottom: "0px"}}>Sicuro di voler eliminare</p>
        <p style={{marginBottom: "0px"}}>(perderai tutti i dati)</p>
        <button className='buttonApply ms-4 mt-2 me-1 rounded-4' onClick={Remove}>Si</button>
        <button className='buttonClose mt-2 rounded-4'>No</button>
      </div>
    )

      const Remove = () => {
          handleDelete(localStorage.getItem("IdProdClin") );
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
  React.useEffect(() => {   //mi serve per la tabella ordini chiusi
    const collectionRef = collection(db, "addNotaBloccata");
    const q = query(collectionRef, orderBy("data", "desc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodosOrdChiu(todosArray);
    });
    return () => unsub();
  }, []);

  React.useEffect(() => {   //mi serve per la tabella ordini chiusi
    SommaTot()
  }, [todosOrdChiu, day]);
    //**************************************************************************** */

    const handleChangeDataSelect = (event) => {
      setday(event.target.value);      //prende il valore del select
      var ok= event.target.value
      today.setDate(today.getDate() - ok);   //fa la differenza rispetto al valore del select sottraendo
       localStorage.setItem("bho4", today.getTime())
    };

    const SommaTot = async () => {  //fa la somma totale, di tutti i prezzi totali
      var sommaTotIncasso=0;
      var sommaTotVendita=0;
        todosOrdChiu.map((nice) => {
          if (nomeCli == nice.nomeC && nice.dataMilli >= localStorage.getItem("bho4")) {   //se il nome della tinta è uguale ad un prodotto dell'array allora si prende il prezzo unitario
            sommaTotIncasso=+nice.quota + sommaTotIncasso;   // va a fare la somma totale
             sommaTotVendita=+nice.sommaTotale + sommaTotVendita;   // va a fare la somma totale
          }
        })
      var somTruncIncasso = sommaTotIncasso.toFixed(2);
      var SommaTruncVendita = sommaTotVendita.toFixed(2)
    
      setSommaTotIncasso(somTruncIncasso);
      setSommaTotVendita(SommaTruncVendita);
      }

  //*********Stampa******************************************************************* */
 const handlePrint = useReactToPrint({
  content: () => componentRef.current,
  documentTitle: 'emp-data',
  onAfterPrint: () => setFlagStampa(false)
})

const print = async () => {
  setFlagStampa(true);
  setTimeout(function(){
    handlePrint();
  },1);
}
  //**************************************************************************** */
    const handleDelete = async (id) => {
      await deleteDoc(doc(db, "prodottoClin", id));
    };

//*************************************************************************** */
//      INTERFACCIA
//*********************************************************************************** */

      return ( 
      <> 
      <motion.div
        initial= {{x: "-100vw"}}
        animate= {{x: 0}}
        transition={{ duration: 0.4 }}
       >
        <h1 className='title mt-3'> Dashboard Clienti</h1>
        <h4 className='mt-3'>Nome Cliente: {nomeCli} </h4>

{/*********************** Icona Share
        <WhatsappShareButton url={"https://github.com/nygardk/react-share"}>
        <WhatsappIcon type="button" size={40} round={true} />
    </WhatsappShareButton>
*/}
        {!matches &&
      <div>
        <span><button >Debito </button></span>
      </div>
    }

{/*************Tabella ordini chiusi******************************************* */}
<div ref={componentRef} className='todo_containerProdCli mt-3'>
<div className='row' > 
<div className='col-5'>
<p className='colTextTitle'> Ordini Chiusi</p>
<p className='coltext' style={{color: "black"}}> {nomeCli} </p>
</div>
    <div className='col-5'>
      <FormControl >
        <InputLabel id="demo-simple-select-label"></InputLabel>
          <Select sx={{height:39, marginLeft:-1, width: 200}}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            defaultValue={8}
            onChange={handleChangeDataSelect}>
              <MenuItem value={8}>Ultimi 7 giorni</MenuItem>
              <MenuItem value={31}>Ultimi 30 giorni</MenuItem>
              <MenuItem value={91}>Ultimi 90 giorni</MenuItem>
              <MenuItem value={366}>Ultimi 365 giorni</MenuItem>
           </Select>
        </FormControl>
    </div>
    <div className='col-2'>
      <button onClick={print}> <ShareIcon/> </button>
    </div>
</div>
    <div className='row mt-1' style={{padding: "0px"}}>
<div className='col-2'></div>
    <div className='col' style={{padding: "0px"}}>
    <span><h6> Tot. Incasso: {sommaTotIncasso} </h6></span>
    </div>
    <div className='col' style={{padding: "0px"}}>
    <span><h6> Tot. Vendita: {sommaTotVendita} </h6></span>
      </div>
    </div>

<div className='row' style={{marginRight: "5px"}}>

<div className='col' >
<p className='coltext' >Data</p>
</div>
<div className='col' style={{padding: "0px"}}>
<p className='coltext' >Incasso(€)</p>
</div>
<div className='col' style={{padding: "0px"}}>
<p className='coltext' >Vendita(€)</p>
</div>
    <hr style={{margin: "0"}}/>
</div>


{todosOrdChiu.map((todo) => (
    <div key={todo.id}>
    { todo.nomeC == nomeCli && todo.dataMilli >= localStorage.getItem("bho4") && 
    <div className='row' style={{padding: "0px"}}   
                  onClick={() => {
                  getNotaDash(todo.id, todo.nomeC, todo.data)
                navigate("/notadashcliente");
                         }}>
      <div className='col diviCol'><p className='inpTab'>{todo.data} </p> </div>
      <div className='col diviCol'><p className='inpTab'> {todo.quota} </p> </div>
      <div className='col diviCol' style={{padding: "0px"}}><p className='inpTab'>{todo.sommaTotale}</p></div>
      <hr style={{margin: "0"}}/>
    </div>
    }
    </div>
  ))}
  </div>
  </motion.div> 
      </>
        )
  }
  export default DashClienti;
  