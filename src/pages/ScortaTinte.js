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

function ScortaTinte() {

  const [todos, setTodos] = React.useState([]);
  const [crono, setCrono] = React.useState([]);

  const [Progress, setProgress] = React.useState(false);
  const [Progress1, setProgress1] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [brand, setBrand] = React.useState("TECH");
  const [nomeP, setNomeP] = React.useState("");
  const [quantita, setQuantita] = React.useState("");
  const [reparto, setReparto] = React.useState(1);
  const [sottoScorta, setSottoScorta] = React.useState("");
  const [quantitaOrdinabile, setquantitaOrdinabile] = React.useState("");

  const [imageSer, setImageSer] = React.useState(localStorage.getItem("imageProd"));
  const [notaSer, setNotaSer] = React.useState(localStorage.getItem("NotaProd"));

  const componentRef = useRef();  //serve per la stampa
  const matches = useMediaQuery('(max-width:920px)');  //media query true se è uno smartphone

  const [popupActiveCrono, setPopupActiveCrono] = useState(false);  
  const [FlagFilter, setFlagFilter] = useState("0");
  const [FlagEdit, setFlagEdit] = useState("0");
  const [flagTinte, setflagTinte] = useState("TECH");
  const [PrdDisp, setPrdDisp] = useState(-1);

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
    const collectionRef = collection(db, "scortaTinte");
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

const handleChangeBrand = (event) => {
  setBrand(event.target.value);      //prende il valore del select
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
const handleTech = () => {  //ordinamento decrescente
    setflagTinte("TECH");
    handleClosi();
  };
const handleKf = () => {  //ordinamento decrescente
    setflagTinte("KF");
    handleClosi();
  };
const handleKr = () => {  //ordinamento decrescente
    setflagTinte("KR");
    handleClosi();
  };
const handleKG = () => {  //ordinamento decrescente
    setflagTinte("KG");
    handleClosi();
  };
const handleK10 = () => {  //ordinamento decrescente
    setflagTinte("K10");
    handleClosi();
  };
const handleCb = () => {  //ordinamento decrescente
    setflagTinte("CB");
    handleClosi();
  };
const handleNuage = () => {  //ordinamento decrescente
    setflagTinte("NUAGE");
    handleClosi();
  };
const handleRoial = () => {  //ordinamento decrescente
    setflagTinte("ROIAL");
    handleClosi();
  };
const handleVibrance = () => {  //ordinamento decrescente
    setflagTinte("VIBRANCE");
    handleClosi();
  };
const handleNative = () => {  //ordinamento decrescente
    setflagTinte("NATIVE");
    handleClosi();
  };
const handleExtremo = () => {  //ordinamento decrescente
    setflagTinte("EXTREMO");
    handleClosi();
  };

const handleQuantCre = () => {  //va a fare l'ordinamento della qt in modo crescente
  setFlagFilter("1");
  handleClosi();
};

const handleNome = () => {  //va a fare l'ordinamento della qt in modo crescente
  setPrdDisp(-1);
  setFlagFilter("0");
  handleClosi();
};

const handleProdDisp = () => {  //va a prendere i prodotti disponibili
  setPrdDisp(0);
    handleClosi();
  };

function handlePopUp(image, nota) {
  setImageSer(image)
  setNotaSer(nota)
  setPopupActiveSearch(true);
}
 //******************************************************************************* */

 const handleSubmit = async (e) => {   //creazione prdotto
    var bol= true
    e.preventDefault();
    if(!nomeP) {            //controllo che il nom sia inserito
      notifyErrorProd();
      toast.clearWaitingQueue(); 
      return
    }
    // verifica che il prodotto sia univoco per quel brand
    const q = query(collection(db, "scortaTinte"), where("nomeP", "==", nomeP),  where("brand", "==", brand));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    if (doc.data().nomeP == nomeP && doc.data().brand == brand) {
        notifyErrorProdList()
         toast.clearWaitingQueue(); 
        bol=false
    }
    });

    if(bol == true) {
      await addDoc(collection(db, "scortaTinte"), {
        nomeP,
        quantita: 0,
        brand,
        sottoScorta,
        quantitaOrdinabile,
      });
      }
      setNomeP("");
      setFlagEdit(+FlagEdit+1);
  };

