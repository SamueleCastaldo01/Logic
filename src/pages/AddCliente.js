import React, { useEffect, useState, useRef } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, orderBy, where, getDocs} from 'firebase/firestore';
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

const GOOGLE_MAPS_API_KEY = 'AIzaSyAygsHvhG251qZ7-N9oR8A-q1ls9yhNkOQ';

function AddCliente( {getCliId} ) {

  const [todos, setTodos] = React.useState([]);
  const [todosDebi, setTodosDebi] = React.useState([]);

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

  //permessi utente
  let sup= supa.includes(localStorage.getItem("uid"))
  let gui= guid.includes(localStorage.getItem("uid"))
  let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

  let navigate = useNavigate();
   //_________________________________________________________________________________________________________________
     //confirmation notification to remove the collection
     const Msg = () => (
      <div>
        Sicuro di voler eliminare &nbsp;
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
    const collectionRef = collection(db, "clin");
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
            //debito
  React.useEffect(() => {
    const collectionRef = collection(db, "debito");
    const q = query(collectionRef, orderBy("nomeC"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodosDebi(todosArray);
    });
    return () => unsub();

  }, []);
 //******************************************************************************* */
  //speed
  function handleButtonDebito() {
    setFlagAnaCli(false)
    setFlagDebiCli(true)
  } 

  function handleButtonAna() {
    setFlagAnaCli(true)
    setFlagDebiCli(false)
  } 

 //******************************************************************************* */
    //funzione che permette il caricamento automatico dell'aggiunta del prodotto personalizzato
 const handleProdClien = async () => {    //funzione che si attiva quando si aggiunge un prodotto a scorta
  console.log("ciaaao");
  const q = query(collection(db, "prodotto"));  //prendo tutti i prodotti che si trovano in scorta
  const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      console.log(doc.id, " => ", doc.data().nomeP, doc.data().prezzoIndi);
      await addDoc(collection(db, "prodottoClin"), {
        author: { name: nomeC, id: "bho" },
        nomeP: doc.data().nomeP,
        prezzoUnitario: doc.data().prezzoIndi
      })
      });
 }  
  //******************************************************************************* */
 const handleSubmit = async (e, id) => {   //creazione cliente
    e.preventDefault();
    var bol= true
    if(!nomeC) {            
      notifyErrorCliEm();
      toast.clearWaitingQueue(); 
      return 
    }
    const q = query(collection(db, "clin"), where("nomeC", "==", nomeC));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data().nomeC);
    if (doc.data().nomeC == nomeC) {
        notifyErrorCliList()
         toast.clearWaitingQueue(); 
        bol=false
    }
    });
    if(bol == true) {
      handleProdClien();
      await addDoc(collection(db, "clin"), {
        nomeC,
        indirizzo,
        indirizzoLink: "https://www.google.com/maps/search/?api=1&query="+indirizzo,
        partitaIva,
        cellulare,
      });
      await addDoc(collection(db, "debito"), {   //quando si crea il cliente viene creata anche la trupla debito del cliente
        nomeC,
        deb1,
        deb2,
        deb3,
        deb4,
      });
      setNomeC("");
      setIndirizzo("");
      setIndirizzoLink("");
      setPartitaIva("");
      setCellulare("");
    }
  };
//****************************************************************************************** */
  const handleEdit = async ( todo, nome, iv, cel) => {
    await updateDoc(doc(db, "clin", todo.id), { nomeC: nome, partitaIva:iv, cellulare:cel});
    notifyUpdateCli();
    toast.clearWaitingQueue(); 
  };

  const handleEditDeb = async ( todo, nome, dd1, dd2, dd3, dd4) => {
    console.log("entrato")
    await updateDoc(doc(db, "debito", todo.id), { nomeC:nome, deb1:dd1, deb2:dd2, deb3:dd3, deb4:dd4});
    notifyUpdateCli();
    toast.clearWaitingQueue(); 
  };
 //****************************************************************************************** */ 

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
    <div className='wrapper'>
    <div><ToastContainer limit={1} /></div>
    <h1 className='title mt-3'> Lista Clienti</h1>
    <div>
        <span><button onClick={() => { setPopupActive(true) }}>Aggiungi Cliente </button></span>
        <span><button onClick={handleButtonAna}>Anagrafiche Clienti</button></span>
        <span><button onClick={handleButtonDebito}>Debito Clienti </button></span>
      </div>


    {sup ===true && (
        <>    
 
{/** inserimento cliente **************************************************************************/}
{popupActive &&
      <div> 
      <form onSubmit={handleSubmit} className='formAC'>
      <div className='divClose'>  <button type='button' className="button-close float-end" onClick={() => { setPopupActive(false); }}>
              <CloseIcon id="i" />
              </button> </div>
      <div className="input_container">
      <TextField className='inpCli mt-2 me-2' label="Nuovo Cliente" variant="outlined"  autoComplete='off' value={nomeC} 
        onChange={(e) => setNomeC(e.target.value)}/>
    <div className='mt-3' >
          <Input
          fullWidth
          className='inpCli'
            color="primary"
            variant="outlined"
            inputComponent={({ inputRef, onFocus, onBlur, ...props }) => (
              <Autocomplete
                apiKey={GOOGLE_MAPS_API_KEY}
                {...props}
                onPlaceSelected={(place) => {
                  setIndirizzo(place.formatted_address)
                  console.log(place);
                  }}
                options={{
                types: ["address"],
                componentRestrictions: { country: "it" },
                }}
                defaultValue={indirizzo}
              />
            )}
          />
        </div>
      <TextField className='inpCli mt-2 ' type="number" label="Partita IVA" variant="outlined" autoComplete='off' value={partitaIva} 
        onChange={(e) => setPartitaIva(e.target.value)}/>
      <TextField className='inpCli mt-2 me-2' type="tel" label="Cellulare" variant="outlined" autoComplete='off' value={cellulare} 
        onChange={(e) => setCellulare(e.target.value)}/>

      </div>
      <div className="btn_container">
      <Button type='submit'  variant="outlined" >Aggiungi</Button>
      </div>
    </form>
    </div>
  } 
    </>
    )}


{/********************tabella Anagrafiche************************************************************************/}
{flagAnaCli &&
<div className='todo_containerCli mt-5'>
<div className='row'>

<div className='col-2' >
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Cliente</p>
</div>
<div className='col-4' style={{padding: "0px"}}>
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>indirizzo</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Part. IVA</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Cellulare</p>
</div>
</div>

<div className="scroll">
  {todos.map((todo) => (
    <div key={todo.id}>
    { ta === true &&(
    <TodoClient
      key={todo.id}
      todo={todo}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      displayMsg={displayMsg}
      getCliId={getCliId}
    />
     )}
    </div>
  ))}
  </div>
  <hr style={{margin: "0"}}/>
  </div>
  }
{/********************tabella Debito************************************************************************/}
{flagDebiCli &&
<div className='todo_containerCli mt-5'>
<div className='row'>

<div className='col-2' >
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Cliente</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Debito1</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Debito2</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Debito3</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Debito4</p>
</div>
</div>

<div className="scroll">
  {todosDebi.map((todo) => (
    <div key={todo.id}>
    { ta === true &&(
    <TodoDebiCli
      key={todo.id}
      todo={todo}
      handleDelete={handleDelete}
      handleEditDeb={handleEditDeb}
      displayMsg={displayMsg}
      getCliId={getCliId}
    />
     )}
    </div>
  ))}
  </div>
  <hr style={{margin: "0"}}/>
  </div>
  }


    </div>
    </>
      )
}
export default AddCliente;

//questo file sta combinato insieme a todoClient