import React, { useEffect, useState } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, Timestamp, query, where, orderBy, getDocs} from 'firebase/firestore';
import moment from 'moment/moment';
import { TextField } from '@mui/material';
import { auth, db } from "../firebase-config";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { notifyError, notifyErrorDat } from '../components/Notify';
import Button from '@mui/material/Button';
import 'moment/locale/it'
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from '@mui/icons-material/Close';
import { supa, guid, tutti } from '../components/utenti';

export const AutoComp1 = [];


function OrdineCliData({ getOrdId }) {
    const[colle, setColle] = useState([]); 
    const colleCollectionRef = collection(db, "ordDat"); 

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
    const setClear = () => {
      setData("");
      toast.dismiss();
      toast.clearWaitingQueue();}
   //_________________________________________________________________________________________________________________
     //confirmation notification to remove the collection
    const Msg = () => (
      <div>
        Sicuro di voler eliminare &nbsp;
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
    const q = query(collectionRef, orderBy("nome"));

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

    const deleteCol = async (id, dat) => { 
        const colDoc = doc(db, "ordDat", id); 
         
      //elimina tutti i dati di addNota della stessa data
        const q = query(collection(db, "addNota"), where("data", "==", dat));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (hi) => {
        console.log(hi.id, " => ", hi.data().nomeC, hi.data().data);
        await deleteDoc(doc(db, "addNota", hi.id)); 
        });
        //infine elimina la data
        await deleteDoc(colDoc); 
    }
  //_________________________________________________________________________________________________________________
  const createCol = async (e) => {    
    e.preventDefault();  
    var bol= true
    if(!nome) {            
      notifyError();
      toast.clearWaitingQueue(); 
      return
    }
    const q = query(collection(db, "ordDat"), where("data", "==", nome));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data().data);
    if (doc.data().data == nome) {
         notifyErrorDat()
         toast.clearWaitingQueue(); 
        bol=false
    }
    });
    if(bol == true) {
    await addDoc(colleCollectionRef, {
      data: nome,
      nome: Timestamp.fromDate(new Date(nome)),
    });
    setClear();
    }
  };

//*************************************************************** */
//************************************************************** */
//          INTERFACE                                             /
//************************************************************** */
    return ( 
    <> <div className='wrapper'>
    <h1 className='title mt-3'> Ordine Clienti</h1>
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
      <TextField type="date" className='inp' id="filled-basic" label="" variant="outlined" value={nome} 
          onChange={(e) => setData(e.target.value)}/>
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

            <div className="container">
              <div><ToastContainer limit={1} /></div>

              <div className="row">
                <div className="col"> <h3></h3></div>

                <div className="col">

                </div>

                <div className="col mt-4">
          
                </div>
              </div>

                {colle.map((col) => (
                  <div key={col.id}>
                    <>
                    <div className="divDat" > 
                      <div className="row">

                        <div className="col-9">
                        <h3 className='inpDat' onClick={() => {
                            getOrdId(col.id, col.nome, col.data)
                            navigate("/addnota");
                            auto();
                            AutoComp1.length = 0
                            }}>{ moment(col.nome.toDate()).format("L") } &nbsp; { moment(col.nome.toDate()).format('dddd') }</h3>
                        </div>

                        <div className="col">    
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

                      </div>
                    </div>
                  </>

                  </div>
                  ))}
            </div>
           </div>
           </>
      )
}
export default OrdineCliData;