//****************************************************************************************** */
  const handleEdit = async ( todo, nome, SotSco, quaOrd) => {
    await updateDoc(doc(db, "scortaTinte", todo.id), { nomeP: nome, sottoScorta:SotSco, quantitaOrdinabile:quaOrd});
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
    await updateDoc(doc(db, "scortaTinte", todo.id), { nomeP: nome, quantita:somma});
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
    await updateDoc(doc(db, "scortaTinte", todo.id), { nomeP: nome, quantita:somma});
    setFlagEdit(+FlagEdit+1);
  };

//**************************************************************************** */
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "scortaTinte", id)); //elimino la tinta
  };

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
  <p className='navText'> Scorta Tinte </p>
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

{!matches ? <h1 className='title mt-3'> Scorta Tinte</h1> : <div style={{marginBottom:"60px"}}></div>} 
      

      <div>
      {sup == true && <span><button onClick={handleSpeedAddProd}>Aggiungi Tinta </button></span>}  
        <span><button onClick={() => {navigate("/scorta")}}>Magazzino</button></span>
        <span><button onClick={handleSpeedScorta}>Scorta Tinte</button></span>
        <span><button onClick={handleSpeedCronologia}>Cronologia </button></span>
        <span><button onClick={print}>Stampa </button></span>
        {sup == true && <span><button onClick={() => {setFlagDelete(!flagDelete)}}>elimina</button></span>}   
      </div>

    {sup ===true && (
        <>    
{/** Aggiungi Tinte **************************************************************************/}
{popupActive &&
      <div> 
      <form className='formScortTinte' onSubmit={handleSubmit}>
      <div className='divClose'>  <button type='button' className="button-close float-end" onClick={() => { setPopupActive(false); }}>
              <CloseIcon id="i" />
              </button> </div>
      <div className="input_container">
      <TextField className='inp mt-2' id="filled-basic" label="Nuance" variant="outlined" autoComplete='off' value={nomeP} 
        onChange={(e) => setNomeP(e.target.value)}/>
          <FormControl >
        <InputLabel id="demo-simple-select-label"></InputLabel>
        <Select sx={{height:39, marginLeft:-1, width: 200, marginTop: "10px"}}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={"TECH"}
          onChange={handleChangeBrand}
        >
          <MenuItem value={"TECH"}>TECH</MenuItem>
          <MenuItem value={"KF"}>KF</MenuItem>
          <MenuItem value={"KR"}>KR</MenuItem>
          <MenuItem value={"KG"}>KG</MenuItem>
          <MenuItem value={"K10"}>K10</MenuItem>
          <MenuItem value={"CB"}>CB</MenuItem>
          <MenuItem value={"NUAGE"}>NUAGE</MenuItem>
          <MenuItem value={"ROIAL"}>ROIAL</MenuItem>
          <MenuItem value={"VIBRANCE"}>VIBRANCE</MenuItem>
          <MenuItem value={"EXTREMO"}>EXTREMO</MenuItem>
          <MenuItem value={"NATIVE"}>NATIVE</MenuItem>
        </Select>
      </FormControl>
      </div>
      <div className="btn_container">
      <Button  type='submit' variant="outlined" >Aggiungi Tinta </Button>
      </div>
    </form>
    </div>
  } 
    </>
    )}

