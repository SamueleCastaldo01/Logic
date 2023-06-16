import React from "react";
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, orderBy, where, getDocs} from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';
import { auth, db } from "../firebase-config";
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from "@mui/icons-material/Delete";
import { supa, guid, tutti } from '../components/utenti';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import Menu from '@mui/material/Menu';
import { AutoProdCli } from "../pages/AddNota";
import { fontSize } from "@mui/system";

export const AutoCompProd = [];

export default function TodoNotaDip({ todo, handleEdit, displayMsg, nomeCli, flagStampa, Completa, SommaTot}) {

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true


  const [newQtProdotto, setQtProdotto] = React.useState(todo.qtProdotto);
  const [nomeTinte, setNomeTinte] = React.useState(todo.nomeTinte);
  const [newProdotto, setNewProdotto] = React.useState(todo.prodottoC);
  const [newPrezzoUni, setPrezzoUni] = React.useState(todo.prezzoUniProd);
  const [newPrezzoTot, setnewPrezzoTot] = React.useState(todo.prezzoTotProd);
  const [newT1, setT1] = React.useState(todo.t1);
  const [newT2, setT2] = React.useState(todo.t2);
  const [newT3, setT3] = React.useState(todo.t3);
  const [newT4, setT4] = React.useState(todo.t4);
  const [newT5, setT5] = React.useState(todo.t5);

  const [checked, setChecked] = React.useState(todo.artPreso);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [age, setAge] = React.useState('');

  let navigate = useNavigate();

  const handleChangeChecked = async (event) => {  //handle per il check
    await updateDoc(doc(db, "Nota", todo.id), { artPreso:!checked});
    setChecked(!checked);
  };
//***************************************************************************************** */
  const handleChangeNo = async (event) => {   //aggiorna sia il simbolo del prodotto, e il suo prezzo totale diventa 0, in questo modo non va a fare la somma con il resto
    await updateDoc(doc(db, "Nota", todo.id), { simbolo:"(NO)", prezzoTotProd:0});
    SommaTot();
    handleClose()
  };

  const handleChangeEvi = async (event) => {
    if(todo.simbolo=="(NO)") {   //se il simbolo è no, va a calcolarsi prima il suo prezzo totale del prodotto e poi aggiorna il simbolo e il prezzo
      var preT= todo.prezzoUniProd * todo.qtProdotto;  //qui va a fare il prezzo del prodotto in base alla quantità e al prezzo unitario
      await updateDoc(doc(db, "Nota", todo.id), {prezzoTotProd:preT});
    }
    await updateDoc(doc(db, "Nota", todo.id), { simbolo:" "});
    SommaTot();
    handleClose()
  };

  const handleChangeInterro = async (event) => {
    if(todo.simbolo=="(NO)") {   //se il simbolo è no, va a calcolarsi prima il suo prezzo totale del prodotto e poi aggiorna il simbolo e il prezzo
      var preT= todo.prezzoUniProd * todo.qtProdotto;  //qui va a fare il prezzo del prodotto in base alla quantità e al prezzo unitario
      await updateDoc(doc(db, "Nota", todo.id), {prezzoTotProd:preT});
    }
    await updateDoc(doc(db, "Nota", todo.id), { simbolo:"?"});
    SommaTot();
    handleClose()
  };

  const handleChangeRemMenu = async (event) => {
    if(todo.simbolo=="(NO)") {   //se il simbolo è no, va a calcolarsi prima il suo prezzo totale del prodotto e poi aggiorna il simbolo e il prezzo
      var preT= todo.prezzoUniProd * todo.qtProdotto;  //qui va a fare il prezzo del prodotto in base alla quantità e al prezzo unitario
      await updateDoc(doc(db, "Nota", todo.id), {prezzoTotProd:preT});
    }
    await updateDoc(doc(db, "Nota", todo.id), { simbolo:""}); //infine aggiorna il simbolo
    SommaTot();
    handleClose();
  };
 //******************************************************************** */ 

  const handleSubm = (e) => {
    e.preventDefault();
    handleEdit(todo, newQtProdotto, newProdotto, newPrezzoUni, newPrezzoTot, newT1, newT2, newT3, newT4, newT5, nomeTinte)
  };

  const handleClose = () => {  //chiude il menu
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

//******************************************************************** */
//handle change

const handleChangeTintSelect = (event) => {
  setNomeTinte(event.target.value);
};

const handleChangeAge = (event) => {
  setAge(event.target.value);
};

  const handleChange = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setQtProdotto(todo.qtProdotto);
    } else {
      todo.qtProdotto = "";
      setQtProdotto(e.target.value);
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
  const handleT1 = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setT1(todo.t1);
    } else {
      todo.t1 = "";
      setT1(e.target.value);
    }
  };
  const handleT2 = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setT2(todo.t2);
    } else {
      todo.t2 = "";
      setT2(e.target.value);
    }
  };
  const handleT3 = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setT3(todo.t3);
    } else {
      todo.t3 = "";
      setT3(e.target.value);
    }
  };
  const handleT4 = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setT4(todo.t4);
    } else {
      todo.t4 = "";
      setT4(e.target.value);
    }
  };
  const handleT5 = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setT5(todo.t5);
    } else {
      todo.t5 = "";
      setT5(e.target.value);
    }
  };
