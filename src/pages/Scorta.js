import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, orderBy, where, serverTimestamp, limit, getDocs, getCountFromServer} from 'firebase/firestore';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import moment from 'moment';
import { auth, db } from "../firebase-config";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { notifyErrorProd, notifyUpdateProd, notifyErrorNumNegativo } from '../components/Notify';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import TodoScorta from '../components/TodoScorta';
import Button from '@mui/material/Button';
import { supa, guid, tutti } from '../components/utenti';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import RestoreIcon from '@mui/icons-material/Restore';
import PrintIcon from '@mui/icons-material/Print';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddIcon from '@mui/icons-material/Add';

function Scorta() {

  const [todos, setTodos] = React.useState([]);
  const [crono, setCrono] = React.useState([]);

  const [tipologia, setTipologia] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [nomeP, setNomeP] = React.useState("");
  const [quantita, setQuantita] = React.useState("");
  const [image, setImage] = React.useState("");
  const [prezzoIndi, setPrezzoIndi] = React.useState("");
  const [nota, setNota] = React.useState("");

  const [imageSer, setImageSer] = React.useState(localStorage.getItem("imageProd"));
  const [notaSer, setNotaSer] = React.useState(localStorage.getItem("NotaProd"));

  const componentRef = useRef();  //serve per la stampa
  const matches = useMediaQuery('(max-width:600px)');  //media query true se è uno smartphone

  const [popupActiveCrono, setPopupActiveCrono] = useState(false);  

  const [open, setOpen] = React.useState(false); //serve per lo speedDial
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [FlagStampa, setFlagStampa] = useState(false);

  const [popupActiveSearch, setPopupActiveSearch] = useState(false);  

  const [popupActive, setPopupActive] = useState(false);  
  const [popupActiveScorta, setPopupActiveScorta] = useState(true);  
  const [searchTerm, setSearchTerm] = useState("");  //search
  const inputRef= useRef();

  //permessi utente
  let sup= supa.includes(localStorage.getItem("uid"))
  let gui= guid.includes(localStorage.getItem("uid"))
  let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

  let navigate = useNavigate();

   //_________________________________________________________________________________________________________________
     //messaggio di conferma per cancellare la trupla
     const Msg = () => (
      <div>
        Sicuro di voler eliminare &nbsp;
        <button className='buttonApply ms-4 mt-2 me-1 rounded-4' onClick={Remove}>Si</button>
        <button className='buttonClose mt-2 rounded-4'>No</button>
      </div>
    )

      const Remove = () => {
          handleDelete(localStorage.getItem("IdProd") );
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
  React.useEffect(() => {
    const collectionRef = collection(db, "prodotto");
    const q = query(collectionRef, orderBy("nomeP"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
    });
    return () => unsub();

  }, []);

  React.useEffect(() => {
    const collectionRef = collection(db, "cronologia");
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setCrono(todosArray);
    });
    return () => unsub();

  }, []);

 //******************************************************************************* */
 //stampa
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
 //******************************************************************************* */
  //speed
  function handleSpeedCronologia() {
    setPopupActiveCrono(true)
    setPopupActiveScorta(false)
    setOpen(false)
  } 

  function handleSpeedScorta() {
    setPopupActiveScorta(true)
    setPopupActiveCrono(false)
    setOpen(false)
  }

  function handleSpeedAddProd() {
    setPopupActive(true)
    setOpen(false)
  }
 //******************************************************************************* */
 function handleInputChangeBrand(event, value) {
  setBrand(value)
}

