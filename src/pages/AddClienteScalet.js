import React, { useEffect, useState } from 'react'
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
import { AutoDataScal } from './AddNota';
import { supa, guid, tutti } from '../components/utenti';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export const AutoProdCli = [];

function AddClienteScalet({notaDat, getDataScal }) {
 
    const [todos, setTodos] = React.useState([]);
    const [todosScalet, setTodosScalet] = React.useState([]);


    const [nomeC, setNomeC] = React.useState("");
    const [cont, setCont] = React.useState(1);
    const [flagDelete, setFlagDelete] = useState(false); 
    const [debitoRes, setDebitoRes] = React.useState("");
    const [indirizzo, setIndirizzo] = React.useState("");
    const [telefono, setTelefono] = React.useState("");

    const [dataSc, setDataSc] = React.useState("");

    const [popupActive, setPopupActive] = useState(true);  
  
    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))   //confronto con uid corrente
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true
  
    const scalCollectionRef = collection(db, "addNota"); 
    const matches = useMediaQuery('(max-width:600px)');  //media query true se è uno smartphone
  
    let navigate = useNavigate();
  
    function handleInputChange(event, value) {
        setDataSc(value)
    }
//_________________________________________________________________________________________________________________
const contEffect = async () => {
    console.log({notaDat})
    const coll = collection(db, "addNota");
    const q = query(coll, where("data", "==", notaDat));
    const snapshot = await getCountFromServer(q);
    console.log('count: ', snapshot.data().count);
    setCont(snapshot.data().count+1)
  }
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
            handleDelete(localStorage.getItem("scalId"));
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

    React.useEffect(() => {
        const collectionRef = collection(db, "Scaletta");
        const q = query(collectionRef, orderBy("createdAt"));
    
        const unsub = onSnapshot(q, (querySnapshot) => {
          let todosArray = [];
          querySnapshot.forEach((doc) => {
            todosArray.push({ ...doc.data(), id: doc.id });
          });
          setTodosScalet(todosArray);
        });
        contEffect();
        localStorage.removeItem("OrdId");
        return () => unsub();
      }, []);
  /******************************************************************************* */
  const createCate = async ( nomeCli, nCart, nBt, debTot, dataAddNota, id) => {
    var bol= true
    var bol2= false
    var qtNAsc = ""
    //verifica che la data che è stata presa nell'autocomplete sia vera, che fa parte di scaletData
    const q2 = query(collection(db, "scalDat"), where("data", "==", dataSc));
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc) => {
    if (doc.data().data == dataSc) {
        bol2= true
    }
    });
    if (bol2 === false) {  //se la data è sbagliata non esegue la creazione
        return
    }
            //query che va a trovare il numero di ASCIUGAMANI,  !!attenzione il nome è statico
    const q3 = query(collection(db, "Nota"), where("dataC", "==", dataAddNota), where("nomeC", "==", nomeCli), where("prodottoC", "==", "ROIAL ASCIUGAMANO 60 pz"));
    const querySnapshotq3 = await getDocs(q3);
    querySnapshotq3.forEach(async (hi) => {
        console.log("sono entrato nella query")
        qtNAsc = +qtNAsc + (+hi.data().qtProdotto)
    });

    //verifica che non ci sia lo stesso nome del cliente nella Scaletta, quando vado ad inserire un nuovo cliente
    const q = query(collection(db, "Scaletta"), where("nomeC", "==", nomeCli), where("dataScal", "==", dataSc));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    if (doc.data().nomeC == nomeCli) {
        notifyErrorCli()
        toast.clearWaitingQueue(); 
        bol=false
    }
    });
    if(bol == true) {
    await addDoc(collection(db, "Scaletta"), {  //aggiungo un nuovo cliente alla scaletta
      idNota: id,
      nomeC: nomeCli,
      numAsc: qtNAsc,
      createdAt: serverTimestamp(),
      dataScal: dataSc,
      NumCartoni: nCart,
      NumBuste: nBt,
      note: "",
      quota: "",
      debito: debTot,
    });
    }
  };
    //_____________________________________________________________________________________
    const handleDelete = async (id) => {
      const colDoc = doc(db, "Scaletta", id); 
      //infine elimina la data di AddNota
      await deleteDoc(colDoc); 
    };
    //**************************************************************************** */
    const actions = [
      { icon: <PrintIcon />, name: 'Stampa'},
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
          <h1 className='title mt-3'>Aggiungi Cliente alla Scaletta</h1>
          {!matches &&
        <div>
          <span><button onClick={() => {setFlagDelete(!flagDelete)}}>elimina</button></span>
        </div>
      }
  
  {/**************tabella********************************************************************************************************/}
      <div className='row'>
        <div className='col'>
        {/***********tabella note completate********************************************************************************** */}
        <div  className='todo_containerOrdCli mt-5'>
        <div className='row'> 
        <p className='colTextTitle'> Ordine Clienti &ensp; &ensp;&ensp;  {notaDat}</p>
        <p className='textOrd'> Note Completate</p>
        </div>
        <div className='row'>
        <div className='col-1' >
        <p className='coltext'>N</p>
        </div>
        <div className='col-8' >
        <p className='coltext'>Cliente</p>
        </div>
        
      </div>
      <hr style={{margin: "0"}}/>
       {todos.map((todo) => (
          <div key={todo.id}>
          {todo.data  === notaDat && todo.completa === "1" &&  (
      <>
    <div className='row'>
        <div className='col-1 diviCol'>
            <p className="inpTab" style={{textAlign: "left"}}>{todo.cont}</p>
        </div>
         <div className='col-8 diviCol' 
          onClick={() => {

                         }}>
             <p className="inpTab"  style={{textAlign: "left"}}>{todo.nomeC}</p>
        </div>
        <div className="col colIcon" style={{padding:"0px", marginTop:"8px"}}>  
           <button onClick={ ()=> {
            createCate(todo.nomeC, todo.NumCartoni, todo.NumBuste, todo.debitoTotale, todo.data, todo.id)
           }}> Add </button>          
        </div>
    </div>
    <hr style={{margin: "0"}}/>
             </>
                  )}
          </div>
        ))} 
        </div>
        </div>
        <div className='col'> 
{/**********Tabella Scaletta********************************************************************** */}
<div  className='todo_containerOrdCli mt-5'>
        <div className='row'> 
        <div className='col-4'>
            <p className='colTextTitle' onClick={ ()=> {
            getDataScal(dataSc)
                navigate("/scaletta");
            }}> <u>Scaletta</u></p>                
        </div>
        <div className='col'>
        <Autocomplete
      value={dataSc}
      options={AutoDataScal}
      onInputChange={handleInputChange}
      componentsProps={{ popper: { style: { width: 'fit-content' } } }}
      renderInput={(params) => <TextField {...params} label="Seleziona la data" />}/>
        </div>
        </div>
        <div className='row'>
        <div className='col-8' >
        <p className='coltext'>Cliente</p>
        </div>
        
      </div>
      <hr style={{margin: "0"}}/>
       {todosScalet.map((todo) => (
          <div key={todo.id}>
          {todo.dataScal  === dataSc  &&  (
      <>
    <div className='row'>
         <div className='col-8 diviCol' 
          onClick={() => {
                         }}>
             <p className="inpTab"  style={{textAlign: "left"}}>{todo.nomeC}</p>
        </div>
        { flagDelete &&
            <div className='col diviCol' style={{padding:"0px", marginTop:"-8px"}}>
                <button
                className="button-delete"
                onClick={() => {
                localStorage.setItem("scalId", todo.id);
                displayMsg();
                toast.clearWaitingQueue(); 
                            }}>
                <DeleteIcon id="i" />
                </button>  
            </div>}
    </div>
    <hr style={{margin: "0"}}/>
             </>
                  )}
          </div>
        ))} 
        </div>

        </div>
      </div>
      </>
        )
  }
export default AddClienteScalet;