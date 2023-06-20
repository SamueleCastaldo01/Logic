import React, { useEffect, useState } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, where, getDocs, orderBy, serverTimestamp, limit} from 'firebase/firestore';
import useMediaQuery from '@mui/material/useMediaQuery';
import moment from 'moment';
import { getCountFromServer } from 'firebase/firestore';
import { TextField } from '@mui/material';
import { db } from "../firebase-config";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { notifyErrorCli, notifyUpdateCli, notifyErrorCliEm } from '../components/Notify';
import Autocomplete from '@mui/material/Autocomplete';
import { AutoDataScal } from './AddNota';
import { supa, guid, tutti } from '../components/utenti';
import PrintIcon from '@mui/icons-material/Print';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Switch from '@mui/material/Switch';

export const AutoProdCli = [];

function NotaDipData({notaDat, getNotaDip }) {
 
    const [todos, setTodos] = React.useState([]);
    const [todosDataAuto, setTodosDataAuto] = React.useState([]);


    const [nomeC, setNomeC] = React.useState("");
    const [cont, setCont] = React.useState(1);
    const [flagDelete, setFlagDelete] = useState(false); 
    const [switChchecked, setSwitchChecked] = React.useState(false);
    const [switInt, setswitInt] = React.useState("0");

    const [dataSc, setDataSc] = React.useState(notaDat);

    const [popupActive, setPopupActive] = useState(true);  
  
    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))   //confronto con uid corrente
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true
  
    const scalCollectionRef = collection(db, "addNota"); 
    const matches = useMediaQuery('(max-width:600px)');  //media query true se è uno smartphone
  
    let navigate = useNavigate();
  
    function handleInputChange(event, value) {
      console.log({todosDataAuto});
        setDataSc(value)
    }

    const handleChangeSwitch = (event) => {
      setSwitchChecked(event.target.checked);

    };
//_________________________________________________________________________________________________________________
const contEffect = async () => {  //fa il conteggio
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


    React.useEffect(() => {  //va a prendere tutte le date degli ordini creati, mi serve come autocomplete
      const collectionRef = collection(db, "ordDat");
      const q = query(collectionRef, orderBy("dataMilli", "desc"), limit(100));
  
      const unsub = onSnapshot(q, (querySnapshot) => {
        let todosArray = [];
        querySnapshot.forEach((doc) => {
          todosArray.push({ ...doc.data(), id: doc.id });
        });
        setTodosDataAuto(todosArray);
      });
      return () => unsub();
    }, []);
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
    {/**************NAVBAR MOBILE*************************************** */}
    <div className='navMobile row'>
      <div className='col-2'>
      </div>
      <div className='col' style={{padding: 0}}>
      <p className='navText'> NoteDip </p>
      </div>
      </div>
  
      <div className='container' style={{padding: "20px"}}>
  {/**************tabelle********************************************************************************************************/}
      <div className='row' style={{marginTop: "40px"}}>
        <div className='col'>
    {/***********tabella note Non completate********************************************************************************** */}
        <div  className='todo_containerOrdCli'>
        <div className='row'> 
        <div className='col' style={{paddingRight: "0px"}} >
        <p className='colTextTitle'> Ordine Clienti</p>
        { !switChchecked ? <p className='textOrdRed'> Ordini da evadere</p> : <p className='textOrd'> Ordini evasi</p> }
        
        <div style={{height: "25px"}}>
         <Switch sx={{ position: "relative", right: "75px", bottom: "15px" }}
          checked={switChchecked}
          onChange={handleChangeSwitch}
          inputProps={{ 'aria-label': 'controlled' }}/>
      </div>
        </div>
        <div className='col' style={{paddingLeft: "0px"}}>
        <Autocomplete
        freeSolo
      value={dataSc}
      options={todosDataAuto.map((option) => option.data)}
      onInputChange={handleInputChange}
      componentsProps={{ popper: { style: { width: 'fit-content' } } }}
      renderInput={(params) => <TextField {...params} label="Seleziona la data" />}/>
        </div>

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
          {todo.data  === dataSc &&(!switChchecked ? todo.completa == "0" : todo.completa == "1") &&  (
      <>
    <div className='row'>
        <div className='col-1 diviCol'>
            <p className="inpTab" style={{textAlign: "left"}}>{todo.cont}</p>
        </div>
         <div className='col-8 diviCol' 
          onClick={() => {
            getNotaDip(todo.id, todo.cont, todo.nomeC, dataSc, todo.NumCartoni)
                navigate("/notadip");
                         }}>
             <p className="inpTab"  style={{textAlign: "left"}}>{todo.nomeC}</p>
        </div>
        <div className="col colIcon" style={{padding:"0px", marginTop:"8px"}}>  
                        <NavigateNextIcon/>          
        </div>
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
export default NotaDipData;