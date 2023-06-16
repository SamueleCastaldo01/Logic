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
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import Fade from '@mui/material/Fade';
import { notifyUpdateProd, notifyUpdateNota, notifyUpdateDebRes, notifyErrorNumCartoni} from '../components/Notify';
import { supa, guid, tutti, flagStampa } from '../components/utenti';


function NotaDip({notaDipId, notaDipCont, notaDipNome, notaDipDataC, numCart }) {

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

    const [todos, setTodos] = React.useState([]);
    const [todosAddNot, setTodosAddNot] = React.useState([]);
    const [NumCart, setNumCart] = React.useState(numCart);
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
    const [numeroPagineNota, setNumeroPagineNota] = useState("");

    const timeElapsed = Date.now();  //prende la data attuale in millisecondi
    const today = new Date(timeElapsed);    //converte da millisecondi a data

    var FlagT=false;   //flag per le tinte, viene salvato nel database serve per far riconoscere ogni singola trupla
    const [flagStampa, setFlagStampa] = React.useState(false);  //quando è falso si vedono le icone,
    const [checked, setChecked] = React.useState(false);
   
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
        handleNumeroDiNote();
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

  //************************************************************************************************* */
      const handleAddNumCart = async (id, nct) => {  //funzione aggiungere i cartoni
        var nuCut
        setNumCart(+NumCart+1);
        nuCut= +nct+1
        await updateDoc(doc(db, "addNota", id), { NumCartoni: nuCut});
      }
      
      const handleRemoveNumCart = async (id, nct) => {  //quando si preme il pulsante per rimuovere (numero di cartoni)
        var nuCut
        if(nct <= 0) {  //se il numero di cartoni è minore di 0 non fa nulla
          return
        }
        nuCut= +nct-1
        await updateDoc(doc(db, "addNota", id), { NumCartoni:nuCut});
      }

      const handleAddNumBuste = async (id, nct) => {  //funzione aggiungere i cartoni
        var nuCut
        setNumCart(+NumCart+1);
        nuCut= +nct+1
        await updateDoc(doc(db, "addNota", id), { NumBuste: nuCut});
      }
      
      const handleRemoveNumBuste = async (id, nct) => {  //quando si preme il pulsante per rimuovere (numero di cartoni)
        var nuCut
        if(nct <= 0) {  //se il numero di cartoni è minore di 0 non fa nulla
          return
        }
        nuCut= +nct-1
        await updateDoc(doc(db, "addNota", id), { NumBuste:nuCut});
      }

  //******************************************************************* */
     //funzioni per la conferma della nota e per il calcolo del prezzo dei prodotti, e mettere nella lista inOrdine
     const SommaTot = async (id, nomeC ) => {  //fa la somma totale, di tutti i prezzi totali
      var sommaTot=0;
      const q = query(collection(db, "Nota"), where("nomeC", "==", nomeC), where("dataC", "==", notaDipDataC),);  //prende i prodotti di quel cliente di quella data
      const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          sommaTot=+doc.data().prezzoTotProd +sommaTot;  //fa la somma Totale
          });
          var somTrunc = sommaTot.toFixed(2);
          setSumTot(somTrunc);
          await updateDoc(doc(db, "addNota", id), { sommaTotale:somTrunc});  //aggiorna la somma totale nell'add nota
    }

  const handleEditComp = async (id) => {  //aggiorna lo stato nel database che è stata completata la nota, oppure annullata, tramite il localStorage
    setTimeout(async function(){
      await updateDoc(doc(db, "addNota", id), { completa: localStorage.getItem("completa")});
    },50);
    
  };
  
  const handleConferma = async (id, nomeC, sommaTot, debitoRes, Nb, NCt) => {
    SommaTot(id, nomeC);  //va a fare la somma totale dei prodotti
    if (Nb==0 && NCt==0) {    //va a controllare il numero di cartoni, e compare la notifica che ci mancano il numero di cartoni
      notifyErrorNumCartoni();
      return;
    }
    if (Nb>0 || NCt>0){ //condizione tramite il numero di cartoni
    setCompleta(1);
    handleEditComp(id);
    handleInOrdine(nomeC);
    var debTot= +sommaTot+(+debitoRes);   // va a fare il calcolo del debito totale
    var debTrunc = debTot.toFixed(2);   //va a troncare il risultato del debito, per non avere problemi di visualizzazione
    await updateDoc(doc(db, "addNota", id), { debitoTotale:debTrunc});  //aggiorna la somma totale nell'add nota
        //aggiorna ded1 nel database debito
    const q = query(collection(db, "debito"), where("nomeC", "==", nomeC));
    const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (hi) => {
        await updateDoc(doc(db, "debito", hi.id), { deb1:debTrunc});  //aggiorna deb1 nel database del debito
        });
      }
        toast.clearWaitingQueue(); 
  };

  const handleInOrdine = async (nomeC) => {  //Inserisce una nuova trupa nella tabella in ordine quando viene confermata la nota    si attiva quando premo il pulsante conferma
    //query per prendere tutti i prodotti di quel cliente in quella data che ha il simbolo (NO), per poi metterli nel database InOrdine
    const q = query(collection(db, "Nota"),where("nomeC", "==", nomeC), where("dataC", "==", notaDipDataC), where("simbolo", "==", "(NO)"));  //prende i prodotti di quel cliente di quella data che ha il simbolo (NO)
    const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await addDoc(collection(db, "inOrdine"), {   //va a creare la nuova trupla nella tabella inOrdine
          nomeC: nomeC,
          dataC: notaDipDataC,
          qtProdotto: doc.data().qtProdotto,
          prodottoC: doc.data().prodottoC,
        });
        });
  }

  const handleInOrdineRemove = async (nomeC) => {  //Va ad eliminare i prodotti da InOrdine, quando viene annullata la conferma    si attiva quando premo il pulsante annulla conferma
    //Devo andare a prendere tutti i proddotti nella tabella inOrdine dello stesso cliente e della stessa data e devo eliminare tutti i prodotti
    const q = query(collection(db, "inOrdine"),where("nomeC", "==", nomeC), where("dataC", "==", notaDipDataC));  //prende i prodotti di quel cliente di quella data che ha il simbolo (NO)
    const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (hi) => {
        await deleteDoc(doc(db, "inOrdine", hi.id)); //elimina tutti i prodotti di quel cliente con quella data  quando viene annullata la conferma 
        });
  }

  //************************************************************************************************* */
  const handleNumeroDiNote = async () => {   //funzione che mi permette di prendere il numero di note di quelle data
    const q = query(collection(db, "ordDat"), where("data", "==", notaDipDataC));  
    const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setNumeroPagineNota(doc.data().numeroNote);
      })
  } 
  
  const handleAddContPage = async () => {
    setTimeout(function(){
      setContPage(contPage+1);
    },50);
        
    }

    const handleRemoveContPage = async () => {
      setTimeout(function(){
        setContPage(contPage-1);
        if(contPage<=1) {
          setContPage(1);
        }
      },50);
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
    {/**************NAVBAR MOBILE*************************************** */}
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


  <div className='container' style={{paddingLeft: "24px", paddingRight: "24px"}}>
    {todosAddNot.map((todo) => (
    <div key={todo.id}>
    {todo.data == notaDipDataC && todo.cont == contPage &&  (
      <>
      <hr className='hrNotDip' style={{borderTop: todo.completa==1 ? "6px solid green" : "6px solid red"}}></hr>
      <div className='row' style={{marginTop: "40px"}} >
        <div className='col colNotaSini' style={{textAlign:"left", padding:"0px", paddingLeft:"0px"}}>
        <h5 className='titleNotaDip' style={{marginBottom:"0px", marginTop:"0px"}}> {todo.nomeC} </h5>
        </div>

        <div className='col'  style={{textAlign:"left", padding:"0px", marginLeft:"5px"}}>
        <h4 className='titleNotaDip' style={{marginBottom:"9px"}}> <b>N.</b> <span style={{marginRight:"10px"}}>{todo.cont}</span> <span style={{fontSize:"13px"}}><b>del</b></span> {todo.data} </h4>
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
      Completa={todo.completa}
      SommaTot={SommaTot}
    />
     )}
     </>
                  )}
    </div>
  ))}
  </div>