function handlePopUp(image, nota) {
  setImageSer(image)
  setNotaSer(nota)
  setPopupActiveSearch(true);
}
 //******************************************************************************* */
 const handleProdClien = async () => {    //funzione che si attiva quando si aggiunge un prodotto a scorta
  console.log("ciaaao");
  const q = query(collection(db, "clin"));  //prendo tutti i clienti
  const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await addDoc(collection(db, "prodottoClin"), {
        author: { name: doc.data().nomeC, id: doc.id },
        nomeP: nomeP,
        prezzoUnitario: prezzoIndi
      })
      });
 } 
 /**    Funzione per eliminare tutti i campi di una tabella del database
 const provaEli = async () => {    //funzione che si attiva quando si aggiunge un prodotto a scorta
  console.log("ciaaao");
  const q = query(collection(db, "prodottoClin"));  //prendo tutti i clienti
  const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (hi) => {
      await deleteDoc(doc(db, "prodottoClin", hi.id));
      });
 }  */
  
 const handleSubmit = async (e) => {   //creazione cliente
    e.preventDefault();
    if(!nomeP) {            
      notifyErrorProd();
      toast.clearWaitingQueue(); 
      return 
    }
    if(!prezzoIndi) {            
      setPrezzoIndi("0");
    }
      await addDoc(collection(db, "prodotto"), {
        nomeP,
        quantita,
        brand,
        nota,
        prezzoIndi,
        image,
      });
      handleProdClien();
      setNomeP("");
      setTipologia("");
      setBrand("");
      setQuantita("");
      setImage("");
      setPrezzoIndi("");
      setNota("");
  };
 //******************************************************************************************************** */
  const handleCronologia = async (todo, ag, somma, flag) => {   //creazione cliente
    console.log({flag})
    if (flag === "true") {console.log("ciao"); var quant= "+"+ag }
    else {console.log("ciao2"); var quant= "-"+ag }
      await addDoc(collection(db, "cronologia"), {
        autore: auth.currentUser.displayName,
        createdAt: serverTimestamp(),
        nomeP: todo.nomeP,
        quantIni: todo.quantita,
        quantAgg: quant,
        quantFin: somma,
      });
      //remove automatico una volta arrivata a 100 cancella quello più vecchio
      const coll = collection(db, "cronologia");  
      const snapshot = await getCountFromServer(coll);  //va a verificare quante trupe ne sono
      if(snapshot.data().count>50) {  //se supera i 50, deve eliminare la trupla più vecchia (quindi la prima dato che è già ordinato)
        const q = query(collection(db, "cronologia"), orderBy("createdAt"), limit(1));  //prende solo la prima trupla
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (hi) => {
          console.log(hi.id, " => ", hi.data().quantIni, hi.data().quantFin);
      // doc.data() is never undefined for query doc snapshots
        await deleteDoc(doc(db, "cronologia", hi.id)); 
        });
      }

  };
//****************************************************************************************** */
  const handleEdit = async ( todo, nome, quant) => {
    await updateDoc(doc(db, "prodotto", todo.id), { nomeP: nome, quantita:quant});
    notifyUpdateProd();
    toast.clearWaitingQueue(); 
  };

  //****************************************************************************************** */
  const handleAddQuant = async ( todo, nome, ag) => {
    console.log("wewe")
    var flag = localStorage.getItem("flagCron");
    if(ag<=0) { // se è un numero negativo esce dalla funzione
      notifyErrorNumNegativo();
      return
    }
    var somma = +todo.quantita+(+ag)
    await updateDoc(doc(db, "prodotto", todo.id), { nomeP: nome, quantita:somma});
    if(ag) {
       handleCronologia(todo, ag, somma, flag);
    }
  };


  const handleRemQuant = async ( todo, nome, ag) => {
    var flag = localStorage.getItem("flagCron");
    if(ag<=0) { // se è un numero negativo esce dalla funzione e non avviene l'operazione di update
      notifyErrorNumNegativo();
      return
    }
    var somma = +todo.quantita-(+ag)
    if(somma<0) {      //nel caso si la somma è negativa, viene azzerata
      somma=0;  
    }
    await updateDoc(doc(db, "prodotto", todo.id), { nomeP: nome, quantita:somma});
    if(ag) {
      handleCronologia(todo, ag, somma, flag);
    }
  };

