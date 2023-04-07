import React from "react";
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, orderBy, where, getDocs} from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';
import { auth, db } from "../firebase-config";
import DeleteIcon from "@mui/icons-material/Delete";
import { supa, guid, tutti } from '../components/utenti';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from "@mui/material";
import { AutoProdCli } from "../pages/AddNota";

export const AutoCompProd = [];

export default function TodoNota({ todo, handleDelete, handleEdit, displayMsg, nomeCli, flagStampa}) {

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true


  const [newQtProdotto, setQtProdotto] = React.useState(todo.qtProdotto);
  const [newProdotto, setNewProdotto] = React.useState(todo.prodottoC);
  const [newPrezzoUni, setPrezzoUni] = React.useState(todo.prezzoUniProd);
  const [newPrezzoTot, setnewPrezzoTot] = React.useState(todo.prezzoTotProd);

  let navigate = useNavigate();

  const handleInputChange = async (event, value) => {  //funzione per l'anagrafica del cliente
    setNewProdotto(value);
    const collectionRef = collection(db, "prodottoClin");
    //trova il prezzo unitario del prodotto
    const q = query(collectionRef, where("author.name", "==", nomeCli), where("nomeP", "==", value) );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (hi) => {
      console.log(hi.id, " => ", hi.data().author.name, hi.data().prezzoUnitario, hi.data().nomeP);
      setPrezzoUni(hi.data().prezzoUnitario);
    });
  }

  const handleSubm = (e) => {
    e.preventDefault();
    handleEdit(todo, newQtProdotto, newProdotto, newPrezzoUni, newPrezzoTot)
  };
//******************************************************************** */

  const handleChange = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setQtProdotto(todo.qtProdotto);
    } else {
      todo.qtProdotto = "";
      setQtProdotto(e.target.value);
    }
  };
  const handleChangeProd = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setNewProdotto(todo.prodottoC);
    } else {
      todo.prodottoC = "";
      setNewProdotto(e.target.value);
    }
  };
  const handleChangePrezzoUni = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setPrezzoUni(todo.prezzoUniProd);
    } else {
      todo.prezzoUniProd = "";
      setPrezzoUni(e.target.value);
    }
  };
  const handlePrezzoTot = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setnewPrezzoTot(todo.prezzoTotProd);
    } else {
      todo.prezzoTotProd = "";
      setnewPrezzoTot(e.target.value);
    }
  };
//INTERFACCIA ***************************************************************************************************************
//*************************************************************************************************************************** */
  return (
    <div className="prova">

<form  onSubmit={handleSubm}>
<hr style={{margin: "0"}}/>
    <div className="row " style={{ borderBottom:"solid",  borderWidth: "2px" }}>
{/**************************QUANTITA'******************************************************************* */}
    <div className="col-1" style={{padding:"0px", }}>    
    {sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through", textAlign:"center" }}
        type="text"
        value={todo.qtProdotto === "" ? newQtProdotto : todo.qtProdotto}
        className="inpTab"
        onChange={handleChange}
      />
    )}

    </div>

{/*******************Prodotto********************************************************************************** */}
<div className="col-6" style={{padding: "0px", borderLeft:"solid",  borderWidth: "2px",}}>
    {sup ===true && ( 
      <Autocomplete
      value={newProdotto}
      options={AutoProdCli}
      onInputChange={handleInputChange}
      componentsProps={{ popper: { style: { width: 'fit-content' } } }}
      renderInput={(params) => <TextField {...params}  size="small"/>}
    />
    )}

    </div>

{/************************Prezzo Uni***************************************************************************** */}
<div className="col-2" style={{ borderLeft:"solid",  borderWidth: "2px", padding: "0px" }}>

    {sup ===true && ( 
      <span style={{ padding: "0px", marginLeft:"5px" }}>€&nbsp;
      <input
       style={{textAlign:"left", padding: "0px", width:"95px"}}
        type="text"
        value={newPrezzoUni}
        className="inpTab"
        onChange={handleChangePrezzoUni}
      /> </span>

    )}
    </div>
{/***************************Prezzo Tot************************************************************************** */}
<div className="col-2" style={{ borderLeft:"solid",  borderWidth: "2px", padding: "0px", marginBottom:"0px"}}>
    {sup ===true && ( 
        <h4 
      style={{marginTop:"-5px", marginBottom:"0px", textAlign:"center"  }}
        type="text"
        className="inpTab"
        >{ todo.prezzoTotProd } €</h4>
    )}
    </div>
{/***************************************************************************************************** */}
      <div className="col-1" style={{padding: "0px"}}>
      <button hidden
          className="button-edit"
          onClick={() => handleEdit(todo, newQtProdotto, newProdotto, newPrezzoUni, newPrezzoTot)}
        >
        </button>
        {sup ===true && flagStampa==false && (   
        <button type="button" className="button-delete" style={{padding: "0px"}}                          
          onClick={() => {
                localStorage.setItem("IDNOTa", todo.id);
                localStorage.setItem("NomeCliProd", todo.nomeC);
                    displayMsg();
                    toast.clearWaitingQueue(); 
                            }}>
        <DeleteIcon id="i" />
        </button>
        )}
      </div>

    </div>

</form>


    </div>
  );
}