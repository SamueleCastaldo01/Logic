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
import { notifyErrorProd, notifyUpdateProd, notifyErrorNumNegativo, notifyErrorProdList, notifyErrorPrezzoProd } from '../components/Notify';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import TodoScorta from '../components/TodoScorta';
import Button from '@mui/material/Button';
import { supa, guid, tutti, dipen } from '../components/utenti';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import RestoreIcon from '@mui/icons-material/Restore';
import PrintIcon from '@mui/icons-material/Print';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { color, motion } from 'framer-motion';

function Scorta() {

  const [todos, setTodos] = React.useState([]);
  const [crono, setCrono] = React.useState([]);
  const [cronoPa, setCronoPa] = React.useState([]);

  const [Progress, setProgress] = React.useState(false);
  const [Progress1, setProgress1] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [tipologia, setTipologia] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [nomeP, setNomeP] = React.useState("");
  const [quantita, setQuantita] = React.useState("");
  const [image, setImage] = React.useState("");
  const [prezzoIndi, setPrezzoIndi] = React.useState("");
  const [reparto, setReparto] = React.useState(1);
  const [sottoScorta, setSottoScorta] = React.useState("");
  const [quantitaOrdinabile, setquantitaOrdinabile] = React.useState("");
  const [nota, setNota] = React.useState("");

  const [imageSer, setImageSer] = React.useState(localStorage.getItem("imageProd"));
  const [notaSer, setNotaSer] = React.useState(localStorage.getItem("NotaProd"));

  const componentRef = useRef();  //serve per la stampa
  const matches = useMediaQuery('(max-width:920px)');  //media query true se è uno smartphone

  const [popupActiveCrono, setPopupActiveCrono] = useState(false);  
  const [popupActiveCronoPa, setPopupActiveCronoPa] = useState(true); 
  const [FlagFilter, setFlagFilter] = useState("0");
  const [PrdDisp, setPrdDisp] = useState(-1);
  const [FlagEdit, setFlagEdit] = useState("0");
  const [FlagRep, setFlagRep] = useState("2");   //incominciamo con il reparto maschile

  const [open, setOpen] = React.useState(false); //serve per lo speedDial
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [FlagStampa, setFlagStampa] = useState(false);
  const [flagDelete, setFlagDelete] = useState(false); 

  const [popupActiveSearch, setPopupActiveSearch] = useState(false);  

  const [popupActive, setPopupActive] = useState(false);  
  const [popupActiveScorta, setPopupActiveScorta] = useState(true);  
  const [searchTerm, setSearchTerm] = useState("");  //search
  const inputRef= useRef();

  //permessi utente
  let sup= supa.includes(localStorage.getItem("uid"))
  let dip= dipen.includes(localStorage.getItem("uid"))
  let gui= guid.includes(localStorage.getItem("uid"))
  let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

  let navigate = useNavigate();

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
          handleDelete(localStorage.getItem("IdProd"),  localStorage.getItem("NomeProd"));
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
    var q;
    q = query(collectionRef, orderBy("nomeP"));  //questa se flagFilter è diverso da 1 e 2
    if(FlagFilter === "1") {   //quantità crescente
      q = query(collectionRef, orderBy("quantita"),  orderBy("nomeP"));
   }
    else if(FlagFilter === "2") {  //quantita descrescente
       q = query(collectionRef, orderBy("quantita", "desc"),  orderBy("nomeP"));
    }

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
      setProgress(true);
    });
    return () => unsub();

  }, [FlagFilter, FlagEdit]);

//cronologia debito
  React.useEffect(() => {
    const collectionRef = collection(db, "cronologia");
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setCrono(todosArray);
      setProgress1(true)
    });
    return () => unsub();

  }, [popupActiveCrono == true]);


  //cronologia Pa
  React.useEffect(() => {
    const collectionRef = collection(db, "cronologiaPa");
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setCronoPa(todosArray);
      setProgress1(true)
    });
    return () => unsub();

  }, [popupActiveCrono == true]);

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
    console.log(localStorage.getItem("profilePic"))
  }

  function handleSpeedAddProd() {
    setPopupActive(true)
    setOpen(false)
  }
 //******************************************************************************* */
 function handleInputChangeBrand(event, value) {
  setBrand(value)
}

