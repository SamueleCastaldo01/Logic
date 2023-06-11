import React, { useEffect, useState, useRef } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, where, getDocs, orderBy, serverTimestamp} from 'firebase/firestore';
import useMediaQuery from '@mui/material/useMediaQuery';
import moment from 'moment';
import { getCountFromServer } from 'firebase/firestore';
import { TextField } from '@mui/material';
import { db } from "../firebase-config";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { notifyErrorCli, notifyUpdateCli, notifyErrorCliEm } from '../components/Notify';
import Autocomplete from '@mui/material/Autocomplete';
import { AutoComp1 } from './OrdineCliData';
import { supa, guid, tutti } from '../components/utenti';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InputAdornment from '@mui/material/InputAdornment';

export const AutoProdCli = [];
export const AutoDataScal = [];

function AddNota({ ordId, dataOrd, dataOrdConf, getNotaId, getNotaDataScal }) {
 
    const [todos, setTodos] = React.useState([]);
    const [nomeC, setNomeC] = React.useState("");
    const [cont, setCont] = React.useState(1);
    const [flagDelete, setFlagDelete] = useState(false); 
    const [debitoRes, setDebitoRes] = React.useState("");
    const [indirizzo, setIndirizzo] = React.useState("");
    const [telefono, setTelefono] = React.useState("");

    const [popupActive, setPopupActive] = useState(true);  

    const [searchTerm, setSearchTerm] = useState("");  //search
    const [searchTerm2, setSearchTerm2] = useState("");  //search
    const inputRef= useRef();

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))   //confronto con uid corrente
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true
  
    const scalCollectionRef = collection(db, "addNota"); 
    const matches = useMediaQuery('(max-width:600px)');  //media query true se è uno smartphone
  
    let navigate = useNavigate();
  
    function handleInputChange(event, value) {
      setNomeC(value)
    }

//_________________________________________________________________________________________________________________
    const auto = async (nomeCli) => {  //array per i prodotti dei clienti
      const q = query(collection(db, "prodottoClin"), where("author.name", "==", nomeCli));
      const querySnapshot = await  getDocs(q);
      querySnapshot.forEach((doc) => {

      let car = { label: doc.data().nomeP,
                  prezzoUni: doc.data().prezzoUnitario }
      AutoProdCli.push(car);
      });
      }

      const autoData = async () => {
        const q = query(collection(db, "scalDat")); // vado a prendere tutte le date di scaletta, questo devo cercare di mettere un limitatore, o potrebbe creare problemi in caso di parecchie date
        const querySnapshot = await  getDocs(q);
        querySnapshot.forEach((hi) => {  
        let car = { label: hi.data().data }
        AutoDataScal.push(car);
        });
        }
