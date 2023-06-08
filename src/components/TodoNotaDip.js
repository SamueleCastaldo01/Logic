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

export default function TodoNotaDip({ todo, handleEdit, displayMsg, nomeCli, flagStampa, Completa}) {

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

  const handleChangeChecked = async (event) => {
    await updateDoc(doc(db, "Nota", todo.id), { artPreso:!checked});
    setChecked(!checked);
  };

  const handleChangeNo = async (event) => {
    await updateDoc(doc(db, "Nota", todo.id), { simbolo:"(NO)"});
    handleClose()
  };

  const handleChangeX = async (event) => {
    await updateDoc(doc(db, "Nota", todo.id), { simbolo:"X"});
    handleClose()
  };

  const handleChangeInterro = async (event) => {
    await updateDoc(doc(db, "Nota", todo.id), { simbolo:"?"});
    handleClose()
  };

  const handleChangeRemMenu = async (event) => {
    await updateDoc(doc(db, "Nota", todo.id), { simbolo:""});
    handleClose()
  };

  const handleInputChange = async (event, value) => {  //funzione per l'anagrafica del cliente, trova il prezzo unitario del prodotto
    setNewProdotto(value);
    const collectionRef = collection(db, "prodottoClin");
    //trova il prezzo unitario del prodotto
    const q = query(collectionRef, where("author.name", "==", nomeCli), where("nomeP", "==", value) );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (hi) => {
      setPrezzoUni(hi.data().prezzoUnitario);
    });
  }

  const handlePrezzUniUpd = async (e) => {  // funzione che si attiva quando cambio il prezzo unitario del prodotto
    console.log("sono entrato nel handle prezzoUni")
    e.preventDefault();
    const collectionRef = collection(db, "prodottoClin");
    //trova l'id del prodottoClin, per poi poter aggiornare il prezzo unitario del prodottoPersonalizzato
    const q = query(collectionRef, where("author.name", "==", nomeCli), where("nomeP", "==", todo.prodottoC) );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (hi) => {
      console.log(hi.id, " => ", hi.data().author.name, hi.data().prezzoUnitario, hi.data().nomeP);
      await updateDoc(doc(db, "prodottoClin", hi.id),  //aggiorna il prezzoUni di prodottoCli
      { prezzoUnitario: newPrezzoUni });
    });
    handleEdit(todo, newQtProdotto, newProdotto, newPrezzoUni, newPrezzoTot, newT1, newT2, newT3, newT4, newT5, nomeTinte) //aggiorna la nota e fa la somma
    toast.clearWaitingQueue(); 
  };

  const handleSubm = (e) => {
    e.preventDefault();
    handleEdit(todo, newQtProdotto, newProdotto, newPrezzoUni, newPrezzoTot, newT1, newT2, newT3, newT4, newT5, nomeTinte)
  };

  const handleClose = () => {
    console.log("entrato")
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
    <div className="col-1" style={{padding:"0px" }}>    

    {sup ===true &&   ( 
      <h3 className="inpTabNota" style={{ textAlign:"center"}}> {todo.qtProdotto} </h3>
    )}
    </div>

{/*******************Prodotto********************************************************************************** */}
<div className="col-8" style={{padding: "0px", borderLeft:"solid",  borderWidth: "2px",}}>
      {/***Prodotti********************** */}

    {sup ===true &&( 
      <h3 className="inpTabNota" style={{ marginLeft: "12px"}}> {todo.prodottoC} </h3>
    )}

      {/*****Tinte********************************************************************/}
    {sup ===true && todo.flagTinte===true && Completa == 0 &&( 
      <>
        <div className="divTinte"><span>
        <FormControl >
        <InputLabel id="demo-simple-select-label"></InputLabel>
        <Select sx={{height:39, marginLeft:-1}}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={nomeTinte}
          onChange={handleChangeTintSelect}
          onBlur={handleSubm}
        >
          <MenuItem value={"KF"}>KF</MenuItem>
          <MenuItem value={"KR"}>KR</MenuItem>
          <MenuItem value={"CB"}>CB</MenuItem>
        </Select>
      </FormControl>
         </span> 
        <input
      style={{textAlign:"center", width:"42px", padding:"0px"}}
        className="inpTinte"
        type="text"
        value={todo.t1 === "" ? newT1 : todo.t1}
        onChange={handleT1}
        onBlur={handleSubm}
      /> -
        <input
      style={{textAlign:"center", width:"42px", padding:"0px"}}
        className="inpTinte"
        type="text"
        value={todo.t2 === "" ? newT2 : todo.t2}
        onChange={handleT2}
        onBlur={handleSubm}
      /> -
        <input
      style={{textAlign:"center", width:"42px", padding:"0px"}}
        className="inpTinte"
        type="text"
        value={todo.t3 === "" ? newT3 : todo.t3}
        onChange={handleT3}
        onBlur={handleSubm}
      /> -
        <input
      style={{textAlign:"center", width:"42px", padding:"0px"}}
        className="inpTinte"
        type="text"
        value={todo.t4 === "" ? newT4 : todo.t4}
        onChange={handleT4}
        onBlur={handleSubm}
      /> -
      <input
      style={{textAlign:"center", width:"42px", padding:"0px"}}
        className="inpTinte"
        type="text"
        value={todo.t5 === "" ? newT5 : todo.t5}
        onChange={handleT5}
        onBlur={handleSubm}
      /> 
        </div>
      </>
    )}
    {sup ===true && todo.flagTinte===true && Completa == 1 &&(
      <>
      <h3 className="inpTabNota" style={{ marginLeft: "12px"}}> {todo.nomeTinte} 
      {todo.t1 && <> <span className="inpTabNota" style={{ marginLeft: "35px", textAlign:"center", padding:"0px"}}> {todo.t1} </span>   </> }
      {todo.t2 && <> <span style={{marginLeft: "10px"}}>-</span> <span className="inpTabNota" style={{ marginLeft: "10px", textAlign:"center", padding:"0px"}}> {todo.t2} </span>  </> }
      {todo.t3 && <> <span style={{marginLeft: "10px"}}>-</span> <span className="inpTabNota" style={{ marginLeft: "10px", textAlign:"center", padding:"0px"}}> {todo.t3} </span> </> }
      {todo.t4 && <> <span style={{marginLeft: "10px"}}>-</span> <span className="inpTabNota" style={{ marginLeft: "10px", textAlign:"center", padding:"0px"}}> {todo.t4} </span> </> }
      {todo.t5 && <> <span style={{marginLeft: "10px"}}>-</span> <span className="inpTabNota" style={{ marginLeft: "10px", textAlign:"center", padding:"0px"}}> {todo.t5} </span> </> }
      </h3>
      
      </>

    )}
    </div>
{/*****************Simbolo************************************************************************************ */}
<div className="col-1" style={{padding: "0px"}}>
<h3 className="inpTabNota" style={{color: "red", fontSize: "16px", textAlign: "center"}}>{todo.simbolo}</h3>
</div>
{/*****************button************************************************************************************ */}

      <div className="col-1" style={{padding: "0px"}}>
      <button hidden
          className="button-edit"
          onClick={() => handleEdit(todo, newQtProdotto, newProdotto, newPrezzoUni, newPrezzoTot, newT1, newT2, newT3, newT4, newT5, nomeTinte)}
        >
        </button>
        {sup ===true && flagStampa==false && Completa == 0 && (   
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
                <MenuItem onClick={handleChangeNo}>(NO)</MenuItem>
                <MenuItem onClick={handleChangeX}>X</MenuItem>
                <MenuItem onClick={handleChangeInterro}>?</MenuItem>
                <MenuItem onClick={handleChangeRemMenu}>Rimuovi</MenuItem>
              </Menu>
        </button>
      </div>

    </div>

</form>


    </div>
  );
}