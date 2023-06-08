import React, { useEffect, useState } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, where, getDocs, orderBy, serverTimestamp} from 'firebase/firestore';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import TodoNotaDip from '../components/TodoNotaDip';
import { auth, db } from "../firebase-config";
import { ToastContainer, toast, Slide } from 'react-toastify';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import { notifyUpdateProd, notifyUpdateNota, notifyUpdateDebRes} from '../components/Notify';
import { supa, guid, tutti, flagStampa } from '../components/utenti';


function NotaDip({notaDipId, notaDipCont, notaDipNome, notaDipDataC }) {

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

    const [todos, setTodos] = React.useState([]);
    const [todosAddNot, setTodosAddNot] = React.useState([]);
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
    const [contPage, setContPage] = useState(notaDipCont);

    const timeElapsed = Date.now();  //prende la data attuale in millisecondi
    const today = new Date(timeElapsed);    //converte da millisecondi a data

    var FlagT=false;   //flag per le tinte, viene salvato nel database serve per far riconoscere ogni singola trupla
    const [flagStampa, setFlagStampa] = React.useState(false);  //quando è falso si vedono le icone,
   
    const [sumTot, setSumTot] =React.useState("");

    const matches = useMediaQuery('(max-width:920px)');  //media query true se è uno smartphone

    const [qtProdotto, setQtProdotto] = React.useState("1");
    const [prezzoUniProd, setprezzoUniProd] = React.useState("");
    const [prezzoTotProd, setprezzoTotProd] = React.useState("");

    let navigate = useNavigate();

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
    //array per la tabella prodotti
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

      //array di add nota
      React.useEffect(() => {
        const collectionRef = collection(db, "addNota");
        const q = query(collectionRef, orderBy("cont"));
        const unsub = onSnapshot(q, (querySnapshot) => {
          let todosArray = [];
          querySnapshot.forEach((doc) => {
            todosArray.push({ ...doc.data(), id: doc.id });
          });
          setTodosAddNot(todosArray);
        });
        localStorage.removeItem("OrdId");
        return () => unsub();
      }, []);

    //******************************************************************* */
    const handleAddContPage = async (cont) => {
      console.log({cont})
      if(cont) {
        setContPage(contPage+1);
      }

    }

    const handleRemoveContPage = async () => {
      setContPage(contPage-1);
      if(contPage<=1) {
        setContPage(1);
      }
    }

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
      <div className='navMobile row'>
      <div className='col-2'>

        <IconButton className="buttonArrow" aria-label="delete" sx={{ color: "#f6f6f6", marginTop: "7px" }}
        onClick={ ()=> {navigate("/notadipdata"); }}>
        <ArrowBackIcon sx={{ fontSize: 30 }}/>
      </IconButton>
      </div>
      <div className='col' style={{padding: 0}}>
      <p className='navText'> NoteDip </p>
      </div>
      </div>
  <div className='container' style={{padding: "0px"}}>

    {todosAddNot.map((todo) => (
    <div key={todo.id}>
    {todo.data == notaDipDataC && todo.cont == contPage &&  (
      <>
      <div className='row rigaNota mt-5' >
        <div className='col colNotaSini' style={{textAlign:"left", padding:"0px", paddingLeft:"0px"}}>
        <h5 style={{marginBottom:"0px", marginTop:"0px"}}> {todo.nomeC} </h5>
        </div>

        <div className='col'  style={{textAlign:"left", padding:"0px", marginLeft:"5px"}}>
        <h4 style={{marginBottom:"9px"}}> <b>N.</b> <span style={{marginRight:"10px"}}>{todo.cont}</span> <span style={{fontSize:"13px"}}><b>del</b></span> {todo.data} </h4>
    </div>
    </div>

    {/***********tabella aggiunta prodotto************************************************** */}
  <div className='row' style={{textAlign:"center", background:"#212529", color:"#f6f6f6"}}>
  <div className='col-1' style={{padding:"0px"}}></div>
    <div className='col-1' style={{padding:"0px"}}>Qt</div>
    <div className='col-9' style={{padding:"0px"}}>Prodotto</div>
  </div>

{/** tabella dei prodotti solo la lista */}
  <div className="scrollNota">
  {todos.map((todo1) => (
    <div key={todo1.id}>
    {todo1.nomeC  === todo.nomeC && todo1.dataC == todo.data &&  (
      <>
    { ta === true &&(
    <TodoNotaDip
      key={todo1.id}
      todo={todo1}
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

     </>
                  )}
  {matches &&
  <>
  <button type="button" className="skipPageLef" style={{padding: "0px"}} onClick={ () =>{handleRemoveContPage() }}>
        <KeyboardArrowLeftIcon sx={{ fontSize: 40 }} id="i" />
        </button>
  <button type="button" className="skipPageRi" style={{padding: "0px"}} onClick={ () =>{handleAddContPage(todo.cont) }}>
        <KeyboardArrowRightIcon sx={{ fontSize: 40 }} id="i" />
        </button>
        </>
  }


    </div>
  ))}

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

<div style={{marginTop:"15vh"}}></div>

    </div>
    </>
      )
}
export default NotaDip;