//_________________________________________________________________________________________________________________
const contEffect = async () => {
    const coll = collection(db, "addNota");
    const q = query(coll, where("data", "==", dataOrdConf), orderBy("createdAt"));
    const snapshot = await getCountFromServer(q);
    setCont(snapshot.data().count+1)
  }

    function handleContAdd() {  //si attiva durante la creazione della nota
        setCont(cont+1);
    }
    function handleContRem() {  // si attiva durante la cancellazione della nota
        setCont(cont-1);
    }
  
    const contUpdate = async ( dat) => { //si attiva quando viene eliminato un cliente Contatore, non funziona perfettamente
        var cn=0;
            const collectionRef = collection(db, "addNota");
              //aggiorna il contatore di tutti i dati di addNota della stessa data, in base all'ordine di creazione
              const q = query(collectionRef, where("data", "==", dat), orderBy("createdAt"));
              const querySnapshot = await getDocs(q);
              querySnapshot.forEach(async (hi) => {
              await updateDoc(doc(db, "addNota", hi.id), { cont: cn=cn+1});
              });
      };
 //_________________________________________________________________________________________________________________   
      const handleDebitoRes = async () => {   //funzione che viene richiamata quando si crea la nota
        var debRes=0;
        const q = query(collection(db, "debito"), where("nomeC", "==", nomeC));  //dobbiamo prendere d1, tramite nome del cliente
        const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            debRes=+doc.data().deb1 ;
            });
            localStorage.setItem("DebCli", debRes)
            setDebitoRes(debRes);
      }

      const handleIndiTel = async () => {
        var indiri;
        var telefo;
        var iva;
        const p = query(collection(db, "clin"), where("nomeC", "==", nomeC));  //dobbiamo prendere l'indirizzo e il tel, tramite nome del cliente
        const querySnapshotp = await getDocs(p);
        querySnapshotp.forEach((doc) => {
          indiri= doc.data().indirizzo;
          telefo= doc.data().cellulare;
          iva = doc.data().partitaIva;
          });
          localStorage.setItem("indiri", indiri);
          localStorage.setItem("telefo", telefo);
          localStorage.setItem("iva", iva);
          console.log(localStorage.getItem("indiri"))
          setIndirizzo(indiri);
          setTelefono(telefo);
      }

      const handleContaNote = async () => {   //funzione che viene richiamata quando si crea/elimina la nota    fa il conteggio delle note di quella data
        const coll = collection(db, "addNota");
        const q = query(coll, where("data", "==", dataOrdConf));
        const snapshot = await getCountFromServer(q);
        console.log('count: ', snapshot.data().count);
        await updateDoc(doc(db, "ordDat", ordId), { numeroNote: snapshot.data().count});  //aggiorna il conteggio nel database
      }

    //_________________________________________________________________________________________________________________
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
            handleDelete(localStorage.getItem("OrdId"), localStorage.getItem("OrdNomeC"), localStorage.getItem("OrdData"));
            contUpdate(localStorage.getItem("OrdData"))
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
  
    const setClear = () => {
        setNomeC("");
        toast.dismiss();
        toast.clearWaitingQueue();}
  
  //********************************************************************************** */
  
    React.useEffect(() => {
      const collectionRef = collection(db, "addNota");
      const q = query(collectionRef, orderBy("cont"));
  
      const unsub = onSnapshot(q, (querySnapshot) => {
        let todosArray = [];
        querySnapshot.forEach((doc) => {
          todosArray.push({ ...doc.data(), id: doc.id });
        });
        setTodos(todosArray);
      });
      contEffect();
      localStorage.removeItem("OrdId");
      return () => unsub();
    }, []);
      //_________________________________________________________________________________________________________________
  //****************************************************************************************** */
   //stampa
  
  function HandleSpeedAddScalClien() {
    setPopupActive(true);
  }
  /******************************************************************************* */
  const createCate = async (e) => {
    e.preventDefault(); 
    handleDebitoRes();
    handleIndiTel();
    var bol= true
    //verifica che non ci sia lo stesso nome del cliente
    const q = query(collection(db, "addNota"), where("nomeC", "==", nomeC), where("data", "==", dataOrdConf));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    if (doc.data().nomeC == nomeC) {
        notifyErrorCli()
        toast.clearWaitingQueue(); 
        bol=false
    }
    });
    if(!nomeC) {
      notifyErrorCliEm();
      toast.clearWaitingQueue(); 
      return
    }
    if(bol == true) {
    handleContAdd();
    await addDoc(collection(db, "addNota"), {
      cont,
      nomeC,
      completa : "0",
      data: dataOrdConf,
      NumCartoni:"0",
      NumBuste:"0",
      sommaTotale:0,
      debitoTotale:0,
      createdAt: serverTimestamp(),
      debitoRes: localStorage.getItem("DebCli"),
      indirizzo: localStorage.getItem("indiri"),
      tel: localStorage.getItem("telefo"),
      partitaIva: localStorage.getItem("iva")
    });
    setNomeC("");
    setClear();
    handleContaNote();
    }
  };

  //****************************************************************************************** */
    const handleEdit = async (todo, nome, numA, not, deb, quot) => {
      await updateDoc(doc(db, "addNota", todo.id), { nomeC: nome, numAsc:numA, note:not, debito:deb, quota:quot});
      notifyUpdateCli();
      toast.clearWaitingQueue(); 
    };
    const toggleComplete = async (todo) => {
      await updateDoc(doc(db, "addNota", todo.id), { completed: !todo.completed });
    };

    //_____________________________________________________________________________________
    const handleDelete = async (id, nomeCli, DataC) => {
      handleContRem();

      const colDoc = doc(db, "addNota", id); 
    //elimina tutti i dati di nota di quel cliente con la stessa data
      const q = query(collection(db, "Nota"), where("dataC", "==", DataC), where("nomeC", "==", nomeCli));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (hi) => {
      await deleteDoc(doc(db, "Nota", hi.id)); 
      });
      //infine elimina la data di AddNota
      await deleteDoc(colDoc);
      handleContaNote(); 
    };
    //**************************************************************************** */
    const actions = [
      { icon: <PrintIcon />, name: 'Stampa'},
      { icon: <AddIcon />, name: 'Aggiungi Cliente', action: HandleSpeedAddScalClien },
    ];
  //**************************************************************************** */
  //                              NICE
  //********************************************************************************** */
      return ( 
      <>  
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          hidden={!matches}
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
          <h1 className='title mt-3'>Ordine Clienti</h1>
          <h3 style={{fontSize: "20px"}}>{moment(dataOrd.toDate()).format("L")}</h3>
  
          {!matches &&
        <div>
          <span><button onClick={ () => {
              getNotaDataScal(dataOrdConf)
                navigate("/addclientescaletta");
                autoData();
                AutoDataScal.length = 0
          }}>Aggiungi cliente alla scaletta</button></span>
          <span><button onClick={HandleSpeedAddScalClien}>Aggiungi Cliente </button></span>
          <span><button onClick={() => {setFlagDelete(!flagDelete)}}>elimina</button></span>
        </div>
      }
   {/************************INSERIMENTO CLIENTE********************************************************************/}       
      {sup ===true && (
          <>
      {popupActive &&     
          <div>  
        <form className='formAddNot' onSubmit={createCate}>
        
        <div className='divCloseSc'>  <button type='button' className="button-close float-end" onClick={() => { setPopupActive(false); }}>
                <CloseIcon id="i" />
                </button> </div>
        <div className="input_container">
        <Autocomplete
      value={nomeC}
      options={AutoComp1}
      onInputChange={handleInputChange}
      componentsProps={{ popper: { style: { width: 'fit-content' } } }}
      renderInput={(params) => <TextField {...params} label="Cliente" />}
    />
            <div className="btn_container">
            <Button className='mt-3' type='submit' variant="outlined">Aggiungi Cliente</Button>
            </div>
  
        </div>
      </form>
      </div>
      }
      </>
      )}
  
  {/**************tabella********************************************************************************************************/}
      <div className='row'>
  {/***********Note non completate********************************************************************************** */}
        <div className='col'>
  <div  className='todo_containerOrdCli mt-5'>
        <div className='row'> 
        <div className='col'>
        <p className='colTextTitle'> Ordine Clienti</p>
        <p className='textOrdRed'> Note non Completate</p>
        </div>
        <div className='col'>
        <TextField
      inputRef={inputRef}
      className="inputSearchOrd"
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
        <div className='row'>
        <div className='col-1' >
        <p className='coltext'>N</p>
        </div>
        <div className='col-8' >
        <p className='coltext'>Cliente</p>
        </div>
        <hr style={{margin: "0"}}/>
      </div>

      <div className="scrollOrdCli">
      {todos.filter((val)=> {
        if(searchTerm === ""){
          return val
      } else if (val.nomeC.toLowerCase().includes(searchTerm.toLowerCase())  ) {
        return val
                }
            }).map((todo) => (
          <div key={todo.id}>
          {todo.data  === dataOrdConf && todo.completa === "0" &&  (
      <>
    <div className='row'>
        <div className='col-1 diviCol'>
            <p className="inpTab" style={{textAlign: "left"}}>{todo.cont}</p>
        </div>
         <div className='col-8 diviCol' 
          onClick={() => {
                getNotaId(todo.id, todo.cont, todo.nomeC, dataOrd, dataOrdConf, todo.NumCartoni, todo.sommaTotale, todo.debitoRes, todo.debitoTotale, todo.indirizzo, todo.tel, todo.partitaIva, todo.completa)
                navigate("/nota");
                auto(todo.nomeC);
                AutoProdCli.length = 0
                         }}>
             <p className="inpTab"  style={{textAlign: "left"}}>{todo.nomeC}</p>
        </div>
        <div className="col colIcon" style={{padding:"0px", marginTop:"8px"}}>  
                        <NavigateNextIcon/>          
        </div>
          {flagDelete &&
        <div className="col diviCol" style={{padding:"0px", marginTop:"-8px"}}>    
            <button
                className="button-delete"
                onClick={() => {
                localStorage.setItem("OrdId", todo.id);
                localStorage.setItem("OrdNomeC", todo.nomeC);
                localStorage.setItem("OrdData", todo.data);
                displayMsg();
                 toast.clearWaitingQueue(); 
                         }}>
                <DeleteIcon id="i" />
            </button>            
        </div>
      }
    </div>
    <hr style={{margin: "0"}}/>
             </>
                  )}
          </div>
        ))} 
        </div>
        </div>
        </div>
        <div className='col'> 
        {/***********Note completate********************************************************************************** */}
        <div  className='todo_containerOrdCli mt-5'>
        <div className='row'> 
        <div className='col'>
        <p className='colTextTitle'> Ordine Clienti</p>
        <p className='textOrd'> Note Completate</p>
        </div>
        <div className='col'>
        <TextField
      inputRef={inputRef}
      className="inputSearchOrd"
      onChange={event => {setSearchTerm2(event.target.value)}}
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
        <div className='row'>
        <div className='col-1' >
        <p className='coltext'>N</p>
        </div>
        <div className='col-8' >
        <p className='coltext'>Cliente</p>
        </div>
        <hr style={{margin: "0"}}/>
      </div>

      <div className="scrollOrdCli">
      {todos.filter((val)=> {
        if(searchTerm2 === ""){
          return val
      } else if (val.nomeC.toLowerCase().includes(searchTerm2.toLowerCase())  ) {
        return val
                }
            }).map((todo) => (
          <div key={todo.id}>
          {todo.data  === dataOrdConf && todo.completa === "1" &&  (
      <>
    <div className='row'>
        <div className='col-1 diviCol'>
            <p className="inpTab" style={{textAlign: "left"}}>{todo.cont}</p>
        </div>
         <div className='col-8 diviCol' 
          onClick={() => {
                getNotaId(todo.id, todo.cont, todo.nomeC, dataOrd, dataOrdConf, todo.NumCartoni, todo.sommaTotale, todo.debitoRes, todo.debitoTotale, todo.indirizzo, todo.tel, todo.partitaIva, todo.completa)
                navigate("/nota");
                auto(todo.nomeC);
                AutoProdCli.length = 0
                         }}>
             <p className="inpTab"  style={{textAlign: "left"}}>{todo.nomeC}</p>
        </div>
        <div className="col colIcon" style={{padding:"0px", marginTop:"8px"}}>  
                        <NavigateNextIcon/>          
        </div>
          {flagDelete &&
        <div className="col diviCol" style={{padding:"0px", marginTop:"-8px"}}>    
            <button
                className="button-delete"
                onClick={() => {
                localStorage.setItem("OrdId", todo.id);
                localStorage.setItem("OrdNomeC", todo.nomeC);
                localStorage.setItem("OrdData", todo.data);
                displayMsg();
                 toast.clearWaitingQueue(); 
                         }}>
                <DeleteIcon id="i" />
            </button>            
        </div>
      }
    </div>
    <hr style={{margin: "0"}}/>
             </>
                  )}
          </div>
        ))} 
        </div>
        </div>
        </div>
      </div>
      </>
        )
  }
export default AddNota;