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

export default function TodoDebiCli({ todo, handleDelete, handleEditDeb, displayMsg, getCliId}) {

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true


  const [newNomeC, setNomeC] = React.useState(todo.nomeC);
  const [d1, setD1] = React.useState(todo.deb1);
  const [d2, setD2] = React.useState(todo.deb2);
  const [d3, setd3] = React.useState(todo.deb3);
  const [d4, setd4] = React.useState(todo.deb4);

  let navigate = useNavigate();

  const handleSubm = (e) => {
    e.preventDefault();
    handleEditDeb(todo, newNomeC, d1, d2, d3, d4)
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
  const handleChangeD1 = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setD1(todo.deb1);
    } else {
      todo.deb1 = "";
      setD1(e.target.value);
    }
  };
  const handleChangeD2 = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setD2(todo.deb2);
    } else {
      todo.deb2 = "";
      setD2(e.target.value);
    }
  };
  const handleChangeD3 = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setd3(todo.deb3);
    } else {
      todo.deb3 = "";
      setd3(e.target.value);
    }
  };
  const handleChangeD4 = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setd4(todo.deb4);
    } else {
      todo.deb4 = "";
      setd4(e.target.value);
    }
  };
//INTERFACCIA ***************************************************************************************************************
//*************************************************************************************************************************** */
  return (
    <div className="prova">

<form  onSubmit={handleSubm}>
<hr style={{margin: "0"}}/>
    <div className="row ">
{/*****************NOME**************************************************************************** */}
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

{/*********************D1******************************************************************************** */}
<div className="col-1" style={{padding: "0px"}}>
    {sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        value={todo.deb1 === "" ? d1 : todo.deb1}
        className="inpTab"
        onChange={handleChangeD1}
      />
    )}
    </div>

{/***********************D2****************************************************************************** */}
<div className="col-1" style={{padding: "0px"}}>
    {sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        value={todo.deb2 === "" ? d2 : todo.deb2}
        className="inpTab"
        onChange={handleChangeD2}
      />
    )}
    </div>
{/*******************D3********************************************************************************** */}
<div className="col-1" style={{padding: "0px"}}>
    {sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        value={todo.deb3 === "" ? d3 : todo.deb3}
        className="inpTab"
        onChange={handleChangeD3}
      />
    )}
    </div>
{/*******************D4********************************************************************************** */}
<div className="col-1" style={{padding: "0px"}}>
    {sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        value={todo.deb4 === "" ? d4 : todo.deb4}
        className="inpTab"
        onChange={handleChangeD4}
      />
    )}
    </div>
{/********************BUTTON********************************************************************************* */}
      <div className="col">
      <button
          className="button-edit"
          onClick={() => handleEditDeb(todo, newNomeC, d1, d2, d3, d4)}
        >
          <EditIcon id="i" />
        </button>
      </div>

    </div>

</form>


    </div>
  );
}