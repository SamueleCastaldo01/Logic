import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { supa, guid, tutti } from '../components/utenti';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


export default function TodoScorta({ todo, toggleComplete, handleDelete, handleEdit, handleAddQuant, handleRemQuant, handlePopUp, displayMsg, FlagStampa, flagDelete}) {

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

  const [newNomeP, setNomeP] = React.useState(todo.nomeP);
  const [newQuantita, setQuantita] = React.useState(todo.quantita);
  const [newSottoScorta, setNewSottoScorta] = React.useState(todo.sottoScorta);
  const [newQuantitaOrdinabile, setnewQuantitaOrdinabile] = React.useState(todo.quantitaOrdinabile);
  const [aggiungi, setAggiungi] = React.useState("");

  const handleSubm = (e) => {
    e.preventDefault();
    handleEdit(todo, newNomeP, newSottoScorta, newQuantitaOrdinabile);
    setAggiungi("");
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

  const handleChangeSs = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setNewSottoScorta(todo.sottoScorta);
    } else {
      todo.sottoScorta = "";
      setNewSottoScorta(e.target.value);
    }
  };

  const handleChangeQo = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setnewQuantitaOrdinabile(todo.quantitaOrdinabile);
    } else {
      todo.quantitaOrdinabile = "";
      setnewQuantitaOrdinabile(e.target.value);
    }
  };
//********************************************************************************** */
//                              NICE
//********************************************************************************** */
  return (
    <div className="prova">

    <form  onSubmit={handleSubm}>
    <div className="row ">
{/*********************PRODOTTO********************************************************** */}
    <div className="col-4 diviCol" >
    { /*
          {sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through", fontSize:"14px" }}
        type="text"
        onBlur={handleSubm}
        value={todo.nomeP === "" ? newNomeP : todo.nomeP}
        className="inpNumb"
        onChange={handleChange}
      />
    )}
       */}

    {ta ===true && ( 
    <h4
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        className="inpTab"
        >{ newNomeP}</h4>
    )}
    </div>
{/********************QUANTITA'*********************************************************** */}

<div className="col-1 diviCol" style={{padding: "0px"}}>
    {ta ===true && ( 
    <h4
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        onBlur={handleSubm}
        className="inpTab"
      >{todo.quantita === "" ? newQuantita : todo.quantita}</h4>
    )}
    </div>
  {/********************SOTTOSCORTA'*********************************************************** */}
<div className="col-1 diviCol" style={{padding: "0px"}}>
{sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through", fontSize:"14px" }}
        type="text"
        onBlur={handleSubm}
        value={todo.sottoScorta === "" ? newSottoScorta : todo.sottoScorta}
        className="inpNumb"
        onChange={handleChangeSs}
      />
    )}
    </div>
  {/********************QUANTITA ORDINABILE'*********************************************************** */}
  <div className="col-1 diviCol" style={{padding: "0px"}}>
{sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through", fontSize:"14px" }}
        type="text"
        onBlur={handleSubm}
        value={todo.quantitaOrdinabile === "" ? newQuantitaOrdinabile : todo.quantitaOrdinabile}
        className="inpNumb"
        onChange={handleChangeQo}
      />
    )}
    </div>
{/**********************AGGIUNGI************************************************************* */}

<div className="col-1 diviCol" style={{padding: "0px"}}>
    {sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through", fontSize:"14px" }}
        type="number" min="1"
        value={aggiungi}
        onChange={(event) => {setAggiungi(event.target.value);}}
        className="inpNumb"
      />
    )}
</div>
{/***************************BUTTON******************************************************** */}
    { FlagStampa==false &&
    <div className="col-2 diviCol" style={{padding:"0px"}}>
      <button 
      className="butAddProd me-2"
      type="button"
      onClick={() =>{ { localStorage.setItem("flagCron", true); handleAddQuant(todo, newNomeP, aggiungi); setAggiungi("") }}}>Agg</button>
      <button
      className="butRemProd"
      type="button"
      onClick={() =>{ {localStorage.setItem("flagCron", false); handleRemQuant(todo, newNomeP, aggiungi); setAggiungi("") }}}>Rim</button>
    </div> }

    <button
        hidden
          className="button-edit"
          type="submit">
          <EditIcon id="i" />
    </button> 
{/***************************BUTTON del******************************************************** */}
{ flagDelete &&
  <>
{ FlagStampa==false &&
    <div className="col-2 diviCol" style={{padding:"0px", marginTop:"-8px"}}>

{ /*
        <button
          className="button-edit"
          type="button"
          onClick={() =>{ { handlePopUp(todo.image, todo.nota); }}}>
          <SearchIcon id="i" />
        </button> 
     */ }
        
        {sup ===true && FlagStampa==false && (   
        <button className="button-delete" type="button"  
              onClick={() => {
                    localStorage.setItem("IdProd", todo.id);
                    localStorage.setItem("NomeProd", todo.nomeP);
                    displayMsg();
                    toast.clearWaitingQueue(); 
                            }}>
          <DeleteIcon id="i" />
        </button>
        )}
    </div>
  }
  </>
  }
    </div>
    </form>
    <hr style={{margin: "0"}}/>
    </div>
  );
}