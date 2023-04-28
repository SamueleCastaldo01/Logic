import React, { useEffect, useState } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, where, getDocs, orderBy, serverTimestamp} from 'firebase/firestore';
import { useRef } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';
import TodoNota from '../components/TodoNota';
import TodoNotaForni from '../components/TodoNotaForni';
import { getCountFromServer } from 'firebase/firestore';
import { TextField } from '@mui/material';
import { auth, db } from "../firebase-config";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { notifyUpdateProd, notifyUpdateNota, notifyUpdateDebRes} from '../components/Notify';

import { supa, guid, tutti, flagStampa } from '../components/utenti';



function NotaForni({notaId, nomeForni, dataNota, dataNotaC }) {

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

    const [todos, setTodos] = React.useState([]);

    const [prodottoC, setProdottoC] = React.useState("");


    var FlagT=false;   //flag per le tinte, viene salvato nel database serve per far riconoscere ogni singola trupla
    const [flagStampa, setFlagStampa] = React.useState(false);  //quando è falso si vedono le icone,
   
    const [sumTot, setSumTot] =React.useState("");

    const [quantita, setquantita] = React.useState("1");

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
  const q = query(collection(db, "Nota"), where("nomeC", "==", nomeForni), where("dataC", "==", dataNotaC));
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
        const q = query(collectionRef, where("nomeC", "==", nomeForni));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (hi) => {
        });
        
    }
//********************************************************************************** */
  
     React.useEffect(() => {
        const collectionRef = collection(db, "notaForni");
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
        localStorage.removeItem("NotaForniId");
        return () => unsub();
      }, []);
//********************************************************************************** */

const createCate = async () => {

  await addDoc(collection(db, "notaForni"), {
    data: dataNotaC,
    nomeF: nomeForni,
    nomeP: "",
    quantita: 1,
    createdAt: serverTimestamp(),
  });
};
//_________________________________________________________________________________________________________________
const handleEdit = async ( todo, qt, prod) => {
  await updateDoc(doc(db, "notaForni", todo.id), 
  { quantita: qt, nomeP: prod});
  notifyUpdateProd();
  toast.clearWaitingQueue(); 
};
//_________________________________________________________________________________________________________________
const handleDelete = async (id) => {
  const colDoc = doc(db, "notaForni", id); 
  //infine elimina la data
  await deleteDoc(colDoc); 
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

    <div><ToastContainer limit={1} /></div>
    <h1 className='title mt-3'>Nota Fornitore</h1>
    <span><button onClick={print}>Stampa </button></span>
      <span><button onClick={() => {
       FlagT=false
       console.log({FlagT})
        createCate()
      }}>Aggiungi Prodotto</button></span>
    
    <div ref={componentRef} className="foglioA4" style={{paddingLeft:"50px", paddingRight:"50px", paddingTop:"20px"}}>
    <div className='row rigaNota' >
        <div className='col colNotaSini' style={{textAlign:"left", padding:"0px", paddingLeft:"0px"}}>
            <h3 className='mb-4'>{nomeForni} </h3>
            
        </div>

        <div className='col'  style={{textAlign:"left", padding:"0px", marginLeft:"5px"}}>
        <h4>Data: {dataNotaC} </h4>
    </div>
    </div>

    <div className='row rigaNota'>

    </div>
{/***********tabella visuallizza prodotto************************************************** */}
  <div className='row' style={{textAlign:"center", background:"#212529", color:"#f6f6f6"}}>
    <div className='col-1' style={{padding:"0px"}}>Qt</div>
    <div className='col-6' style={{padding:"0px"}}>Prodotto</div>
  </div>

{/** tabella dei prodotti */}
  <div className="scroll">
  {todos.map((todo) => (
    <div key={todo.id}>
    {todo.nomeF  === nomeForni && todo.data == dataNotaC &&  (
      <>
    { ta === true &&(
    <TodoNotaForni
      key={todo.id}
      todo={todo}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      displayMsg={displayMsg}
      nomeForni={nomeForni}
      flagStampa={flagStampa}
    />
     )}
     </>
                  )}
    </div>
  ))}
  </div>

    </div>
    </>
      )
}
export default NotaForni;