import React, { useEffect, useState } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, where, getDocs, orderBy, serverTimestamp} from 'firebase/firestore';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import TodoNota from '../components/TodoNota';
import { auth, db } from "../firebase-config";
import { ToastContainer, toast, Slide } from 'react-toastify';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { notifyUpdateProd, notifyUpdateNota, notifyUpdateDebRes} from '../components/Notify';
import { supa, guid, tutti, flagStampa } from '../components/utenti';
import { fontSize } from '@mui/system';


function Nota({notaId, cont, nomeCli, dataNota, dataNotaC, numCart, prezzoTotNota, debit, debTo, indirizzo, tel, iva, completa }) {

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

    const timeElapsed = Date.now();  //prende la data attuale in millisecondi
    const today = new Date(timeElapsed);    //converte da millisecondi a data

    var FlagT=false;   //flag per le tinte, viene salvato nel database serve per far riconoscere ogni singola trupla
    const [flagStampa, setFlagStampa] = React.useState(false);  //quando è falso si vedono le icone,
    const [NumCart, setNumCart] = React.useState(numCart);
    const [Completa, setCompleta] = useState(completa);
   
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
const SommaTot = async () => {  //fa la somma totale, di tutti i prezzi totali
  var sommaTot=0;
  const q = query(collection(db, "Nota"), where("nomeC", "==", nomeCli), where("dataC", "==", dataNotaC));  //prende i prodotti di quel cliente di quella data
  const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
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
        SommaTot();
        localStorage.removeItem("NotaId");
        return () => unsub();
      }, []);
//********************************************************************************** */
const createCate = async () => {

  await addDoc(collection(db, "Nota"), {
    dataC: dataNotaC,
    nomeC: nomeCli,
    qtProdotto,
    prodottoC,
    complete: false,
    t1,
    t2,
    t3,
    t4,
    t5,
    nomTin,
    flagTinte: FlagT,
    prezzoUniProd,
    prezzoTotProd,
    createdAt: serverTimestamp(),
  });
  setQtProdotto("1");
  setProdottoC("");
  setnomTin("");
  setprezzoTotProd("");
  setprezzoUniProd("");
  SommaTot();
};
//_________________________________________________________________________________________________________________
const handleEdit = async ( todo, qt, prod, prezU, prezT, tt1, tt2, tt3, tt4, tt5, nomTinte) => {
  var conTinte=0;    //alogoritmo per le tinte
  if(tt1) {conTinte=conTinte+1}
  if(tt2) {conTinte=conTinte+1}
  if(tt3) {conTinte=conTinte+1}
  if(tt4) {conTinte=conTinte+1}
  if(tt5) {conTinte=conTinte+1}
  if(!nomTinte){ 
    nomTinte=""
  conTinte=1 }
  var preT= (conTinte*qt)*prezU;
  await updateDoc(doc(db, "Nota", todo.id), 
  { qtProdotto: qt, prodottoC:prod, prezzoUniProd:prezU, prezzoTotProd:preT, t1:tt1, t2:tt2, t3:tt3, t4:tt4, t5:tt5, nomeTinte:nomTinte});
  SommaTot();
  toast.clearWaitingQueue(); 
};
//_________________________________________________________________________________________________________________
const handleAddNumCart = async (e) => {  //funzione aggiungere i cartoni
  var nuCut
  e.preventDefault();
  setNumCart(+NumCart+1);
  nuCut=+NumCart+1
  await updateDoc(doc(db, "addNota", notaId), { NumCartoni: nuCut});
}

const handleRemoveNumCart = async (e) => {  //quando si preme il pulsante per rimuovere (numero di cartoni)
  var nuCut
  e.preventDefault();
  if(NumCart <= 0) {  //se il numero di cartoni è minore di 0 non fa nulla
    return
  }
  setNumCart(+NumCart-1);
  nuCut= +NumCart-1
  await updateDoc(doc(db, "addNota", notaId), { NumCartoni:nuCut});
}