{/** tabella tinte scorta *****************************************************************************************************************/}
{popupActiveScorta &&
<>
<div ref={componentRef} className='todo_containerScorta mt-5' style={{width: dip == true && "100%"}}>
<div className='row' > 
<div className='col-3'>
<p className='colTextTitle'> Scorta Tinte</p>
</div>
<div className='col-3'>
{flagTinte == "TECH" && <p className='colTextTitle' style={{textAlign: "right", color: "black"}}> TECH</p>}
{flagTinte == "KF" && <p className='colTextTitle' style={{textAlign: "right", color: "black"}}> KF</p>}
{flagTinte == "KR" && <p className='colTextTitle' style={{textAlign: "right", color: "black"}}> KR</p>}
{flagTinte == "KG" && <p className='colTextTitle' style={{textAlign: "right", color: "black"}}> KG</p>}
{flagTinte == "K10" && <p className='colTextTitle' style={{textAlign: "right", color: "black"}}> K10</p>}
{flagTinte == "CB" && <p className='colTextTitle' style={{textAlign: "right", color: "black"}}> CB</p>}
{flagTinte == "NUAGE" && <p className='colTextTitle' style={{textAlign: "right", color: "black"}}> NUAGE</p>}
{flagTinte == "ROIAL" && <p className='colTextTitle' style={{textAlign: "right", color: "black"}}> ROIAL</p>}
{flagTinte == "VIBRANCE" && <p className='colTextTitle' style={{textAlign: "right", color: "black"}}> VIBRANCE</p>}
{flagTinte == "EXTREMO" && <p className='colTextTitle' style={{textAlign: "right", color: "black"}}> EXTREMO</p>}
{flagTinte == "NATIVE" && <p className='colTextTitle' style={{textAlign: "right", color: "black"}}> NATIVE</p>}
</div>
<div className='col'>
<TextField
      inputRef={inputRef}
      className="inputSearch"
      onChange={event => {setSearchTerm(event.target.value)}}
      type="text"
      placeholder="Ricerca Tinte"
      InputProps={{
      startAdornment: (
      <InputAdornment position="start">
      <SearchIcon color='secondary'/>
      </InputAdornment>
                ),
                }}
       variant="outlined"/>
  </div>
  <div className='col'>   
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
                <MenuItem onClick={handleNome}>Annulla filtri</MenuItem>
                <MenuItem onClick={handleProdDisp}>Prodotti disponibili</MenuItem>
                <MenuItem onClick={handleQuantCre}>Ord. Quantità Crescente</MenuItem>
                <MenuItem onClick={handleQuant}>Ord. Quantità Decrescente</MenuItem>
                <MenuItem onClick={handleTech}>TECH</MenuItem>
                <MenuItem onClick={handleKf}>KF</MenuItem>
                <MenuItem onClick={handleKr}>KR</MenuItem>
                <MenuItem onClick={handleKG}>KG</MenuItem>
                <MenuItem onClick={handleK10}>K10</MenuItem>
                <MenuItem onClick={handleCb}>CB</MenuItem>
                <MenuItem onClick={handleNuage}>NUAGE</MenuItem>
                <MenuItem onClick={handleRoial}>ROIAL</MenuItem>
                <MenuItem onClick={handleVibrance}>VIBRANCE</MenuItem>
                <MenuItem onClick={handleExtremo}>EXTREMO</MenuItem>
                <MenuItem onClick={handleNative}>NATIVE</MenuItem>
              </Menu>
        </button>
  </div>

</div>

<div className='row' style={{marginRight: "5px"}}>
<div className='col-5' >
<p className='coltext'>Nuance</p>
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
    { flagTinte == todo.brand && todo.quantita> PrdDisp && (
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
     )}
    </div>
  ))}
  </div>
  </div>
  </>
}

{/* tabella cronologia*******************************************************************************************************************/}
{popupActiveCrono &&
  <div className='todo_containerCli mt-5'>
  <div className='row'> 
<p className='colTextTitle'> Cronologia</p>
</div>
  <div className='row' style={{marginRight: "5px"}}>
      <div className='col-3'><p className='coltext' >DataModifica</p></div>
      <div className='col-3' style={{padding: "0px"}}><p className='coltext' >Prodotto</p> </div>
      <div className='col-2' style={{padding: "0px"}}><p className='coltext'>Autore</p></div>
      <div className='col-1' style={{padding: "0px"}}><p className='coltext'>ValoreIni</p></div>
      <div className='col-1' style={{padding: "0px"}}><p className='coltext'>Modifica</p></div>
      <div className='col-1' style={{padding: "0px"}}><p className='coltext'>ValoreFin</p></div>
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
      <div className='col-3 diviCol'><p className='inpTab'>{moment(col.createdAt.toDate()).calendar()}</p></div>
      <div className='col-3 diviCol' style={{padding: "0px"}}><p className='inpTab'>{col.nomeP} </p> </div>
      <div className='col-2 diviCol' style={{padding: "0px"}}><p className='inpTab'>{col.autore}</p></div>
      <div className='col-1 diviCol' style={{padding: "0px"}}><p className='inpTab'>{col.quantIni}</p></div>
      <div className='col-1 diviCol' style={{padding: "0px"}}><p className='inpTab'>{col.quantAgg}</p></div>
      <div className='col-1 diviCol' style={{padding: "0px"}}><p className='inpTab'>{col.quantFin}</p></div>
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
export default ScortaTinte;