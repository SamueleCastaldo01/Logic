import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { supa, guid, tutti } from '../components/utenti';


export default function TodoProdClin({ todo, toggleComplete, handleEdit, displayMsg}) {

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true


  const [newNomeP, setNomeP] = React.useState(todo.nomeP);
  const [newPrezzoUni, setPrezzoUnitario] = React.useState(todo.prezzoUnitario);
  const [flagCrono, setFlagCrono] = React.useState(false);

  const handleSubm = (e) => {
    e.preventDefault();
    console.log("heeey")
    handleEdit(todo, newNomeP, newPrezzoUni);
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
  const handleChangePU = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setNomeP(todo.prezzoUnitario);
    } else {
      todo.prezzoUnitario = "";
      setPrezzoUnitario(e.target.value);
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
{/******************************************************************************* */}
    <div className="col-3" >
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
{/******************************************************************************* */}

<div className="col-1" style={{padding: "0px"}}>
{sup ===true && ( 
    <input
      style={{ textDecoration: todo.completed && "line-through" }}
        type="text"
        value={todo.prezzoUnitario === "" ? newPrezzoUni : todo.prezzoUnitario}
        className="inpTab"
        onChange={handleChangePU}
      />
    )}
    </div>
{/*********************************************************************************** */}

    <div className="col-2">
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
          onClick={() =>{ { handleEdit(todo, newNomeP, newPrezzoUni); }}}
        >
          <EditIcon id="i" />
        </button>

        {sup ===true && (   
        <button className="button-delete"
              onClick={() => {
                    localStorage.setItem("IdProdClin", todo.id);
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