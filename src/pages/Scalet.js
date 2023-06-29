import React, { useEffect, useState } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, where, getDocs, orderBy, serverTimestamp} from 'firebase/firestore';
import { useRef } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';
import { TextField } from '@mui/material';
import { auth, db } from "../firebase-config";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Todo from '../components/Todo';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { notifyErrorCli, notifyUpdateCli, notifyErrorCliEm } from '../components/Notify';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import { AutoComp } from './ScaletData';
import { supa, guid, tutti } from '../components/utenti';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PrintIcon from '@mui/icons-material/Print';
import AddIcon from '@mui/icons-material/Add';
import { StayPrimaryLandscape } from '@mui/icons-material';



function Scalet({ dateEli }) {

  const [todos, setTodos] = React.useState([]);
  const [nomeC, setNomeC] = React.useState("");
  const [numAsc, setNumAsc] = React.useState("");
  const [NumCartoni, setNumCartoni] = React.useState("");
  const [debito, setDebito] = React.useState("");
  const [quota, setQuota] = React.useState("");

  const [sum, setSum]  = React.useState("");
  const [sumQ, setSumQ] =React.useState("");

  const [popupActive, setPopupActive] = useState(false);  
  const [flagStampa, setFlagStampa] = useState(false); 

  const componentRef = useRef();
  

  //permessi utente
  let sup= supa.includes(localStorage.getItem("uid"))   //confronto con uid corrente
  let gui= guid.includes(localStorage.getItem("uid"))
  let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

  const scalCollectionRef = collection(db, "scaletta"); 
  const matches = useMediaQuery('(max-width:600px)');  //media query true se è uno smartphone

  let navigate = useNavigate();

  function handleInputChange(event, value) {
    setNomeC(value)
  }

  //_________________________________________________________________________________________________________________
     const setClear = () => {
      setNomeC("");
      toast.dismiss();
      toast.clearWaitingQueue();}

//********************************************************************************** */
const SomAsc = async () => {  //qui fa sia la somma degli asc che della quota, tramite query
  var somma=0;
  var sommaQ=0;
  var id ="";
  const q = query(collection(db, "Scaletta"), where("dataScal", "==", dateEli));  //query per fare la somma
  const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      somma =+doc.data().numAsc + somma;
      sommaQ=+doc.data().quota +sommaQ;
      });
  
  const p = query(collection(db, "scalDat"), where("data", "==", dateEli));  //query per aggiornare la quota totale e gli asc, va a trovare l'id
  const querySnapshotp = await getDocs(p);
        querySnapshotp.forEach(async (hi) => {
          id= hi.id
          });
      await updateDoc(doc(db, "scalDat", id), { totalQuota: sommaQ, totalAsc:somma });
      setSumQ(sommaQ);
      setSum(somma);
}
//********************************************************************************** */

  React.useEffect(() => {
    const collectionRef = collection(db, "Scaletta");
    const q = query(collectionRef, orderBy("createdAt"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
    });
    localStorage.removeItem("scalId");
    return () => unsub();
  }, []);

//****************************************************************************************** */
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

function HandleSpeedAddScalClien() {
  setPopupActive(true);
}
/******************************************************************************* */
const createCate = async (e) => {
  e.preventDefault(); 
  var bol= true
  const q = query(collection(db, "Scaletta"), where("nomeC", "==", nomeC), where("dataScal", "==", dateEli)); //va a verificare che questo cliente non è stato già inserito
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
  if(!debito) {
    setDebito("0");
  }
  if(!quota) {
    console.log("bhooo")
    setQuota("0");
  }
  if(bol == true) {
  await addDoc(collection(db, "Scaletta"), {
    num: 0,
    nomeC,
    numAsc,
    debito,
    quota,
    createdAt: serverTimestamp(),
    dataScal: dateEli,
    note: "",
    completed: false,
  });
  setNomeC("");
  setQuota("");
  setDebito("");
  setNumAsc("");
  setClear();
  SomAsc();
  }
};