const handleChangeDataSelect = (event) => {
  setReparto(event.target.value);      //prende il valore del select
};

const handleMenu = (event) => {
  setAnchorEl(event.currentTarget);
};

const handleClosi = () => {  //chiude il menu
  setAnchorEl(null);
};

const handleQuant = () => {  //ordinamento decrescente
  setFlagFilter("2");
  handleClosi();
};

const handleQuantCre = () => {  //va a fare l'ordinamento della qt in modo crescente
  setFlagFilter("1");
  handleClosi();
};

const handleNome = () => {  //va a fare l'ordinamento della qt in modo crescente
  setFlagFilter("0");
  setPrdDisp(-1);
  handleClosi();
};

const handleProdDisp = () => {  //va a prendere i prodotti disponibili
setPrdDisp(0);
  handleClosi();
};

const handleRepTutti= () => {  //va a fare l'ordinamento della qt in modo crescente
  setFlagRep(0);
  handleClosi();
};

const handleRepFemm = () => {  //va a fare l'ordinamento della qt in modo crescente
  setFlagRep(1);
  handleClosi();
};

const handleRepMasch = () => {  //va a fare l'ordinamento della qt in modo crescente
  setFlagRep(2);
  handleClosi();
};

function handlePopUp(image, nota) {
  setImageSer(image)
  setNotaSer(nota)
  setPopupActiveSearch(true);
}
 //******************************************************************************* */
 const handleProdClien = async () => {    //funzione che si attiva quando si aggiunge un prodotto a scorta
  const q = query(collection(db, "clin"));  //prendo tutti i clienti, va ad aggiungere i prodotti personalizzati, quando si aggiuge un nuovo prodotto
  const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await addDoc(collection(db, "prodottoClin"), {
        author: { name: doc.data().nomeC, id: doc.id },
        nomeP: nomeP,
        prezzoUnitario: prezzoIndi
      })
      });
 } 
  
 const handleSubmit = async (e) => {   //creazione prdotto
    var bol= true
    e.preventDefault();
    if(!nomeP) {            //controllo che il nom sia inserito
      notifyErrorProd();
      toast.clearWaitingQueue(); 
      return
    }
    if(!prezzoIndi) {         //controllo che il prezzo sia inserito   
      notifyErrorPrezzoProd();
      return
    }
    // verifica che il prodotto sia univoco
    const q = query(collection(db, "prodotto"), where("nomeP", "==", nomeP));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    if (doc.data().nomeP == nomeP) {
        notifyErrorProdList()
         toast.clearWaitingQueue(); 
        bol=false
    }
    });

    if(bol == true) {
      await addDoc(collection(db, "prodotto"), {
        nomeP,
        quantita: 0,
        brand,
        pa: 0,
        nota,
        sottoScorta,
        prezzoIndi,
        image,
        reparto,      //se è 0 è femminile, se è 1 è maschile
        quantitaOrdinabile,
      });
      handleProdClien();
      }
      setNomeP("");
      setTipologia("");
      setBrand("");
      setQuantita("");
      setImage("");
      setPrezzoIndi("");
      setNota("");
      setSottoScorta("");
      setquantitaOrdinabile("");
      setFlagEdit(+FlagEdit+1);
  };
 //******************************************************************************************************** */
  const handleCronologia = async (todo, ag, somma, flag) => {   //aggiunta della trupla cronologia quantità
    if (flag === "true") { var quant= "+"+ag }
    else { var quant= "-"+ag }
      await addDoc(collection(db, "cronologia"), {
        autore: auth.currentUser.displayName,
        createdAt: serverTimestamp(),
        nomeP: todo.nomeP,
        quantIni: todo.quantita,
        quantAgg: quant,
        quantFin: somma,
      });
      //rimuove in modo automatico una volta arrivata a 50 e cancella quello più vecchio
      const coll = collection(db, "cronologia");  
      const snapshot = await getCountFromServer(coll);  //va a verificare quante trupe ne sono
      if(snapshot.data().count>50) {  //se supera i 50, deve eliminare la trupla più vecchia (quindi la prima dato che è già ordinata)
        const q = query(collection(db, "cronologia"), orderBy("createdAt"), limit(1));  //prende solo la prima trupla
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (hi) => {
        await deleteDoc(doc(db, "cronologia", hi.id)); //elimina la trupla (quindi quella più vecchia)
        });
      }
  };
   //******************************************************************************************************** */
   const handleCronologiaPa = async (todo, pap ) => {   //aggiunta della trupla cronologia Pa
    console.log("entarto nella coronologia Pa")
    console.log(todo.pa)
      await addDoc(collection(db, "cronologiaPa"), {
        autore: auth.currentUser.displayName,
        createdAt: serverTimestamp(),
        nomeP: todo.nomeP,
        paI: todo.pa,
        paF: pap,
      });
      //rimuove in modo automatico una volta arrivata a 50 e cancella quello più vecchio
      const coll = collection(db, "cronologiaPa");  
      const snapshot = await getCountFromServer(coll);  //va a verificare quante trupe ne sono
      if(snapshot.data().count>50) {  //se supera i 50, deve eliminare la trupla più vecchia (quindi la prima dato che è già ordinata)
        const q = query(collection(db, "cronologiaPa"), orderBy("createdAt"), limit(1));  //prende solo la prima trupla
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (hi) => {
        await deleteDoc(doc(db, "cronologiaPa", hi.id)); //elimina la trupla (quindi quella più vecchia)
        });
      }
  };
