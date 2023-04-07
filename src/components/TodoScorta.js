import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { supa, guid, tutti } from '../components/utenti';


export default function TodoScorta({ todo, toggleComplete, handleDelete, handleEdit, handleAddQuant, handleRemQuant, handlePopUp, displayMsg, FlagStampa}) {

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

  const [newNomeP, setNomeP] = React.useState(todo.nomeP);
  const [newQuantita, setQuantita] = React.useState(todo.quantita);
  const [aggiungi, setAggiungi] = React.useState("");

  const handleSubm = (e) => {
    e.preventDefault();
    handleEdit(todo, newNomeP, newQuantita);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setNomeP(todo.nomeP);
    } else {
      todo.nomeP = "";
      setNomeP(e.target.value);
    }
  };
//********************************************************************************** */
//                              NICE
//********************************************************************************** */
  return (
    <div className="prova">

    <hr style={{margin: "0"}}/>

    <form  onSubmit={handleSubm}>
    <div className="row ">
{/*********************PRODOTTO********************************************************** */}
    <div className="col-4" >
    {sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        value={todo.nomeP === "" ? newNomeP : todo.nomeP}
        className="inpTab"
        onChange={handleChange}
      />
    )}
    {gui ===true && ( 
    <h4
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        className="inpTab"
        >{ newNomeP}</h4>
    )}
    </div>
{/********************QUANTITA'*********************************************************** */}

<div className="col-1" style={{padding: "0px"}}>
    {ta ===true && ( 
    <h4
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        className="inpTab"
      >{todo.quantita === "" ? newQuantita : todo.quantita}</h4>
    )}
    </div>
{/**********************AGGIUNGI************************************************************* */}

<div className="col-1" style={{padding: "0px"}}>
    {sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through" }}
        type="number" min="1"
        value={aggiungi}
        onChange={(event) => {setAggiungi(event.target.value);}}
        className="inpTab"
      />
    )}
    </div>
{/***************************BUTTON******************************************************** */}
    { FlagStampa==false &&
    <div className="col-3" style={{padding:"0px"}}>
      <button 
      className="butAddProd me-2"
      type="button"
      onClick={() =>{ { localStorage.setItem("flagCron", true); handleAddQuant(todo, newNomeP, aggiungi); setAggiungi("") }}}>Aggiungi</button>
      <button
      className="butRemProd"
      type="button"
      onClick={() =>{ {localStorage.setItem("flagCron", false); handleRemQuant(todo, newNomeP, aggiungi); setAggiungi("") }}}>Rimuovi</button>
    </div> }

{FlagStampa==false &&
    <div className="col-3" style={{padding:"0px"}}>
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
          type="button"
          onClick={() =>{ { handleEdit(todo, newNomeP, newQuantita, aggiungi); setAggiungi("") }}}>
          <EditIcon id="i" />
        </button> 

        <button
          className="button-edit"
          type="button"
          onClick={() =>{ { handlePopUp(todo.image, todo.nota); }}}>
          <SearchIcon id="i" />
        </button> 

        {sup ===true && FlagStampa==false && (   
        <button className="button-delete" type="button"  
              onClick={() => {
                    localStorage.setItem("IdProd", todo.id);
                    displayMsg();
                    toast.clearWaitingQueue(); 
                            }}>
          <DeleteIcon id="i" />
        </button>
        )}
    </div>
  }
    </div>
    </form>

    </div>
  );
}