//INTERFACCIA ***************************************************************************************************************
//*************************************************************************************************************************** */
  return (
    <div className="prova">

<form  onSubmit={handleSubm}>
<hr style={{margin: "0"}}/>
    <div className="row " style={{ borderBottom:"solid",  borderWidth: "2px" }}>
{/**************************CHECKED'******************************************************************* */}
    <div className="col-1" style={{padding:"0px" }}>
    <input className="checkboxStyle" type="checkbox" id="coding" name="interest" checked={checked} onChange={handleChangeChecked} />
    </div>
{/**************************QUANTITA'******************************************************************* */}
    <div className="col-1" style={{padding:"0px", background: todo.simbolo == " " && "#FFFF00" }}>    

      <h3 className="inpTabNota" style={{ textAlign:"center"}}><span style={{ background: todo.simbolo == " " && "#FFFF00"}}>{todo.qtProdotto}</span></h3>

    </div>

{/*******************Prodotto********************************************************************************** */}
<div className="col-8" style={{padding: "0px", borderLeft:"solid",  borderWidth: "2px", background: todo.simbolo == " " && "#FFFF00"}}>
      {/***Prodotti********************** */}

    { todo.flagTinte===false &&( 
      <h3 className="inpTabNota" style={{ marginLeft: "12px"}}><span style={{background: todo.simbolo == " " && "#FFFF00"}}>{todo.prodottoC}</span>  </h3>
    )}

      {/*****Tinte********************************************************************/}
    { todo.flagTinte===true && (
      <>
      <h3 className="inpTabNota" style={{ marginLeft: "12px"}}> {todo.prodottoC} 
      {todo.t1 && <> <span className="inpTabNota" style={{ marginLeft: "35px", textAlign:"center", padding:"0px"}}> {todo.t1} </span>   </> }
      {todo.t2 && <> <span style={{marginLeft: "10px"}}>-</span> <span className="inpTabNota" style={{ marginLeft: "10px", textAlign:"center", padding:"0px"}}> {todo.t2} </span>  </> }
      {todo.t3 && <> <span style={{marginLeft: "10px"}}>-</span> <span className="inpTabNota" style={{ marginLeft: "10px", textAlign:"center", padding:"0px"}}> {todo.t3} </span> </> }
      {todo.t4 && <> <span style={{marginLeft: "10px"}}>-</span> <span className="inpTabNota" style={{ marginLeft: "10px", textAlign:"center", padding:"0px"}}> {todo.t4} </span> </> }
      </h3>
      </>
    )}
    </div>
{/*****************Simbolo************************************************************************************ */}
<div className="col-1" style={{padding: "0px", background: todo.simbolo == " " && "#FFFF00"}}>
<h3 className="inpTabNota" style={{color: "red", fontSize: "16px", textAlign: "center"}}>{todo.simbolo}</h3>
</div>
{/*****************button************************************************************************************ */}

      <div className="col-1" style={{padding: "0px"}}>
      <button hidden
          className="button-edit"
          onClick={() => handleEdit(todo, newQtProdotto, newProdotto, newPrezzoUni, newPrezzoTot, newT1, newT2, newT3, newT4, newT5, nomeTinte)}
        >
        </button>
        {  flagStampa==false && Completa == 0 && (   
        <button hidden type="button" className="button-delete" style={{padding: "0px"}}                          
          onClick={() => {
                localStorage.setItem("IDNOTa", todo.id);
                localStorage.setItem("NomeCliProd", todo.nomeC);
                    displayMsg();
                    toast.clearWaitingQueue(); 
                            }}>
        <DeleteIcon id="i" />
        </button>
        )}

        { Completa == 0 &&(
      <>
        <button type="button" className="buttonMenu" style={{padding: "0px"}} >
        <MoreVertIcon id="i" onClick={handleMenu}/>
        <Menu  sx={
        { mt: "1px", "& .MuiMenu-paper": 
        { backgroundColor: "#333",
          color: "white" }, 
        }
        }
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleChangeEvi}>Evidenzia</MenuItem>
                <MenuItem onClick={handleChangeNo}>(NO)</MenuItem>
                <MenuItem onClick={handleChangeInterro}>?</MenuItem>
                <MenuItem onClick={handleChangeRemMenu}>Rimuovi</MenuItem>
              </Menu>
        </button>
        </>
      )}

      </div>

    </div>

</form>


    </div>
  );
}