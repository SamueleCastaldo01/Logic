import React, { useEffect, useState, useRef } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, orderBy, serverTimestamp, getCountFromServer, limit, where, getDocs} from 'firebase/firestore';
import TextField from '@mui/material/TextField';
import { Input } from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from "../firebase-config";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { notifyErrorCliEm, notifyUpdateCli, notifyErrorCliList } from '../components/Notify';
import CloseIcon from '@mui/icons-material/Close';
import TodoClient from '../components/TodoClient';
import Button from '@mui/material/Button';
import { supa } from '../components/utenti';
import { guid } from '../components/utenti';
import { tutti } from '../components/utenti';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { Bar } from 'react-chartjs-2';
import { optionsNumCart, optionsTotQuota, optionsNumAsc } from '../components/OptionsGrafici';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function HomePage(  ) {

  const [todos, setTodos] = React.useState([]);
  const [todosNumNote, setTodosNumNote] = React.useState([]);
  const [todosScaletta, setTodosScaletta] = React.useState([]);
  
  const [crono, setCrono] = React.useState([]);

  const [dataNumNot, setDataNumNot] = useState({
    labels: "",
    datasets: [{
      label: "Numero note",
      data: "",
    }]
  })

  const [dataTotQuota, setDataTotQuota] = useState({
    labels: "",
    datasets: [{
      label: "Numero note",
      data: "",
    }]
  })

  const [dataTotAsc, setDataTotAsc] = useState({
    labels: "",
    datasets: [{
      label: "Numero note",
      data: "",
    }]
  })

  const [flagAnaCli, setFlagAnaCli] = useState(true);   
  const [flagDelete, setFlagDelete] = useState(false);  
  const [popupActiveCrono, setPopupActiveCrono] = useState(false);  

  const [searchTerm, setSearchTerm] = useState("");  //search
  const inputRef= useRef();


  //permessi utente
  let sup= supa.includes(localStorage.getItem("uid"))
  let gui= guid.includes(localStorage.getItem("uid"))
  let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true

  let navigate = useNavigate();
   //_________________________________________________________________________________________________________________
     //confirmation notification to remove the collection
     const Msg = () => (
      <div style={{fontSize: "16px"}}>
        <p style={{marginBottom: "0px"}}>Sicuro di voler eliminare</p>
        <p style={{marginBottom: "0px"}}>(perderai tutti i dati)</p>
        <button className='buttonApply ms-4 mt-2 me-1 rounded-4' onClick={Remove}>Si</button>
        <button className='buttonClose mt-2 rounded-4'>No</button>
      </div>
    )

      const Remove = () => {
          handleDelete(localStorage.getItem("IDscal"), localStorage.getItem("NomeCliProd") );
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
      //Anagrafiche
React.useEffect(() => {
    const collectionRef = collection(db, "inOrdine");
    const q = query(collectionRef, orderBy("nomeC"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
    });
    return () => unsub();

  }, []);

  React.useEffect(() => {    //si va a prendere il numero di note nelle varie date solo le
    const collectionRef = collection(db, "ordDat");
    const q = query(collectionRef, orderBy("dataMilli"), limit(30));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodosNumNote(todosArray);
    });
    return () => unsub();
  }, []);

  React.useEffect(() => {    //se la variabile cambia allora viene eseguita questa funzione
    handleNumNot()
  }, [todosNumNote]);

  React.useEffect(() => {    //si va a prendere i dati dal database scaletta
    const collectionRef = collection(db, "scalDat");
    const q = query(collectionRef, orderBy("dataMilli"), limit(30));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodosScaletta(todosArray);
    });
    return () => unsub();
  }, []);

  React.useEffect(() => {    //se la variabile cambia allora viene eseguita questa funzione
    handleTotQuota();
    handleNumAsc();
  }, [todosScaletta]);

//**************************************************************************** */
const handleNumNot = async () => {
    setDataNumNot({
      labels: todosNumNote.map((dati) => dati.data ),
      datasets: [{
        label: "Numero Note",
        data: todosNumNote.map((dati) => dati.numeroNote ),
        backgroundColor: ["#CCB497"],
        borderColor: ["#CCB497"],
        tension: 0.0,
        pointStyle: "line"
      }]
    })
};

const handleTotQuota = async () => {
  setDataTotQuota({
    labels: todosScaletta.map((dati) => dati.data ),
    datasets: [{
      label: "Totale Quota",
      data: todosScaletta.map((dati) => dati.totalQuota ),
      backgroundColor: ["#CCB497"],
      borderColor: ["#CCB497"],
      tension: 0.0,
      pointStyle: "line"
    }]
  })
};

