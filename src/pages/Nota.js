import React, { useEffect, useState } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, where, getDocs, orderBy, serverTimestamp} from 'firebase/firestore';
import { useRef } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';
import TodoNota from '../components/TodoNota';
import { getCountFromServer } from 'firebase/firestore';
import { TextField } from '@mui/material';
import { auth, db } from "../firebase-config";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Todo from '../components/Todo';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { notifyUpdateProd, notifyUpdateNota, notifyUpdateDebRes} from '../components/Notify';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import { supa, guid, tutti, flagStampa } from '../components/utenti';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import { AutoProdCli } from "../pages/AddNota";


function Nota({notaId, cont, nomeCli, dataNota, dataNotaC, numCart, prezzoTotNota, debit, debTo }) {

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

    const [todos, setTodos] = React.useState([]);
    const [indirizzoC, setIndirizzoC] = React.useState("");
    const [partitaIvaC, setPartitaIvaC] = React.useState("");
    const [cellulareC, setCellulareC] = React.useState("");
    const [prodottoC, setProdottoC] = React.useState("");

    const [flagStampa, setFlagStampa] = React.useState(false);  //quando è falso si vedono le icone,
    const [prova, setProva] = React.useState("");
    const [NumCart, setNumCart] = React.useState(numCart);
   
    const [sumTot, setSumTot] =React.useState("");
    const [debitoTot, setDebTot] = React.useState(debTo);
    const [debitoRes, setDebitoRes] = React.useState(debit);



    const [qtProdotto, setQtProdotto] = React.useState("1");
    const [prezzoUniProd, setprezzoUniProd] = React.useState("");
    const [prezzoTotProd, setprezzoTotProd] = React.useState("");

    const componentRef = useRef();  //serve per la stampa
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
          handleDelete(localStorage.getItem("IDNOTa"));
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
//_________________________________________________________________________________________________________________
const SomAsc = async () => {
  var sommaTot=0;
  const q = query(collection(db, "Nota"), where("nomeC", "==", nomeCli), where("dataC", "==", dataNotaC));
  const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "heeey", " => ", doc.data().nomeC, doc.data().dataC, doc.data().prezzoUniProd);
      sommaTot=+doc.data().prezzoTotProd +sommaTot;
      });
      setSumTot(sommaTot);
      await updateDoc(doc(db, "addNota", notaId), { sommaTotale:sommaTot});  //aggiorna la somma totale nell'add nota
}
//********************************************************************************** */
    const cliEffect = async () => {  //funzione per l'anagrafica del cliente
      const collectionRef = collection(db, "clin");
        //aggiorna il contatore di tutti i dati di addNota della stessa data
        const q = query(collectionRef, where("nomeC", "==", nomeCli));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (hi) => {
          setIndirizzoC(hi.data().indirizzo);
          setPartitaIvaC(hi.data().partitaIva);
          setCellulareC(hi.data().cellulare);
        });
        
    }
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
        cliEffect();
        SomAsc();
        localStorage.removeItem("NotaId");
        return () => unsub();
      }, []);

//********************************************************************************** */
const createCate = async (e) => {
  e.preventDefault(); 
  await addDoc(collection(db, "Nota"), {
    dataC: dataNotaC,
    nomeC: nomeCli,
    qtProdotto,
    prodottoC,
    prezzoUniProd,
    prezzoTotProd,
    createdAt: serverTimestamp(),
  });
  setQtProdotto("1");
  setProdottoC("");
  setprezzoTotProd("");
  setprezzoUniProd("");
  SomAsc();
};
//_________________________________________________________________________________________________________________
const handleEdit = async ( todo, qt, prod, prezU, prezT) => {
  var preT= qt*prezU;
  await updateDoc(doc(db, "Nota", todo.id), { qtProdotto: qt, prodottoC:prod, prezzoUniProd:prezU, prezzoTotProd:preT});
  SomAsc();
  notifyUpdateProd();
  toast.clearWaitingQueue(); 
};
//_________________________________________________________________________________________________________________
const handleEditNumCart = async (e) => {
  e.preventDefault();
  await updateDoc(doc(db, "addNota", notaId), { NumCartoni:NumCart});
  notifyUpdateProd();
  toast.clearWaitingQueue(); 
};

const handleEditDebitoRes = async (e) => {
  e.preventDefault();
  await updateDoc(doc(db, "addNota", notaId), { debitoRes:debitoRes});
  notifyUpdateDebRes();
  toast.clearWaitingQueue(); 
};