//**************************************************************************** */
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "prodotto", id));
  };
//**************************************************************************** */
  const actions = [     //speedDial
    { icon: <InventoryIcon />, name: 'Scorta', action:handleSpeedScorta },
    { icon: <RestoreIcon />, name: 'Cronologia', action: handleSpeedCronologia },
    { icon: <PrintIcon />, name: 'Stampa', action: print},
    { icon: <AddIcon />, name: 'Aggiungi Prodotto', action: handleSpeedAddProd },
  ];
//******************************************************************************************************************************** */
//                              NICE
//********************************************************************************************************************************* */
    return ( 
    <>  
          <SpeedDial
        ariaLabel="SpeedDial basic example"
        hidden={!matches}
        opne={open}
        sx={{ position: 'absolute', bottom: 120, right: 36 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>
    <div className='wrapper'>
    <div><ToastContainer limit={1} /></div>

  {/***************************************************************************************************************************************/}
    {/* POPUP VISUALIZZA RICERCA */}
          {popupActiveSearch && <div className="popup">
        <div className="popup-inner bg-dark rounded-4">
        <div className='divClose'>  <button type='button' className="button-close float-end" onClick={() => { setPopupActiveSearch(false); }}>
              <CloseIcon id="i" />
              </button> </div>
            <img className='mt-1 rounded-3' src={imageSer} style={{height: 185, width: 185}}/>
            <h2> {notaSer} </h2>
        </div>
      </div> }
  {/***************************************************************************************************************************************/}
    <h1 className='title mt-3'>Magazzino</h1>
    {!matches &&
      <div>
        <span><button onClick={handleSpeedAddProd}>Aggiungi Prodotto </button></span>
        <span><button onClick={handleSpeedScorta}>Scorta </button></span>
        <span><button onClick={handleSpeedCronologia}>Cronologia </button></span>
        <span><button onClick={print}>Stampa </button></span>
      </div>
    }
    {sup ===true && (
        <>    
{/** Aggiungi Prodotto **************************************************************************/}
{popupActive &&
      <div> 
      <form className='formScort' onSubmit={handleSubmit}>
      <div className='divClose'>  <button type='button' className="button-close float-end" onClick={() => { setPopupActive(false); }}>
              <CloseIcon id="i" />
              </button> </div>
      <div className="input_container">
      <TextField className='inp mt-2' id="filled-basic" label="Nome Prodotto" variant="outlined" autoComplete='off' value={nomeP} 
        onChange={(e) => setNomeP(e.target.value)}/>
      <TextField className='inp mt-2' type="number" id="filled-basic" label="Prezzo" variant="outlined" autoComplete='off' value={prezzoIndi} 
        onChange={(e) => setPrezzoIndi(e.target.value)}
        InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
        />
      <Autocomplete
      className='mt-2'
        value={brand}
        options={arrBrand}
        onInputChange={handleInputChangeBrand}
        componentsProps={{ popper: { style: { width: 'fit-content' } } }}
        renderInput={(params) => <TextField {...params} label="Brand" />}
      />
      <TextField className='inp mt-2' type="number" id="filled-basic" label="Quantità" variant="outlined" autoComplete='off' value={quantita} 
        onChange={(e) => setQuantita(e.target.value)}/>
      <TextField className='inp mt-2' id="filled-basic" type="url" label="Link image" variant="outlined" autoComplete='off' value={image} 
        onChange={(e) => setImage(e.target.value)}/>
      <TextField className='inp mt-2' id="filled-basic" label="Dove si trova" variant="outlined" autoComplete='off' value={nota} 
        onChange={(e) => setNota(e.target.value)}/>

      </div>
      <div className="btn_container">
      <Button  type='submit' variant="outlined" >Aggiungi Prodotto </Button>
      </div>
    </form>
    </div>
  } 
    </>
    )}

{/** tabella per visualizzare *****************************************************************************************************************/}
{popupActiveScorta &&
<>
    <TextField
      inputRef={inputRef}
      className="inputSearch "
      onChange={event => {setSearchTerm(event.target.value)}}
      type="text"
      placeholder="Ricerca Prodotto"
      InputProps={{
      startAdornment: (
      <InputAdornment position="start">
      <SearchIcon color='secondary'/>
      </InputAdornment>
                ),
                }}
       variant="outlined"/>

<div ref={componentRef} className='todo_containerScorta '>
<div className='row'>

<div className='col-4' >
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Prodotto</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Qt</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Agg</p>
</div>
</div>

<div className="scroll">
  {todos.filter((val)=> {
        if(searchTerm === ""){
          return val
      } else if (val.nomeP.toLowerCase().includes(searchTerm.toLowerCase()) ||  val.brand.toLowerCase().includes(searchTerm.toLowerCase()) ) {
        return val
                }
            }).map((todo) => (
    <div key={todo.id}>
    { ta === true &&(
    <TodoScorta
      key={todo.id}
      todo={todo}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      handleAddQuant={handleAddQuant}
      handleRemQuant= {handleRemQuant}
      handlePopUp={handlePopUp}
      displayMsg={displayMsg}
      FlagStampa={FlagStampa}
    />
     )}
    </div>
  ))}
  </div>
  <hr style={{margin: "0"}}/>
  </div>
  </>
}
{/*******************************************************************************************************************/}

{/* tabella cronologia*******************************************************************************************************************/}
{popupActiveCrono &&
  <div className='todo_containerCli mt-3'>
  <div className='row' style={{padding: "0px"}}>
      <div className='col-2'><p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>DataModifica</p></div>
      <div className='col-1' style={{padding: "0px"}}><p className='coltext' style={{textAlign: "left", fontSize: "20px"}}>Prodotto</p> </div>
      <div className='col-2' style={{padding: "0px"}}><p className='coltext' style={{textAlign: "left", fontSize: "20px"}}>Autore</p></div>
      <div className='col-1' style={{padding: "0px"}}><p className='coltext' style={{textAlign: "left", fontSize: "20px"}}>ValoreIni</p></div>
      <div className='col-1' style={{padding: "0px"}}><p className='coltext' style={{textAlign: "left", fontSize: "20px"}}>Modifica</p></div>
      <div className='col-1' style={{padding: "0px"}}><p className='coltext' style={{textAlign: "left", fontSize: "20px"}}>ValoreFin</p></div>
    </div>
  {crono.map((col) => (
    <div key={col.id}>
    <hr style={{margin: "0"}}/>
    <div className='row' style={{padding: "0px"}}>
      <div className='col-2'><p className='inpTab'>{moment(col.createdAt.toDate()).calendar()}</p></div>
      <div className='col-1' style={{padding: "0px"}}><p className='inpTab'>{col.nomeP} </p> </div>
      <div className='col-2' style={{padding: "0px"}}><p className='inpTab'>{col.autore}</p></div>
      <div className='col-1' style={{padding: "0px"}}><p className='inpTab'>{col.quantIni}</p></div>
      <div className='col-1' style={{padding: "0px"}}><p className='inpTab'>{col.quantAgg}</p></div>
      <div className='col-1' style={{padding: "0px"}}><p className='inpTab'>{col.quantFin}</p></div>
    </div>
    </div>
    ))}
  </div>
}
{/*******************************************************************************************************************/}


    </div>
    </>
      )
}
export default Scorta;

const arrBrand = [
  { label: 'WAHL' },
  { label: 'MOSER' },
  { label: 'GAMA' },
  { label: 'MOVE' },
  { label: 'GAMMA PIU' },
  { label: 'GORDON' },
  { label: 'MELCAP' },
  { label: 'KEPRO' },
  { label: 'GHD' },
  { label: 'JRL' },
  { label: 'BABYLISS' },
];
