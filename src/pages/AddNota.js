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
import { supa, guid, tutti } from '../components/utenti';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';

export const AutoProdCli = [];

function AddNota({ ordId, dataOrd, dataOrdConf, getNotaId }) {
 
    const [todos, setTodos] = React.useState([]);
    const [nomeC, setNomeC] = React.useState("");
    const [cont, setCont] = React.useState(1);
  
    
    const [popupActive, setPopupActive] = useState(true);  
  
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
    const auto = async (nomeCli) => {
      const q = query(collection(db, "prodottoClin"), where("author.name", "==", nomeCli));
      const querySnapshot = await  getDocs(q);
      querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data().nomeP);

      let car = { label: doc.data().nomeP,
                  prezzoUni: doc.data().prezzoUnitario }
      AutoProdCli.push(car);
      });
      }
//_________________________________________________________________________________________________________________
const contEffect = async () => {
    console.log({dataOrdConf})
    const coll = collection(db, "addNota");
    const q = query(coll, where("data", "==", dataOrdConf));
    const snapshot = await getCountFromServer(q);
    console.log('count: ', snapshot.data().count);
    setCont(snapshot.data().count+1)
  }

    function handleContAdd() {
        setCont(cont+1);
    }
    function handleContRem() {
        setCont(cont-1);
    }
  
    const contUpdate = async ( dat) => { //si attiva quando viene eliminato un cliente
        var cn=0;
            const collectionRef = collection(db, "addNota");
              //aggiorna il contatore di tutti i dati di addNota della stessa data
              const q = query(collectionRef, where("data", "==", dat));
              const querySnapshot = await getDocs(q);
              querySnapshot.forEach(async (hi) => {
              await updateDoc(doc(db, "addNota", hi.id), { cont: cn=cn+1});
              });
      };

    //_________________________________________________________________________________________________________________
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
            contUpdate(localStorage.getItem("OrdData"))
            handleDelete(localStorage.getItem("OrdId"));
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
      data: dataOrdConf,
    });
    setNomeC("");
    setClear();
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
    const handleDelete = async (id) => {
      await deleteDoc(doc(db, "addNota", id));
      handleContRem();
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
  
      <div className="wrapper">
        <div><ToastContainer limit={1} /></div>
          <h1 className='title mt-3'>Ordine Clienti</h1>
          <h3>{moment(dataOrd.toDate()).format("L")}</h3>
  
          {!matches &&
        <div>
          <span><button onClick={HandleSpeedAddScalClien}>Aggiungi Cliente </button></span>
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
  
  {/**********************************************************************************************************************/}
      
        <div  className='todo_container mt-5'>
        <div className='row'>
        <div className='col-1' >
        <p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Cont</p>
        </div>
        <div className='col-2' >
        <p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Cliente</p>
        </div>
        
      </div>
      <hr style={{margin: "0"}}/>
       {/** tabella per visualizzare */}
       {todos.map((todo) => (
          <div key={todo.id}>
          {todo.data  === dataOrdConf &&  (
      <>
    <div className='row'>
        <div className='col-1' >
            <p className="inpTab" style={{textAlign: "left"}}>{todo.cont}</p>
        </div>
         <div className='col-2' >
             <p className="inpTab"  style={{textAlign: "left"}}>{todo.nomeC}</p>
        </div>
        <div className="col">  
        <button
                className="button-edit"
                onClick={() => {
                getNotaId(todo.id, todo.cont, todo.nomeC, dataOrd, dataOrdConf)
                navigate("/nota");
                auto(todo.nomeC);
                AutoProdCli.length = 0
                         }}>
                <DescriptionIcon id="i" />
            </button>     
            <button
                className="button-delete"
                onClick={() => {
                localStorage.setItem("OrdId", todo.id);
                localStorage.setItem("OrdData", todo.data);
                displayMsg();
                 toast.clearWaitingQueue(); 
                         }}>
                <DeleteIcon id="i" />
            </button>            
        </div>
    </div>
    <hr style={{margin: "0"}}/>
             </>
                  )}
          </div>
        ))}

  
          
        </div>
      </div>
  
      </>
        )
  }
export default AddNota;