//****************************************************************************************** */
  const handleEdit = async ( todo, nome, SotSco, quaOrd, pap) => {
    if(todo.pa != pap) {    //la trupla viene inserita solo se pa viene cambiato
      handleCronologiaPa(todo, pap)
    }
    await updateDoc(doc(db, "prodotto", todo.id), { nomeP: nome, sottoScorta:SotSco, quantitaOrdinabile:quaOrd, pa:pap});
    setFlagEdit(+FlagEdit+1);
    toast.clearWaitingQueue(); 
  };

  //****************************************************************************************** */
  const handleAddQuant = async ( todo, nome, ag) => {
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
    setFlagEdit(+FlagEdit+1);
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
    setFlagEdit(+FlagEdit+1);
  };

//**************************************************************************** */
  const handleDelete = async (id, nomeProd) => {
    console.log({nomeProd})
        // se si elimina il prodotto dalla scorta, questo prodotto viene eliminato per tutti i clienti
        const q = query(collection(db, "prodottoClin"), where("nomeP", "==", nomeProd));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (hi) => {
          await deleteDoc(doc(db, "prodottoClin", hi.id));  
        });


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
{/**************NAVBAR MOBILE*************************************** */}
  <div className='navMobile row'>
  <div className='col-2'>
  </div>
  <div className='col' style={{padding: 0}}>
  <p className='navText'> Magazzino </p>
  </div>
  </div>
   <motion.div
           initial= {{opacity: 0}}
        animate= {{opacity: 1}}
        transition={{ duration: 0.7 }}>
  
  {!matches && 
  <button className="backArrowPage" style={{float: "left"}}
      onClick={() => {navigate(-1)}}>
      <ArrowBackIcon id="i" /></button> 
    }

{!matches ? <h1 className='title mt-3'> Magazzino</h1> : <div style={{marginBottom:"60px"}}></div>} 
      
      <div>
    {sup == true &&  <span><button onClick={handleSpeedAddProd}>Aggiungi Prodotto </button></span>}   
        <span><button onClick={handleSpeedScorta}>Scorta </button></span>
        <span><button onClick={() => {navigate("/scortatinte")}}>Scorta Tinte</button></span>
        <span><button onClick={handleSpeedCronologia}>Cronologia </button></span>
     {/************* <span><button onClick={print}>Stampa </button></span>   */}   
    {sup == true && <span><button onClick={() => {setFlagDelete(!flagDelete)}}>elimina</button></span>}   
      </div>

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
      <TextField className='inp mt-2' type="number"                 
        inputProps={{
                  step: 0.01,
                }} id="filled-basic" label="Prezzo" variant="outlined" autoComplete='off' value={prezzoIndi} 
        onChange={(e) => setPrezzoIndi(e.target.value)}
        InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
        />
          <FormControl >
        <InputLabel id="demo-simple-select-label"></InputLabel>
        <Select sx={{height:39, marginLeft:-1, width: 200, marginTop: "10px"}}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={1}
          onChange={handleChangeDataSelect}
        >
          <MenuItem value={1}>Reparto Femminile</MenuItem>
          <MenuItem value={2}>Reparto Maschile</MenuItem>
        </Select>
      </FormControl>
      </div>
      <div className="btn_container">
      <Button  type='submit' variant="outlined" >Aggiungi Prodotto </Button>
      </div>
    </form>
    </div>
  } 
    </>
    )}

