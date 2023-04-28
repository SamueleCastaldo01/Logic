import React, { useEffect, useState } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, Timestamp, query, where, orderBy, getDocs} from 'firebase/firestore';
import moment from 'moment/moment';
import { TextField } from '@mui/material';
import { auth, db } from "../firebase-config";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { notifyError, notifyErrorDat } from '../components/Notify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Button from '@mui/material/Button';
import 'moment/locale/it'
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from '@mui/icons-material/Close';
import { supa, guid, tutti } from '../components/utenti';
import MiniDrawer from '../components/MiniDrawer';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export const AutoComp1 = [];


function OrdineCliData({ getOrdId }) {
    const[colle, setColle] = useState([]); 
    const colleCollectionRef = collection(db, "ordDat");


    const timeElapsed = Date.now();  //prende la data attuale in millisecondi
    const today = new Date(timeElapsed);    //converte
    const [day, setday] = React.useState("");
    const [flagDelete, setFlagDelete] = useState(false); 

    const [popupActive, setPopupActive] = useState(true);  

    const [nome, setData] = useState("");



    moment.locale("it");

    let navigate = useNavigate();


    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true



    const auto = async () => {
      console.log("ottimo zizii");
      const q = query(collection(db, "clin"));
      const querySnapshot = await  getDocs(q);
      querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data().nomeC);

      let car = { label: doc.data().nomeC }
      AutoComp1.push(car);

      for(var i=0; i<10; i++) {
       console.log(AutoComp1[i])
      }
      });
      }
  //_________________________________________________________________________________________________________________
         const handleChangeDataSelect = (event) => {
          setday(event.target.value);      //prende il valore del select
          var ok= event.target.value
          console.log({ok})
          today.setDate(today.getDate() - ok);   //fa la differenza rispetto al valore del select sottraendo
           localStorage.setItem("bho1", today.getTime())
        };

   //_________________________________________________________________________________________________________________
    const setClear = () => {
      setData("");
      toast.dismiss();
      toast.clearWaitingQueue();}
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
          deleteCol(localStorage.getItem("ordId"), localStorage.getItem("ordDataEli") );
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
  React.useEffect(() => {
    const collectionRef = collection(db, "ordDat");
    const q = query(collectionRef, orderBy("nome", "desc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setColle(todosArray);
    });
    return () => unsub();

  }, []);
  //_________________________________________________________________________________________________________________

    const deleteCol = async (id, dat) => { //cancella tutto dalla data fino ai prodotti che fanno parte della lista
        const colDoc = doc(db, "ordDat", id); 
        const q = query(collection(db, "addNota"), where("data", "==", dat));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (hi) => {
          const p = query(collection(db, "Nota"), where("dataC", "==", dat), where("nomeC", "==", hi.data().nomeC));
          const querySnapshotp = await getDocs(p);
          querySnapshotp.forEach(async (hip) => {
            await deleteDoc(doc(db, "Nota", hip.id));  //1 elimina tutti i prodotti nella lista
          })

        await deleteDoc(doc(db, "addNota", hi.id));  //2 elimina tutti i dati di addNota della stessa data
        });
        
        await deleteDoc(colDoc); //3 infine elimina la data
    }
  //_________________________________________________________________________________________________________________
  const createCol = async (e) => {    
    e.preventDefault();  
    var formattedDate = moment(nome).format('DD-MM-YYYY');
    var bol= true
    if(!nome) {            
      notifyError();
      toast.clearWaitingQueue(); 
      return
    }
    const q = query(collection(db, "ordDat"), where("data", "==", formattedDate));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data().data);
    if (doc.data().data == formattedDate) {
         notifyErrorDat()
         toast.clearWaitingQueue(); 
        bol=false
    }
    });
    if(bol == true) {
    await addDoc(colleCollectionRef, {
      data: formattedDate,
      dataMilli: nome.getTime(),
      nome,
    });
    setClear();
    }
  };

//*************************************************************** */
//************************************************************** */
//          INTERFACE                                             /
//************************************************************** */
    return ( 
    <> 
    <h1 className='title mt-3'> Ordine Clienti</h1>
    <button onClick={() => {setFlagDelete(!flagDelete)}}>elimina</button>
{/** inserimento Data *************************************************************/}
{sup ===true && (
        <>    
{popupActive &&
  <div>  
      <form className='formSD' onSubmit={createCol}>
      <div>  <button onClick={() => { setPopupActive(false); }} type='button' className="button-close float-end mb-2" >
              <CloseIcon id="i" />
              </button>   
      </div>
      <div className="input_container">
      <Calendar onChange={setData} value={nome} />
      </div>
      <div className="btn_container">
      <Button type='submit' variant="outlined">Aggiungi la data</Button>
      </div>
    </form>
  </div> }
{!popupActive &&
  <div className="btn_container mt-5"> 
  <Button  onClick={() => { setPopupActive(true); }}  variant="outlined">Aggiungi una data</Button>
  </div>
  }
  </>
    )}
{/*************************************************************************************************** */}

            <div className="container">
              <div><ToastContainer limit={1} /></div>

              <div className="row">
                <div className="col"> <h3></h3></div>
                <div className="col">

                </div>

                <div className="col mt-4">
          
                </div>
              </div>

          <div className='todo_containerScorta' style={{width: "400px"}}>
              <div className='row'>
                      <div className='col colTextTitle'>
                       Ordine Clienti
                      </div>
                      <div className='col'>
                        <FormControl >
                        <InputLabel id="demo-simple-select-label"></InputLabel>
                        <Select sx={{height:39, marginLeft:-1, width: 200}}
                         labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        defaultValue={8}
                        onChange={handleChangeDataSelect}>
                        <MenuItem value={8}>Ultimi 7 giorni</MenuItem>
                        <MenuItem value={31}>Ultimi 30 giorni</MenuItem>
                        <MenuItem value={91}>Ultimi 90 giorni</MenuItem>
                        <MenuItem value={366}>Ultimi 365 giorni</MenuItem>
                        </Select>
                        </FormControl>
                        </div>
                    </div>

                {colle.map((col) => (
                  <div key={col.id}>
                  {col.dataMilli >= localStorage.getItem("bho1") && 
                    <>
                    <div className="diviCol" > 
                      <div className="row">

                        <div className="col-9">
                        <h3 className='inpTab' onClick={() => {
                            getOrdId(col.id, col.nome, col.data)
                            navigate("/addnota");
                            auto();
                            AutoComp1.length = 0
                            }}>{ moment(col.nome.toDate()).format("L") } &nbsp; { moment(col.nome.toDate()).format('dddd') }</h3>
                        </div>
                        <div className="col colIcon" style={{padding:"0px", marginTop:"8px"}}>  
                        <NavigateNextIcon/>          
                        </div>

                        { flagDelete &&
                        <div className="col" style={{padding:"0px", marginTop:"-8px"}}>    
                        <button
                         className="button-delete"
                         onClick={() => {
                            localStorage.setItem("ordDataEli", col.data);
                            localStorage.setItem("ordId", col.id);
                            displayMsg();
                            toast.clearWaitingQueue(); 
                            }}>
                          <DeleteIcon id="i" />
                        </button>            
                        </div>
                        }
                      </div>
                    </div>
                    <hr style={{margin: "0"}}/>

                  </>
                  }
                  </div>
                  ))}
              </div>
            </div>
           </>
      )
}
export default OrdineCliData;