const handleEditComp = async (e) => {
  await updateDoc(doc(db, "addNota", notaId), { completa: localStorage.getItem("completa")});
};

const handleEditDebitoRes = async (e) => {
  e.preventDefault();
  await updateDoc(doc(db, "addNota", notaId), { debitoRes:debitoRes});
  notifyUpdateDebRes();
  toast.clearWaitingQueue(); 
};

const handleConferma = async () => {
  var debTot= +sumTot+(+debitoRes);
  setDebTot(debTot);
  await updateDoc(doc(db, "addNota", notaId), { debitoTotale:debTot});  //aggiorna la somma totale nell'add nota
      //aggiorna ded1 nel database debito
  const q = query(collection(db, "debito"), where("nomeC", "==", nomeCli));
  const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (hi) => {
      await updateDoc(doc(db, "debito", hi.id), { deb1:debTot});  //aggiorna deb1 nel database del debito
      });
      toast.clearWaitingQueue(); 
};
//_________________________________________________________________________________________________________________
const handleDelete = async (id) => {
  const colDoc = doc(db, "Nota", id); 
  //infine elimina la data
  await deleteDoc(colDoc); 
  SommaTot();
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
    <h1 className='title mt-3'>Nota</h1>

    <span><button onClick={print}>Stampa </button></span>

      {Completa==0 && 
      <>
      <span><button onClick={() => {
       FlagT=false
        createCate()
      }}>Aggiungi Prodotto</button></span>
    <span><button onClick={() => {
      FlagT=true
      createCate()
    }}>Aggiungi Tinte</button></span>
      </>}

    <div>
    {Completa==0 ? 
      <button type="button" className="button-delete" style={{padding: "0px", float: "left"}}>
        <BeenhereIcon sx={{ fontSize: 40 }}/>
        </button> :
        <button type="button" className="button-complete" style={{padding: "0px", float: "left"}}>
        <BeenhereIcon sx={{ fontSize: 40 }}/>
        </button>
        }

    </div>


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
        <h3  style={{marginBottom:"-5px", fontSize:"22.5px"}}><b>DOCUMENTO DI TRASPORTO</b></h3>
        <h4 style={{marginBottom:"9px"}}><b>(D.d.t.)</b> <span style={{fontSize:"0.4em", marginRight:"10px"}}>&emsp;&ensp; D.P.R. 472 del 14-08-1996-D.P.R 696 del 21.12.1996 </span></h4>
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
      <h5 style={{marginBottom:"0px", marginTop:"0px"}}> {nomeCli} </h5>
        <h5 className='sinistraNota'>{indirizzo}</h5>
        <h5 className='sinistraNota'>Tel {tel}</h5>
        <h5 className='sinistraNota'  style={{marginBottom:"5px"}}>Cod.Fisc. e Partita IVA n.{iva}</h5>
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
  <div className="scrollNota">
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
      Completa={Completa}
    />
     )}
     </>
                  )}
    </div>
  ))}
  </div>

  <div className='row'>
    <div className='col' style={{textAlign:"left", padding:"0px"}}>
    <h6 className='mt-2'>Numero Cartoni: <span> {NumCart} </span> 
    {Completa == 0 && flagStampa ==false &&
      <span>
        <button className="button-complete" style={{padding: "0px"}} onClick={handleAddNumCart}> <AddCircleIcon sx={{ fontSize: 35 }}/> </button>
        <button className="button-delete" style={{padding: "0px"}} onClick={handleRemoveNumCart}> <RemoveCircleIcon sx={{ fontSize: 35 }}/> </button>
      </span> }
    </h6> 
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
    {flagStampa == false && <>
  {Completa==0 ?  <button onClick={ ()=> {localStorage.setItem("completa", 1); setCompleta(1);  handleEditComp();  handleConferma()}}>Conferma</button> :
    <button onClick={ ()=> {localStorage.setItem("completa", 0); setCompleta(0); handleEditComp(); }}>Annulla Conferma</button>
     }
  </>}

    
    </div>

  </div>

    </div>
    </>
      )
}
export default Nota;