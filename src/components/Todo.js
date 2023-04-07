import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import { supa, guid, tutti } from '../components/utenti';


export default function Todo({ todo, toggleComplete, handleDelete, handleEdit, flagStampa}) {

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true


  const [newNomeC, setNomeC] = React.useState(todo.nomeC);
  const [newDebito, setDebito] = React.useState(todo.debito);
  const [newQuota, setQuota] = React.useState(todo.quota);
  const [newNumAsc, setNumAsc] = React.useState(todo.numAsc);
  const [newNote, setNote] = React.useState(todo.note);

  const handleSubm = (e) => {
    e.preventDefault();
    handleEdit(todo, newNomeC, newNumAsc, newNote, newDebito, newQuota);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setNomeC(todo.nomeC);
    } else {
      todo.nomeC = "";
      setNomeC(e.target.value);
    }
  };

  const handleChangeN = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setNumAsc(todo.numAsc);
    } else {
      todo.numAsc = "";
      setNumAsc(e.target.value);
    }
  };

  const handleChangeD = (e) => {
    e.preventDefault();
    if (todo.debito === true) {
      setDebito(todo.debito);
    } else {
      todo.debito = "";
      setDebito(e.target.value);
    }
  };

  const handleChangeQ = (e) => {
    e.preventDefault();
    if (todo.quota === true) {
      setQuota(todo.quota);
    } else {
      todo.quota = "";
      setQuota(e.target.value);
    }
  };

  const handleChangeNT = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setNote(todo.note);
    } else {
      todo.note = "";
      setNote(e.target.value);
    }
  };

  return (
    <div className="prova">

    <hr style={{margin: "0"}}/>

    <form  onSubmit={handleSubm}>
    <div className="row ">
{/********************CLIENTE*********************************************************** */}
    <div className="col-2" >
    {sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        value={todo.nomeC === "" ? newNomeC : todo.nomeC}
        className="inpTab"
        onChange={handleChange}
      />
    )}
    {gui ===true && ( 
    <h4
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        className="inpTab"
        >{ newNomeC}</h4>
    )}
    </div>
{/******************DEBITO************************************************************* */}

<div className="col-1" style={{padding: "0px"}}>
    {sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        value={todo.debito === "" ? newDebito : todo.debito}
        className="inpTab"
        onChange={handleChangeD}
      />
    )}
    {gui ===true && ( 
    <h4
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        className="inpTab"
      >{newDebito}€</h4>
    )}
    </div>
{/***********************ASC************************************************************ */}
<div className="col-1" style={{padding: "0px"}}>
    {sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        value={todo.numAsc === "" ? newNumAsc : todo.numAsc}
        className="inpTab"
        onChange={handleChangeN}
      />
    )}
    {gui ===true && ( 
    <h4
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        className="inpTab"
      >{ newNumAsc}</h4>
    )}
    </div>
{/************************QUOTA*********************************************************** */}
<div className="col-1" style={{padding: "0px"}}>
    {sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        value={todo.quota === "" ? newQuota : todo.quota}
        className="inpTab"
        onChange={handleChangeQ}
      />
    )}
    {gui ===true && ( 
    <h4
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        className="inpTab"
      >{ newQuota}€</h4>
    )}
    </div>
{/********************NOTE*************************************************************** */}
    <div className="col" style={{padding: "0px"}}> 
    <textarea
        style={{textAlign: "left", fontSize: "18px"}}
        type="text"
        value={todo.note === "" ? newNote : todo.note}
        className="inpTab"
        onChange={handleChangeNT}
      />
    </div>
{/*************************BUTTON********************************************************** */}
    <div className="col">
      {flagStampa==false &&
      <>
    {gui ===true && (
    <button
          className="button-complete"
          onClick={() => toggleComplete(todo)}
        >
          <CheckCircleIcon id="i" />
        </button>
        )}
        <button
          className="button-edit"
          onClick={() => handleEdit(todo, newNomeC, newNumAsc, newNote, newDebito, newQuota)}
        >
          <EditIcon id="i" />
        </button>
        {sup ===true && (   
        <button className="button-delete" onClick={() => handleDelete(todo.id)}>
          <DeleteIcon id="i" />
        </button>
        )}
        </>
        }
    </div>
    </div>
    </form>

    </div>
  );
}