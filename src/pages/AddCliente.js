import React, { useEffect, useState, useRef } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, orderBy, where, getDocs} from 'firebase/firestore';
import TextField from '@mui/material/TextField';
import { Input } from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from "../firebase-config";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { notifyErrorCliEm, notifyUpdateCli, notifyErrorCliList } from '../components/Notify';
import CloseIcon from '@mui/icons-material/Close';
import TodoClient from '../components/TodoClient';
import Button from '@mui/material/Button';
import { supa } from '../components/utenti';
import { guid } from '../components/utenti';
import { tutti } from '../components/utenti';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { usePlacesWidget } from "react-google-autocomplete";

const GOOGLE_MAPS_API_KEY = 'AIzaSyAygsHvhG251qZ7-N9oR8A-q1ls9yhNkOQ';

function AddCliente( {getCliId} ) {

  const [todos, setTodos] = React.useState([]);
  const [indirizzo, setIndirizzo] = React.useState("");
  const [indirizzoLink, setIndirizzoLink] = React.useState("");
  const [nomeC, setNomeC] = React.useState("");
  const [partitaIva, setPartitaIva] = React.useState("");
  const [cellulare, setCellulare] = React.useState("");
  const [debito, setDebito] = React.useState("");

  const [popupActive, setPopupActive] = useState(false);  

  //permessi utente
  let sup= supa.includes(localStorage.getItem("uid"))
  let gui= guid.includes(localStorage.getItem("uid"))
  let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

  let navigate = useNavigate();
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
          handleDelete(localStorage.getItem("IDscal") );
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
    const collectionRef = collection(db, "clin");
    const q = query(collectionRef, orderBy("nomeC"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
    });
    return () => unsub();

  }, []);

 //******************************************************************************* */
  const handleSubmit = async (e) => {   //creazione cliente
    e.preventDefault();
    var bol= true
    if(!nomeC) {            
      notifyErrorCliEm();
      toast.clearWaitingQueue(); 
      return 
    }
    const q = query(collection(db, "clin"), where("nomeC", "==", nomeC));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data().nomeC);
    if (doc.data().nomeC == nomeC) {
        notifyErrorCliList()
         toast.clearWaitingQueue(); 
        bol=false
    }
    });
    if(bol == true) {
      await addDoc(collection(db, "clin"), {
        nomeC,
        indirizzo,
        indirizzoLink: "https://www.google.com/maps/search/?api=1&query="+indirizzo,
        partitaIva,
        cellulare,
        debito
      });
      setNomeC("");
      setIndirizzo("");
      setIndirizzoLink("");
      setPartitaIva("");
      setCellulare("");
      setDebito("");
    }
  };
//****************************************************************************************** */
  const handleEdit = async ( todo, nome, iv, cel, deb) => {
    await updateDoc(doc(db, "clin", todo.id), { nomeC: nome, partitaIva:iv, cellulare:cel, debito:deb});
    notifyUpdateCli();
    toast.clearWaitingQueue(); 
  };
  const handleDelete = async (id) => {
    const colDoc = doc(db, "clin", id); 
    console.log("wewwwee");
     
  //elimina tutti i dati di prodottoClin con lo stesso nome del Cliente     elimina tutti gli articoli di quel cliente
    const q = query(collection(db, "prodottoClin"), where("author.name", "==", localStorage.getItem("NomeCliProd")));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (hi) => {
  // doc.data() is never undefined for query doc snapshots
    console.log(hi.id, " => ", hi.data().nomeC, hi.data().dataScal);
    await deleteDoc(doc(db, "prodottoClin", hi.id)); 
    });
    //infine elimina la data
    await deleteDoc(colDoc); 
  };
//**************************************************************************** */
//                              NICE
//********************************************************************************** */
    return ( 
    <>  
    <div className='wrapper'>
    <div><ToastContainer limit={1} /></div>
    <h1 className='title mt-3'> Lista Clienti</h1>



    {sup ===true && (
        <>    
 
{/** inserimento cliente **************************************************************************/}
{popupActive &&
      <div> 
      <div className='formAC'>
      <div className='divClose'>  <button type='button' className="button-close float-end" onClick={() => { setPopupActive(false); }}>
              <CloseIcon id="i" />
              </button> </div>
      <div className="input_container">
      <TextField className='inpCli mt-2 me-2' label="Nuovo Cliente" variant="outlined"  autoComplete='off' value={nomeC} 
        onChange={(e) => setNomeC(e.target.value)}/>
      <TextField className='inpCli mt-2' type="number" label="DebitoResiduo" variant="outlined" autoComplete='off' value={debito} 
        onChange={(e) => setDebito(e.target.value)}
        InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
        />
    <div className='mt-3' >
          <Input
          fullWidth
          className='inpCli'
            color="primary"
            variant="outlined"
            inputComponent={({ inputRef, onFocus, onBlur, ...props }) => (
              <Autocomplete
                apiKey={GOOGLE_MAPS_API_KEY}
                {...props}
                onPlaceSelected={(place) => {
                  setIndirizzo(place.formatted_address)
                  console.log(place);
                  }}
                options={{
                types: ["address"],
                componentRestrictions: { country: "it" },
                }}
                defaultValue={indirizzo}
              />
            )}
          />
        </div>
      <TextField className='inpCli mt-2 ' type="number" label="Partita IVA" variant="outlined" autoComplete='off' value={partitaIva} 
        onChange={(e) => setPartitaIva(e.target.value)}/>
      <TextField className='inpCli mt-2 me-2' type="tel" label="Cellulare" variant="outlined" autoComplete='off' value={cellulare} 
        onChange={(e) => setCellulare(e.target.value)}/>

      </div>
      <div className="btn_container">
      <Button  onClick={handleSubmit} variant="outlined" >Aggiungi</Button>
      </div>
    </div>
    </div>
  } 
  {!popupActive &&
  <div className="btn_container mt-5">
  <Button onClick={() => { setPopupActive(true) }} variant="outlined">Aggiungi un cliente</Button>
  </div>
  }
    </>
    )}

{/********************************************************************************************/}


<div className='todo_containerCli mt-5'>
<div className='row'>

<div className='col-2' >
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Cliente</p>
</div>
<div className='col-4' style={{padding: "0px"}}>
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>indirizzo</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Part. IVA</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Cellulare</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>DebitoRes.</p>
</div>
</div>


<div className="scroll">
{/** tabella per visualizzare */}

  {todos.map((todo) => (
    <div key={todo.id}>
    { ta === true &&(
    <TodoClient
      key={todo.id}
      todo={todo}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      displayMsg={displayMsg}
      getCliId={getCliId}
    />
     )}
    </div>
  ))}
  </div>
  <hr style={{margin: "0"}}/>
  </div>
    </div>
    </>
      )
}
export default AddCliente;

//questo file sta combinato insieme a todoClient