{/** tabella prodotti nel magazzino *****************************************************************************************************************/}
{popupActiveScorta &&
<>
<div ref={componentRef} className='todo_containerScorta mt-5'style={{width: dip == true && "100%"}}>
<div className='row' > 
<div className='col-2'>
<p className='colTextTitle'> Magazzino</p>
</div>
<div className='col-4'>
{FlagRep ==0 && <p className='colTextTitle' style={{textAlign: "right", color: "black"}}> Tutti i prodotti</p>}
{FlagRep ==1 && <p className='colTextTitle' style={{textAlign: "right", color: "black"}}> Rep. Fem.</p>}
{FlagRep ==2 && <p className='colTextTitle' style={{textAlign: "right", color: "black"}}> Rep. Mas.</p>}
</div>
<div className='col' style={{padding: "0px"}}>
<TextField
      inputRef={inputRef}
      className="inputSearchScorta"
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
  </div>
  <div className='col' style={{padding: "0px"}}>   
  <button type="button" className="buttonMenu" style={{padding: "0px"}} >
        <FilterListIcon id="i" onClick={handleMenu}/>
        <Menu  sx={
        { mt: "1px", "& .MuiMenu-paper": 
        { backgroundColor: "#333",
          color: "white" }, 
        }
        }
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClosi}
              >
                <MenuItem onClick={handleNome}>Annulla Filtri</MenuItem>
                <MenuItem onClick={handleProdDisp}>Prodotti disponibili</MenuItem>
                <MenuItem onClick={handleQuantCre}>Quantità Crescente</MenuItem>
                <MenuItem onClick={handleQuant}>Quantità Decrescente</MenuItem>
                <MenuItem onClick={handleRepTutti}>Tutti i Prodotti</MenuItem>
                <MenuItem onClick={handleRepFemm}>Reparto Femminile</MenuItem>
                <MenuItem onClick={handleRepMasch}>Reparto Maschile</MenuItem>
              </Menu>
        </button>
  </div>

</div>

<div className='row' style={{marginRight: "5px"}}>
<div className='col-5' >
<p className='coltext'>Prodotto</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext'>Qt</p>
</div>
{sup == true && 
<>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext'>Ss</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext'>Pa(€)</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext'>Qo</p>
</div>
</>}
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext'>Agg</p>
</div>
<hr style={{margin: "0"}}/>
</div>

<div className="scroll">
  {Progress == false && 
  <div style={{marginTop: "14px"}}>
      <CircularProgress />
  </div>
      }
  {todos.filter((val)=> {
        if(searchTerm === ""){
          return val
      } else if (val.nomeP.toLowerCase().includes(searchTerm.toLowerCase()) ||  val.brand.toLowerCase().includes(searchTerm.toLowerCase()) ) {
        return val
                }
            }).map((todo) => (
    <div key={todo.id}>
    {/*****Si attiva quando seleziono tutti i prodotti********** */}
    { FlagRep == 0 &&(    
      <>
      {todo.quantita > PrdDisp && 
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
      flagDelete= {flagDelete}
    />
    }
    </>
     )}
     { FlagRep != 0 &&(
      <>
      {todo.reparto == FlagRep && todo.quantita > PrdDisp &&
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
      flagDelete= {flagDelete}
    />
      }
    </>
     )}

    </div>
  ))}
  </div>
  </div>
  </>
}