{/****numero cartoni e numero buste************************************************************ */}
  <div className='row'>
    <div className='col' style={{textAlign:"left", padding:"0px"}}>
    
    <div className='row'>

      <div className='col-4' style={{paddingRight: "0px", width:"100px"}}>
      <h6 style={{marginTop: "12px"}}><b>N.</b> CT. = <span> {todo.NumCartoni} </span> </h6>
      <h6 style={{marginTop: "20px"}}><b>N.</b> B.&nbsp;&nbsp; = <span> {todo.NumBuste} </span> </h6>
      </div>

      <div className='col-3' style={{padding: "0px", paddingRight:"2px",  width:"197px"}}>
      {todo.completa == 0 && flagStampa ==false &&
      <span>
        <button className="button-rem" style={{padding: "0px"}} onClick={ ()=> {handleRemoveNumCart(todo.id, todo.NumCartoni)}}> - </button>
        <button className="button-add" style={{padding: "0px"}} onClick={()=> {handleAddNumCart(todo.id, todo.NumCartoni)}}> + </button>
      </span> }
      {todo.completa == 0 && flagStampa ==false &&
        <>
        <button className="button-rem" style={{padding: "0px"}} onClick={ ()=> {handleRemoveNumBuste(todo.id, todo.NumBuste)}}> - </button>
        <button className="button-add" style={{padding: "0px"}} onClick={()=> {handleAddNumBuste(todo.id, todo.NumBuste)}}> + </button>
        </>
   }
      </div>
    </div>
       </div>
  </div>

  {/*******************Conferma la nota  (completa)*************************************************************** */}

  {flagStampa == false && <>
  {todo.completa == 0 ?  
    <button className='button-comp' onClick={ ()=> {
    localStorage.setItem("completa", 1);
     handleConferma(todo.id, todo.nomeC, todo.sommaTotale, todo.debitoRes, todo.NumBuste, todo.NumCartoni); }}><CheckIcon sx={{ fontSize: 48 }}  /> conferma</button> :
    <button className='button-clear' onClick={ ()=> {
      localStorage.setItem("completa", 0);
       setCompleta(0);
       handleEditComp(todo.id);
       handleInOrdineRemove(todo.nomeC)  }}><ClearIcon sx={{ fontSize: 29 }}/>  Annulla Conferma</button>
     }
  </>}
  {/*******************Tasti per passare da una nota ad un altra*************************************************************** */}
  {todo.cont > 1 &&
    <button type="button" className="skipPageLef" style={{padding: "0px"}} onClick={ () =>{ handleRemoveContPage() }}>
        <KeyboardArrowLeftIcon sx={{ fontSize: 40 }} id="i" />
        </button>
  }
  {todo.cont < numeroPagineNota &&
    <button type="button" className="skipPageRi" style={{padding: "0px"}} onClick={ () =>{handleAddContPage() }}>
        <KeyboardArrowRightIcon sx={{ fontSize: 40 }} id="i" />
        </button>
  }

     </>
                  )}

    </div>
  ))}

<div style={{marginTop:"15vh"}}></div>

    </div>
    </>
      )
}
export default NotaDip;