const handleConferma = async (e) => {
  e.preventDefault();
  var debTot= +sumTot+(+debitoRes);
  setDebTot(debTot);
  await updateDoc(doc(db, "addNota", notaId), { debitoTotale:debTot});  //aggiorna la somma totale nell'add nota
      //aggiorna ded1 nel database debito
  const q = query(collection(db, "debito"), where("nomeC", "==", nomeCli));
  const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (hi) => {
      await updateDoc(doc(db, "debito", hi.id), { deb1:debTot});  //aggiorna deb1 nel database del debito
      });
  notifyUpdateNota();
  toast.clearWaitingQueue(); 
};
//_________________________________________________________________________________________________________________
const handleDelete = async (id) => {
  const colDoc = doc(db, "Nota", id); 
  //infine elimina la data
  await deleteDoc(colDoc); 
  SomAsc();
};
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
    <div className="container wrapper" >
    <div><ToastContainer limit={1} /></div>
    <h1 className='title'>Nota</h1>
    <span><button onClick={print}>Stampa </button></span>
    <span><button onClick={createCate}>Aggiungi Prodotto</button></span>
    
    <div ref={componentRef} className="foglioA4" style={{paddingLeft:"50px", paddingRight:"50px", paddingTop:"20px"}}>
    <div className='row rigaNota' >
        <div className='col colNotaSini' style={{textAlign:"left", padding:"0px", paddingLeft:"0px"}}>
        <h6 style={{fontSize:"9px"}}>MITTENTE: Ditta, Domicilio o Residenza, Codice Fiscale, Partita IVA</h6>
        <h5 style={{marginBottom:"0px", marginTop:"10px"}}>LIGUORI  <span style={{fontSize:"0.6em", marginRight:"10px"}} >s.r.l </span> <span style={{fontSize:"0.6em"}} > u.p.</span> </h5>
        <h5 className='sinistraNota'>Sede legale e deposito merci:</h5>
        <h5 className='sinistraNota'>Via F. Caracciolo 18</h5>
        <h5 className='sinistraNota'>80023 Caivano (NA)</h5>
        <h5 className='sinistraNota'>Cod.Fisc. e Partita IVA n.08319431212</h5>
        <h6 className='sinistraNota6'>R.I. 08319431212</h6>
        <h6 className='sinistraNota6'>R.E.A. NA 948532</h6>
        <h6 className='sinistraNota6' style={{marginBottom:"5px"}}>Cap.Soc. €10.000,00 I.V.</h6>
        </div>

        <div className='col'  style={{textAlign:"left", padding:"0px", marginLeft:"5px"}}>
        <h3  style={{marginBottom:"-5px", fontSize:"24.5px"}}><b>DOCUMENTO DI TRASPORTO</b></h3>
        <h4 style={{marginBottom:"9px"}}><b>(D.d.t.)</b></h4>
        <h4 style={{marginBottom:"9px"}}> <b>N.</b> <span style={{marginRight:"10px"}}>{cont}</span> <span style={{fontSize:"13px"}}><b>del</b></span> {moment(dataNota.toDate()).format("L")} </h4>

    <div class="form-check form-check-inline"  style={{padding:"0px", fontSize:"13px"}}>a mezzo: &nbsp; &nbsp;
    <input id="checkbox3" type="checkbox" checked="checked"/>
      <label for="checkbox3">&nbsp;mittente</label>
    </div>
    </div>
    </div>

    <div className='row rigaNota'>
    <div className='col colNotaSini'style={{textAlign:"left", padding:"0px", paddingLeft:"0px"}}>
    <h6 style={{fontSize:"9px"}}>DESTINATARIO: Ditta, Codice Fiscale, Partita IVA</h6>
      <div className='row'>
      <h5 style={{marginBottom:"0px", marginTop:"0px"}}>{nomeCli} </h5>
        <h5 className='sinistraNota'>{indirizzoC}</h5>
        <h5 className='sinistraNota'>Tel {cellulareC}</h5>
        <h5 className='sinistraNota'  style={{marginBottom:"5px"}}>Cod.Fisc. e Partita IVA n.{partitaIvaC}</h5>
      </div>
    </div>

      <div className='col'  style={{textAlign:"left", padding:"0px", marginLeft:"5px"}}>
      <h6 style={{fontSize:"9px"}}>LUOGO DI DESTINAZIONE</h6>
      </div>
    </div>
{/***********tabella aggiunta prodotto************************************************** */}
  <div className='row' style={{textAlign:"center", background:"#212529", color:"#f6f6f6"}}>
    <div className='col-1' style={{padding:"0px"}}>Qt</div>
    <div className='col-6' style={{padding:"0px"}}>Prodotto</div>
    <div className='col-2' style={{padding:"0px"}}>Prezzo Uni</div>
    <div className='col-2' style={{padding:"0px"}}>Prezzo Totale</div>
  </div>

{/** tabella dei prodotti */}
  <div className="scroll">
  {todos.map((todo) => (
    <div key={todo.id}>
    {todo.nomeC  === nomeCli && todo.dataC == dataNotaC &&  (
      <>
    { ta === true &&(
    <TodoNota
      key={todo.id}
      todo={todo}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      displayMsg={displayMsg}
      nomeCli={nomeCli}
      flagStampa={flagStampa}
    />
     )}
     </>
                  )}
    </div>
  ))}
  </div>

  <div className='row'>
    <div className='col' style={{textAlign:"left", padding:"0px"}}>
    <form onSubmit={handleEditNumCart}>
     Numero Cartoni:  <input
       style={{textAlign:"center", padding: "0px", width:"50px"}}
        type="text"
        value={NumCart}
        className="inpTab"
        onChange={(event) => {
          setNumCart(event.target.value);}}
      />
      <button hidden type='submit' onClick={handleEditNumCart}>Aggiorna</button>
    </form>
       </div>

    <div className='col' style={{textAlign:"right", padding:"0px"}}>
    <h6>Totale: {sumTot} €</h6>
    <form onSubmit={handleEditDebitoRes}>
    <h6>Debito Residuo:     <input value={debitoRes} style={{textAlign:"center", padding: "0px", width:"50px"}} 
      onChange={(event) => {
      setDebitoRes(event.target.value);}}
    />  €</h6>
    <button hidden type='submit' onClick={handleEditDebitoRes}>Aggiorna</button>
    </form>
    <h6>Debito Totale: {debitoTot} €</h6>
    <button onClick={handleConferma}>Conferma</button>
    </div>

  </div>

    </div>


    </div>
    </>
      )
}
export default Nota;