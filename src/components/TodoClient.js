import React from "react";
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, orderBy, where, getDocs} from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';
import { auth, db } from "../firebase-config";
import DeleteIcon from "@mui/icons-material/Delete";
import { supa, guid, tutti } from '../components/utenti';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { padding } from "@mui/system";

export const AutoCompProd = [];

export default function TodoClient({ todo, handleDelete, handleEdit, displayMsg, getCliId}) {

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true


  const [newNomeC, setNomeC] = React.useState(todo.nomeC);
  const [newIndirizzo, setIndirizzo] = React.useState(todo.indirizzo);
  const [newIndirizzoLink, setIndirizzoLink] = React.useState(todo.indirizzoLink);
  const [newPartIva, setPartIva] = React.useState(todo.partitaIva);
  const [newCellulare, setCellulare] = React.useState(todo.cellulare);
  const [debito, setDebito] = React.useState(todo.debito);

  let navigate = useNavigate();

  const handleSubm = (e) => {
    e.preventDefault();
    handleEdit(todo, newNomeC, newPartIva, newCellulare, debito)
  };
//*************************************************************** */
  const auto = async () => {
    const q = query(collection(db, "prodotto"));
    const querySnapshot = await  getDocs(q);
    querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data().nomeP);
  
    let car = { label: doc.data().nomeP }
    AutoCompProd.push(car);
    });
    }
//******************************************************************** */

  const handleChange = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setNomeC(todo.nomeC);
    } else {
      todo.nomeC = "";
      setNomeC(e.target.value);
    }
  };
  const handleChangeIva = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setPartIva(todo.partitaIva);
    } else {
      todo.partitaIva = "";
      setPartIva(e.target.value);
    }
  };
  const handleChangeCell = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setCellulare(todo.cellulare);
    } else {
      todo.cellulare = "";
      setCellulare(e.target.value);
    }
  };
  const handleChangeDeb = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setDebito(todo.debito);
    } else {
      todo.debito = "";
      setDebito(e.target.value);
    }
  };
//INTERFACCIA ***************************************************************************************************************
//*************************************************************************************************************************** */
  return (
    <div className="prova">

<form  onSubmit={handleSubm}>
<hr style={{margin: "0"}}/>
    <div className="row ">
{/********************************************************************************************* */}
    <div className="col-2" >
    <h5
      style={{ textDecoration: todo.completed && "line-through"  }}
        type="text"
        className="inpTab"
        onClick={() => {
            getCliId(todo.id, todo.nomeC)
            navigate("/dashclienti");
            auto();
            AutoCompProd.length = 0
                            }}
        >{ newNomeC}</h5>

    </div>
{/********************************************************************************************* */}
    <div className="col-4" style={{padding: "0px"}}>
    <p className="inpTab" ><a
      style={{ textDecoration: todo.completed && "line-through", textAlign: "center"}}
        href={ newIndirizzoLink }
        target="_blank"
        className="linkTab"
        >{ newIndirizzo }</a> </p>
    </div>

{/***************************************************************************************************** */}
<div className="col-1" style={{padding: "0px"}}>
    {sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        value={todo.partitaIva === "" ? newPartIva : todo.partitaIva}
        className="inpTab"
        onChange={handleChangeIva}
      />
    )}
    {gui ===true && ( 
    <h4
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        className="inpTab"
        >{ newPartIva}</h4>
    )}
    </div>

{/***************************************************************************************************** */}
<div className="col-1" style={{padding: "0px"}}>
    {sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        value={todo.cellulare === "" ? newCellulare : todo.cellulare}
        className="inpTab"
        onChange={handleChangeCell}
      />
    )}
    {gui ===true && ( 
    <h4
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        className="inpTab"
        >{ newCellulare}</h4>
    )}
    </div>
{/***************************************************************************************************** */}
<div className="col-1" style={{padding: "0px"}}>
    {sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        value={todo.debito === "" ? debito : todo.debito}
        className="inpTab"
        onChange={handleChangeDeb}
      />
    )}
    {gui ===true && ( 
    <h4
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        className="inpTab"
        >{ debito}</h4>
    )}
    </div>
{/***************************************************************************************************** */}
      <div className="col">
      <button
          className="button-edit"
          onClick={() => handleEdit(todo, newNomeC, newPartIva, newCellulare, debito)}
        >
          <EditIcon id="i" />
        </button>
        {sup ===true && (   
        <button type="reset" className="button-delete"                          
          onClick={() => {
                localStorage.setItem("IDscal", todo.id);
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