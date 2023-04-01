import React, { useEffect, useState } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, where, getDocs, orderBy, serverTimestamp} from 'firebase/firestore';
import moment from 'moment';
import { TextField } from '@mui/material';
import { auth, db } from "../firebase-config";
import useMediaQuery from '@mui/material/useMediaQuery';
import { AutoCompProd } from '../components/TodoClient';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { notifyError } from '../components/Notify';
import Todo from '../components/Todo';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {notifyErrorProd, notifyUpdateProd, notifyErrorPrezzoUni, notifyErrorProdList } from '../components/Notify';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import { AutoComp } from './ScaletData';
import { supa } from '../components/utenti';
import { guid } from '../components/utenti';
import { tutti } from '../components/utenti';
import TodoProdClin from '../components/TodoProdClin';

function DashClienti({ clientId, nomeCli }) {

  const [todos, setTodos] = React.useState([]);
  const [nomeP, setNomeP] = React.useState("");
  const [prezzoUnitario, setPrezzoUnitario] = React.useState("");

  const [popupActiveScorta, setPopupActiveScorta] = useState(true);  

  const matches = useMediaQuery('(max-width:600px)');  //media query true se è uno smartphone
  const [popupActive, setPopupActive] = useState(false); 

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true



    function handleInputChange(event, value) {
      setNomeP(value)
    }
    function handleSpeedAddProd() {
      setPopupActive(true)
    }

//_________________________________________________________________________________________________________________
     //messaggio di conferma per cancellare la trupla
     const Msg = () => (
      <div>
        Sicuro di voler eliminare &nbsp;
        <button className='buttonApply ms-4 mt-2 me-1 rounded-4' onClick={Remove}>Si</button>
        <button className='buttonClose mt-2 rounded-4'>No</button>
      </div>
    )

      const Remove = () => {
          handleDelete(localStorage.getItem("IdProdClin") );
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
    const collectionRef = collection(db, "prodottoClin");
    const q = query(collectionRef, orderBy("nomeP"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
    });
    return () => unsub();

  }, []);
    //**************************************************************************** */
    const handleDelete = async (id) => {
      console.log("bhooooo")
      console.log(localStorage.getItem("IdProdClin"))
      await deleteDoc(doc(db, "prodottoClin", id));
    };
    //****************************************************************************************** */
    const handleEdit = async ( todo, nome, prezUni) => {
      await updateDoc(doc(db, "prodottoClin", todo.id), { nomeP: nome, prezzoUnitario:prezUni});
      notifyUpdateProd();
      toast.clearWaitingQueue(); 
    };
 //******************************************************************************* */
 const handleSubmit = async (e) => {   //creazione prodotto Cliente
  var bol= true
  e.preventDefault();
  if(!nomeP) {            
    notifyErrorProd();
    toast.clearWaitingQueue(); 
    return 
  }
  if(!prezzoUnitario) {            
    notifyErrorPrezzoUni();
    toast.clearWaitingQueue(); 
    return 
  }
  const q = query(collection(db, "prodottoClin"), where("nomeP", "==", nomeP), where("author.id", "==" , clientId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
// doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data().nomeP);
  if (doc.data().nomeP == nomeP) {
      notifyErrorProdList()
       toast.clearWaitingQueue(); 
      bol=false
  }
  });
  if(bol == true) {
    await addDoc(collection(db, "prodottoClin"), {
      nomeP,
      prezzoUnitario,
      author: { name: nomeCli, id: clientId }
    });
    setNomeP("");
    setPrezzoUnitario("");
  }
};
//*************************************************************************** */
//      INTERFACCIA
//*********************************************************************************** */

      return ( 
      <>  
      <div className="wrapper">
      <div><ToastContainer limit={1} /></div>
        <h1 className='title'> Dashboard Clienti</h1>
        <h2 className='mt-4'>Nome Cliente: {nomeCli} </h2>

        {!matches &&
      <div>
        <span><button onClick={handleSpeedAddProd}>Aggiungi Prodotto </button></span>
      </div>
    }

        {sup ===true && (
        <>    
{/** Aggiungi Prodotto **************************************************************************/}
{popupActive &&
      <div> 
      <form className='formCli' onSubmit={handleSubmit}>
      <div className='divClose mb-2'>  <button type='button' className="button-close float-end" onClick={() => { setPopupActive(false); }}>
              <CloseIcon id="i" />
              </button> </div>
      <div className="input_container">
      <Autocomplete
      value={nomeP}
      options={AutoCompProd}
      onInputChange={handleInputChange}
      componentsProps={{ popper: { style: { width: 'fit-content' } } }}
      renderInput={(params) => <TextField {...params} label="Prodotto" />}
    />
      <TextField className='inp mt-2' type="number" id="filled-basic" label="Prezzo Unitario" variant="outlined" autoComplete='off' value={prezzoUnitario} 
        onChange={(e) => setPrezzoUnitario(e.target.value)}
        InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
        />

      </div>
      <div className="btn_container">
      <Button  type='submit' variant="outlined" >Aggiungi Prodotto del Cliente </Button>
      </div>
    </form>
    </div>
  } 
    </>
    )}
{/** tabella per visualizzare *****************************************************************************************************************/}
{popupActiveScorta &&
<>

<div className='todo_containerCli mt-5 '>
<div className='row'>

<div className='col-3' >
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>Prodotto</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext' style={{textAlign: "left", fontSize: "18px"}}>PrezzoUni</p>
</div>
</div>

<div className="scroll">
  {todos.map((todo) => (
    <div key={todo.id}>
    {todo.author.id  === clientId &&  (
      <>
    { ta === true &&(
    <TodoProdClin
      key={todo.id}
      todo={todo}
      handleEdit={handleEdit}
      displayMsg={displayMsg}
    />
     )}
     </>
                  )}
    </div>
  ))}
  </div>
  <hr style={{margin: "0"}}/>
  </div>
  </>
}


      </div>
  
      </>
        )
  }
  export default DashClienti;
  