const handleNumAsc = async () => {
  setDataTotAsc({
    labels: todosScaletta.map((dati) => dati.data ),
    datasets: [{
      label: "Numero Asciugamani",
      data: todosScaletta.map((dati) => dati.totalAsc ),
      backgroundColor: ["#CCB497"],
      borderColor: ["#CCB497"],
      tension: 0.0,
      pointStyle: "line"
    }]
  })
};

  const handleDelete = async (id, nomeCli) => {
    const colDoc = doc(db, "clin", id); 
     
  //elimina tutti i dati di prodottoClin con lo stesso nome del Cliente     elimina tutti gli articoli di quel cliente
    const q = query(collection(db, "prodottoClin"), where("author.name", "==", localStorage.getItem("NomeCliProd")));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (hi) => {
  // doc.data() is never undefined for query doc snapshots
    console.log(hi.id, " => ", hi.data().nomeC, hi.data().dataScal);
    await deleteDoc(doc(db, "prodottoClin", hi.id)); 
    });
  //elimina la trupla debito, che ha lo stesso nome del cliente che è stato eliminato
    const p = query(collection(db, "debito"), where("nomeC", "==", nomeCli));
    const querySnapshotP = await getDocs(p);
    querySnapshotP.forEach(async (hi) => {
    await deleteDoc(doc(db, "debito", hi.id));    //elimina il documento che ha lo stesso nome
    });
    //infine elimina la data
    await deleteDoc(colDoc); 
  };

//**************************************************************************** */
//                              NICE
//********************************************************************************** */
    return ( 
    <>  
    <h1 className='title mt-3'> HomePage Supervisore</h1>
    <div>
        <span><button>In ordine</button></span>
        <span><button onClick={() => {setFlagDelete(!flagDelete)}}>elimina</button></span>
      </div>

<div className='row mt-2'>
  <div className='col'>
    <div className='grafici'>
      <Line data={dataNumNot} options={optionsNumCart}/>
    </div>
  </div>
  <div className='col'>
    <div className='grafici'>
      <Line data={dataTotQuota} options={optionsTotQuota}/>
    </div>
  </div>
  <div className='col'>
    <div className='grafici'>
      <Line data={dataTotAsc} options={optionsNumAsc}/>
    </div>
  </div>
</div>


{/********************tabella In ordine************************************************************************/}
{flagAnaCli &&
<div className='todo_containerInOrdine mt-5'>
<div className='row' > 
<div className='col-8'>
<p className='colTextTitle'> In ordine </p>
</div>
<div className='col'>
<TextField
      inputRef={inputRef}
      className="inputSearch"
      onChange={event => {setSearchTerm(event.target.value)}}
      type="text"
      placeholder="Ricerca Cliente"
      InputProps={{
      startAdornment: (
      <InputAdornment position="start">
      <SearchIcon color='secondary'/>
      </InputAdornment>
                ),
                }}
       variant="outlined"/>
</div>
</div>
<div className='row' style={{marginRight: "5px"}}>
<div className='col-4' >
<p className='coltext' >Cliente</p>
</div>
<div className='col-1' style={{padding: "0px"}}>
<p className='coltext' >Qt</p>
</div>
<div className='col-5' style={{padding: "0px"}}>
<p className='coltext' >Prodotto</p>
</div>
<div className='col-2' style={{padding: "0px"}}>
<p className='coltext' >Data Inserimento</p>
</div>
    <hr style={{margin: "0"}}/>
</div>


{todos.filter((val)=> {
        if(searchTerm === ""){
          return val
      } else if (val.nomeC.toLowerCase().includes(searchTerm.toLowerCase()) ) {
        return val
                }
            }).map((todo) => (
    <div key={todo.id}>
    <div className='row' style={{padding: "0px", marginRight: "5px"}}>
      <div className='col-4 diviCol'><p className='inpTab'>{todo.nomeC} </p> </div>
      <div className='col-1 diviCol' style={{padding: "0px"}}><p className='inpTab'>{todo.qtProdotto}</p></div>
      <div className='col-5 diviCol' style={{padding: "0px"}}><p className='inpTab'>{todo.prodottoC}</p></div>
      <div className='col-2 diviCol' style={{padding: "0px"}}><p className='inpTab'>{todo.dataC}</p></div>
      <hr style={{margin: "0"}}/>
    </div>
    </div>
  ))}

  </div>
  }   
    </>
      )
}
export default HomePage;

//questo file sta combinato insieme a todoClient