{/* tabella cronologia Quantità*******************************************************************************************************************/}
{popupActiveCrono &&
  <div className='todo_containerCli mt-5'>
  <div className='row'> 
<p className='colTextTitle'> Cronologia Quantità</p>
</div>
  <div className='row' style={{marginRight: "5px"}}>
      <div className='col-3' style={{width:"220px"}}><p  className='coltext' >DataModifica</p></div>
      <div className='col-3' style={{padding: "0px", width:"280px"}}><p className='coltext' >Prodotto</p> </div>
      <div className='col-2' style={{padding: "0px", width:"90px"}}><p className='coltext'>Autore</p></div>
      <div className='col-1' style={{padding: "0px", width:"50px"}}><p className='coltext'>V.Ini.</p></div>
      <div className='col-1' style={{padding: "0px", width:"50px"}}><p className='coltext'>Edit</p></div>
      <div className='col-1' style={{padding: "0px", width:"50px"}}><p className='coltext'>V.Fin.</p></div>
      <hr style={{margin: "0"}}/>
    </div>
    <div className="scroll">
    {Progress1 == false && 
  <div style={{marginTop: "14px"}}>
      <CircularProgress />
  </div>
      }
  {crono.map((col) => (
    <div key={col.id}>
    <div className='row' style={{padding: "0px"}}>
      <div className='col-3 diviCol' style={{width:"220px"}}><p className='inpTab'>{moment(col.createdAt.toDate()).calendar()}</p></div>
      <div className='col-3 diviCol' style={{padding: "0px", width:"280px"}}><p className='inpTab'>{col.nomeP} </p> </div>
      <div className='col-2 diviCol' style={{padding: "0px", width:"90px"}}><p className='inpTab'>{col.autore.substr(0, 7)}..</p></div>
      <div className='col-1 diviCol' style={{padding: "0px", width:"50px"}}><p className='inpTab'>{col.quantIni}</p></div>
      <div className='col-1 diviCol' style={{padding: "0px", width:"50px"}}><p className='inpTab'>{col.quantAgg}</p></div>
      <div className='col-1 diviCol' style={{padding: "0px", width:"50px"}}><p className='inpTab'>{col.quantFin}</p></div>
      <hr style={{margin: "0"}}/>
    </div>
    </div>
    ))}
    </div>
  </div>
}

{/* tabella cronologiaPA*******************************************************************************************************************/}
{popupActiveCrono &&
  <div className='todo_containerCli mt-5'>
  <div className='row'> 
<p className='colTextTitle'> Cronologia PA</p>
</div>
  <div className='row' style={{marginRight: "5px"}}>
      <div className='col-3' style={{width:"220px"}}><p  className='coltext' >DataModifica</p></div>
      <div className='col-3' style={{padding: "0px", width:"280px"}}><p className='coltext' >Prodotto</p> </div>
      <div className='col-2' style={{padding: "0px", width:"90px"}}><p className='coltext'>Autore</p></div>
      <div className='col-1' style={{padding: "0px"}}><p className='coltext'>Pa I.</p></div>
      <div className='col-1' style={{padding: "0px"}}><p className='coltext'>Pa F. </p></div>
      <hr style={{margin: "0"}}/>
    </div>
    <div className="scroll">
    {Progress1 == false && 
  <div style={{marginTop: "14px"}}>
      <CircularProgress />
  </div>
      }
  {cronoPa.map((col) => (
    <div key={col.id}>
    <div className='row' style={{padding: "0px"}}>
      <div className='col-3 diviCol' style={{width:"220px"}}><p className='inpTab'>{moment(col.createdAt.toDate()).calendar()}</p></div>
      <div className='col-3 diviCol' style={{padding: "0px", width:"280px"}}><p className='inpTab'>{col.nomeP} </p> </div>
      <div className='col-2 diviCol' style={{padding: "0px", width:"90px"}}><p className='inpTab'>{col.autore.substr(0, 7)}..</p></div>
      <div className='col-1 diviCol' style={{padding: "0px"}}><p className='inpTab'>{col.paI}</p></div>
      <div className='col-1 diviCol' style={{padding: "0px"}}><p className='inpTab'>{col.paF}</p></div>
      <hr style={{margin: "0"}}/>
    </div>
    </div>
    ))}
    </div>
  </div>
}

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


    
{/*******************************************************************************************************************/}

</motion.div>
    </>
      )
}
export default Scorta;
