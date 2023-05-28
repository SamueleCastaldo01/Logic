import React, { useEffect, useState } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, where, getDocs, orderBy, serverTimestamp} from 'firebase/firestore';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import TodoNotaDip from '../components/TodoNota';
import { auth, db } from "../firebase-config";
import { ToastContainer, toast, Slide } from 'react-toastify';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { notifyUpdateProd, notifyUpdateNota, notifyUpdateDebRes} from '../components/Notify';
import { supa, guid, tutti, flagStampa } from '../components/utenti';
import { fontSize } from '@mui/system';


function NotaDip({notaDipId, notaDipCont, notaDipNome, notaDipDataC }) {

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

    const [todos, setTodos] = React.useState([]);
    const [indirizzoC, setIndirizzoC] = React.useState("");
    const [partitaIvaC, setPartitaIvaC] = React.useState("");
    const [cellulareC, setCellulareC] = React.useState("");
    const [prodottoC, setProdottoC] = React.useState("");
    const [t1, setT1] = React.useState("");   //tinte, che dentro una trupla ci possono essere massimo 5
    const [t2, setT2] = React.useState("");
    const [t3, setT3] = React.useState("");
    const [t4, setT4] = React.useState("");
    const [t5, setT5] = React.useState("");
    const [nomTin, setnomTin] = React.useState("");
    const [Completa, setCompleta] = useState(0);

    const timeElapsed = Date.now();  //prende la data attuale in millisecondi
    const today = new Date(timeElapsed);    //converte da millisecondi a data

    var FlagT=false;   //flag per le tinte, viene salvato nel database serve per far riconoscere ogni singola trupla
    const [flagStampa, setFlagStampa] = React.useState(false);  //quando è falso si vedono le icone,
   
    const [sumTot, setSumTot] =React.useState("");

    const [qtProdotto, setQtProdotto] = React.useState("1");
    const [prezzoUniProd, setprezzoUniProd] = React.useState("");
    const [prezzoTotProd, setprezzoTotProd] = React.useState("");

    const componentRef = useRef();  //serve per la stampa
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
        const collectionRef = collection(db, "Nota");
        const q = query(collectionRef, orderBy("createdAt"));
        const unsub = onSnapshot(q, (querySnapshot) => {
          let todosArray = [];
          querySnapshot.forEach((doc) => {
            todosArray.push({ ...doc.data(), id: doc.id });
          });
          setTodos(todosArray);
        });
        localStorage.removeItem("NotaDipId");
        return () => unsub();
      }, []);

//_________________________________________________________________________________________________________________
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
//*************************************************************** */
//************************************************************** */
//          INTERFACE                                             /
//************************************************************** */
    return (  
        <>
    <h1 className='title mt-3'>NotaDip</h1>

    <div className='container'>
    <div className='row rigaNota' >
        <div className='col colNotaSini' style={{textAlign:"left", padding:"0px", paddingLeft:"0px"}}>
        <h5 style={{marginBottom:"0px", marginTop:"0px"}}> {notaDipNome} </h5>
        </div>

        <div className='col'  style={{textAlign:"left", padding:"0px", marginLeft:"5px"}}>
        <h4 style={{marginBottom:"9px"}}> <b>N.</b> <span style={{marginRight:"10px"}}>{notaDipCont}</span> <span style={{fontSize:"13px"}}><b>del</b></span> {notaDipDataC} </h4>
    </div>
    </div>
{/***********tabella aggiunta prodotto************************************************** */}
  <div className='row' style={{textAlign:"center", background:"#212529", color:"#f6f6f6"}}>
    <div className='col-1' style={{padding:"0px"}}>Qt</div>
    <div className='col-6' style={{padding:"0px"}}>Prodotto</div>
  </div>

{/** tabella dei prodotti */}
  <div className="scrollNota">
  {todos.map((todo) => (
    <div key={todo.id}>
    {todo.nomeC  === notaDipNome && todo.dataC == notaDipDataC &&  (
      <>
    { ta === true &&(
    <TodoNotaDip
      key={todo.id}
      todo={todo}
      handleDelete={""}
      handleEdit={""}
      displayMsg={displayMsg}
      nomeCli={notaDipNome}
      flagStampa={flagStampa}
      Completa={""}
    />
     )}
     </>
                  )}
    </div>
  ))}
  </div>

  <div className='row'>
    <div className='col' style={{textAlign:"left", padding:"0px"}}>
    <h6 className='mt-2'>Numero Cartoni: <span> Bho </span> 
    {Completa == 0 && flagStampa ==false &&
      <span>
        <button className="button-complete" style={{padding: "0px"}} onClick={""}> <AddCircleIcon sx={{ fontSize: 35 }}/> </button>
        <button className="button-delete" style={{padding: "0px"}} onClick={""}> <RemoveCircleIcon sx={{ fontSize: 35 }}/> </button>
      </span> }
    </h6> 
       </div>

    <div className='col' style={{textAlign:"right", padding:"0px"}}>
    {flagStampa == false && <>
  {Completa==0 ?  <button onClick={ ()=> {localStorage.setItem("completa", 1); setCompleta(1); }}>Conferma</button> :
    <button onClick={ ()=> {localStorage.setItem("completa", 0); setCompleta(0);  }}>Annulla Conferma</button>
     }
  </>}

    
    </div>

  </div>

    </div>
    </>
      )
}
export default NotaDip;