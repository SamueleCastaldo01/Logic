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
import Button from '@mui/material/Button';
import { supa } from '../components/utenti';
import { guid } from '../components/utenti';
import { tutti } from '../components/utenti';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { usePlacesWidget } from "react-google-autocomplete";
import TodoDebiCli from '../components/TodoDebiCli';
import SearchIcon from '@mui/icons-material/Search';
import moment from 'moment';
import MiniDrawer from '../components/MiniDrawer';
import Box from '@mui/material/Box';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAygsHvhG251qZ7-N9oR8A-q1ls9yhNkOQ';

function HomePage( {getCliId} ) {

  const [todos, setTodos] = React.useState([]);
  const [todosDebi, setTodosDebi] = React.useState([]);
  const [crono, setCrono] = React.useState([]);

  const [indirizzo, setIndirizzo] = React.useState("");
  const [indirizzoLink, setIndirizzoLink] = React.useState("");
  const [nomeC, setNomeC] = React.useState("");
  const [partitaIva, setPartitaIva] = React.useState("");
  const [cellulare, setCellulare] = React.useState("");

  const [deb1, setDeb1] = React.useState("");
  const [deb2, setDeb2] = React.useState("");
  const [deb3, setDeb3] = React.useState("");
  const [deb4, setDeb4] = React.useState("");

  const [popupActive, setPopupActive] = useState(false);
  const [flagAnaCli, setFlagAnaCli] = useState(true);   
  const [flagDebiCli, setFlagDebiCli] = useState(false);
  const [flagDelete, setFlagDelete] = useState(false);  
  const [popupActiveCrono, setPopupActiveCrono] = useState(false);  

  const [searchTerm, setSearchTerm] = useState("");  //search
  const inputRef= useRef();


  //permessi utente
  let sup= supa.includes(localStorage.getItem("uid"))
  let gui= guid.includes(localStorage.getItem("uid"))
  let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

  let navigate = useNavigate();
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
      //Anagrafiche
React.useEffect(() => {
    const collectionRef = collection(db, "inOrdine");
    const q = query(collectionRef, orderBy("nomeC"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
    });
    return () => unsub();

  }, []);

//****************************************************************************************** */
  const handleEdit = async ( todo, nome, iv, cel) => {
    await updateDoc(doc(db, "clin", todo.id), { nomeC: nome, partitaIva:iv, cellulare:cel});
    toast.clearWaitingQueue(); 
  };
   //******************************************************************************************************** */
   const handleCronologia = async (todo, dd1, debV) => {   //aggiunta della trupla cronologiaDebito;
    await addDoc(collection(db, "cronologiaDeb"), {
      autore: auth.currentUser.displayName,
      createdAt: serverTimestamp(),
      nomeC: todo.nomeC,
      deb1: dd1,     //debito nuovo
      debv: debV,
    });
    //rimuove in modo automatico una volta arrivata a 50 e cancella quello più vecchio
    const coll = collection(db, "cronologiaDeb");  
    const snapshot = await getCountFromServer(coll);  //va a verificare quante trupe ci sono sono
    if(snapshot.data().count>50) {  //se supera i 50, deve eliminare la trupla più vecchia (quindi la prima dato che è già ordinata)
      const q = query(collection(db, "cronologiaDeb"), orderBy("createdAt"), limit(1));  //prende solo la prima trupla
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (hi) => {
      await deleteDoc(doc(db, "cronologiaDeb", hi.id)); //elimina la trupla (quindi quella più vecchia)
      });
    }
};

  const handleDelete = async (id, nomeCli) => {
    const colDoc = doc(db, "clin", id); 
     
  //elimina tutti i dati di prodottoClin con lo stesso nome del Cliente     elimina tutti gli articoli di quel cliente
    const q = query(collection(db, "prodottoClin"), where("author.name", "==", localStorage.getItem("NomeCliProd")));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (hi) => {
  // doc.data() is never undefined for query doc snapshots
    console.log(hi.id, " => ", hi.data().nomeC, hi.data().dataScal);
    await deleteDoc(doc(db, "prodottoClin", hi.id)); 
    });
  //elimina la trupla debito, che ha lo stesso nome del cliente che è stato eliminato
    const p = query(collection(db, "debito"), where("nomeC", "==", nomeCli));
    const querySnapshotP = await getDocs(p);
    querySnapshotP.forEach(async (hi) => {
    await deleteDoc(doc(db, "debito", hi.id));    //elimina il documento che ha lo stesso nome
    });
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


{todos.filter((val)=> {
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
  }   
    </>
      )
}
export default HomePage;

//questo file sta combinato insieme a todoClient