//****************************************************************************************** */
  const handleEdit = async (todo, nome, numA, not, deb, quot, ncart) => {  // va ad aggiornare gli attributi di Scaletta
    await updateDoc(doc(db, "Scaletta", todo.id), { nomeC: nome, numAsc:numA, note:not, debito:deb, quota:quot, NumCartoni:ncart});
    await updateDoc(doc(db, "addNota", todo.idNota), { quota:quot});  //aggiorna addNota, questa quota mi serve perché poi va nella dashClienti (ordini chiusi)
    SomAsc();
    toast.clearWaitingQueue(); 
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "Scaletta", id));
    SomAsc();
  };
  //**************************************************************************** */
  const actions = [
    { icon: <PrintIcon />, name: 'Stampa', action: print},
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
        <h1 className='title mt-3'>Scaletta</h1>
        <h3> {dateEli} </h3>

        {!matches &&
      <div>
        <span><button onClick={print}>Stampa </button></span>
        <span><button onClick={HandleSpeedAddScalClien}>Aggiungi Cliente </button></span>
      </div>
    }
 {/************************INSERIMENTO CLIENTE********************************************************************/}       
    {sup ===true && (
        <>
    {popupActive &&     
        <div>  
      <form className='formSC' onSubmit={createCate}>
      
      <div className='divCloseSc'>  <button type='button' className="button-close float-end" onClick={() => { setPopupActive(false); }}>
              <CloseIcon id="i" />
              </button> </div>
      <div className="input_container">
      <Autocomplete
      value={nomeC}
      options={AutoComp}
      onInputChange={handleInputChange}
      componentsProps={{ popper: { style: { width: 'fit-content' } } }}
      renderInput={(params) => <TextField {...params} label="Cliente" />}
    />
      <TextField className='inp mt-2' id="filled-basic" label="Numero Asc" type="number" autoComplete='off' variant="outlined" value={numAsc} 
      onChange={(e) => setNumAsc(e.target.value)}/>
      <TextField className='inp mt-2' id="filled-basic" label="Debito" type="number" autoComplete='off' variant="outlined" value={debito} 
      onChange={(e) => setDebito(e.target.value)} 
      InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
      />
      <TextField className='inp mt-2' id="filled-basic" label="Quota" type="number" autoComplete='off' variant="outlined" value={quota} 
      onChange={(e) => setQuota(e.target.value)}       
      InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}/>
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
      <div className=' AscCont'>
        <div className='row'>
          <div className='col-2'><h4 className='totAsc'>Totale Asc: {sum}</h4> </div>
          <div className='col-3'><h4 className='totAsc'>Totale Quota: {sumQ}€  </h4> </div>
        </div>
      </div>
    

      <div ref={componentRef} className='todo_containerScalet'>
      <div className='row'> 
      <p className='colTextTitle'> Scaletta</p>
      </div>
      <div className='row'>
      <div className='col-2' >
      <p className='coltext'>Cliente</p>
      </div>

      <div className='col-1' style={{padding: "0px"}}>
      <p className='coltext'>Debito</p>
      </div>
      <div className='col-1' style={{padding: "0px"}}>
      <p className='coltext'>Asc</p>
      </div>
      <div className='col-1' style={{padding: "0px"}}>
      <p className='coltext'>NCart</p>
      </div>
      <div className='col-1' style={{padding: "0px"}}>
      <p className='coltext'>Quota</p>
      </div>
      <div className='col' style={{padding: "0px"}}>
      <p className='coltext'>Note</p>
      </div>
      <div className="col"></div>
    </div>


    <div className="scrollDat">
 {/** tabella per visualizzare */}

        {todos.map((todo) => (
          <div key={todo.id}>
          {todo.dataScal === dateEli && ta === true &&(

          <Todo
            key={todo.id}
            todo={todo}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            flagStampa= {flagStampa}
          />
           )}
          </div>
        ))}
        </div>
        <hr style={{margin: "0"}}/>
      </div>


    </>
      )
}
export default Scalet;
