import React, { useEffect, useState } from 'react'
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, where, getDocs, orderBy, serverTimestamp, limit} from 'firebase/firestore';
import useMediaQuery from '@mui/material/useMediaQuery';
import moment from 'moment';
import { getCountFromServer } from 'firebase/firestore';
import { TextField } from '@mui/material';
import { db } from "../firebase-config";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { notifyErrorCli, notifyUpdateCli, notifyErrorCliEm } from '../components/Notify';
import Autocomplete from '@mui/material/Autocomplete';
import { AutoDataScal } from './AddNota';
import { supa, guid, tutti } from '../components/utenti';
import PrintIcon from '@mui/icons-material/Print';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Height } from '@mui/icons-material';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export const AutoProdCli = [];

function Row(props) {
    const { row } = props;
    const {dataSc} = props;
    const {quot} = props;
    const {noti} = props;
    const {idnote} = props;
    const [open, setOpen] = React.useState(false);
    const [Quota, setQuota] = React.useState(quot);
    const [nota, setNota] = React.useState(noti);

    const SomAsc = async () => {  //qui fa sia la somma degli asc che della quota, tramite query
        var somma=0;
        var sommaQ=0;
        var id="";
        const q = query(collection(db, "Scaletta"), where("dataScal", "==", dataSc));  //query per fare la somma quota e ASC
        const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            somma =+doc.data().numAsc + somma;
            sommaQ=+doc.data().quota +sommaQ;
            });
        
        const p = query(collection(db, "scalDat"), where("data", "==", dataSc));  //query per aggiornare la quota totale e gli asc, va a trovare l'id
        const querySnapshotp = await getDocs(p);
              querySnapshotp.forEach(async (hi) => {
               id = hi.id;
                });
        await updateDoc(doc(db, "scalDat", id), { totalQuota: sommaQ, totalAsc:somma });
      }


    const handleEditQuota = async (id) => {  //handler quando cambio la quota, aggiorna sia add nota, che mi serve per gli ordini chiusi
        await updateDoc(doc(db, "Scaletta", id), { quota:Quota});   //Aggiorna la quota nella scaletta
        await updateDoc(doc(db, "addNota", idnote), { quota:Quota});  //aggiorna addNota, questa quota mi serve perché poi va nella dashClienti
        toast.clearWaitingQueue(); 
        SomAsc();
      };
    
    const handleEditNota = async (id) => {
        await updateDoc(doc(db, "Scaletta", id), { note:nota});
        toast.clearWaitingQueue(); 
      };
  
    return (
      <React.Fragment>
      {row.dataScal  === dataSc  &&  (
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.nomeC}
          </TableCell>
          <TableCell align="right">{row.debito}</TableCell>
          <TableCell align="right"><input value={Quota}  onBlur={ handleEditQuota(row.id)} style={{textAlign:"center", padding: "0px", width:"50px", border:"none"}} 
      onChange={(event) => {
      setQuota(event.target.value);}}
    /></TableCell>
        </TableRow>
       )}
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>N.Ct</TableCell>
                      <TableCell>N. Bt</TableCell>
                      <TableCell>Asc</TableCell>
                      <TableCell>Note</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      <TableRow >
                        <TableCell component="th" scope="row">{row.NumCartoni}</TableCell>
                        <TableCell>{row.NumBuste}</TableCell>
                        <TableCell>{row.numAsc}</TableCell>
                        <TableCell style={{padding: "0px"}}> <textarea value={nota}  onBlur={ handleEditNota(row.id)} style={{ padding: "0px", width:"145px", border:"none"}} 
      onChange={(event) => {
      setNota(event.target.value);}}></textarea></TableCell>
                      </TableRow>

                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

function ScalettaDataDip({notaDat, getNotaDip }) {
 
    const [todos, setTodos] = React.useState([]);
    const [todosDataAuto, setTodosDataAuto] = React.useState([]);


    const [nomeC, setNomeC] = React.useState("");
    const [cont, setCont] = React.useState(1);
    const [flagDelete, setFlagDelete] = useState(false); 

    const [dataSc, setDataSc] = React.useState(notaDat);

    const [popupActive, setPopupActive] = useState(true);  
  
    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))   //confronto con uid corrente
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true
  
    const scalCollectionRef = collection(db, "addNota"); 
    const matches = useMediaQuery('(max-width:600px)');  //media query true se è uno smartphone
  
    let navigate = useNavigate();
  
    function handleInputChange(event, value) {
        setDataSc(value)
    }
  
  //********************************************************************************** */  
    React.useEffect(() => {
      const collectionRef = collection(db, "Scaletta");
      const q = query(collectionRef, orderBy("createdAt"));
  
      const unsub = onSnapshot(q, (querySnapshot) => {
        let todosArray = [];
        querySnapshot.forEach((doc) => {
          todosArray.push({ ...doc.data(), id: doc.id });
        });
        setTodos(todosArray);
      });
      localStorage.removeItem("OrdId");
      return () => unsub();
    }, []);

    React.useEffect(() => {  //effect per l'autocompleate, vado a prendermi le date della scaletta
        const collectionRef = collection(db, "scalDat");
        const q = query(collectionRef, orderBy("dataMilli", "desc"), limit(3));
    
        const unsub = onSnapshot(q, (querySnapshot) => {
          let todosArray = [];
          querySnapshot.forEach((doc) => {
            todosArray.push({ ...doc.data(), id: doc.id });
          });
          setTodosDataAuto(todosArray);
        });
        localStorage.removeItem("OrdId");
        return () => unsub();
      }, []);

    //**************************************************************************** */
    const actions = [
      { icon: <PrintIcon />, name: 'Stampa'},
    ];
  //**************************************************************************** */
  //                              NICE
  //********************************************************************************** */
      return ( 
      <>  
    {/**************NAVBAR MOBILE*************************************** */}
    <div className='navMobile row'>
    <div className='col-2'></div>
      <div className='col' style={{padding: 0}}>
      <p className='navText'> ScalettaDip </p>
      </div>
      <div className='col' style={{paddingRight: "20px"} }>
      <Autocomplete
      sx={{width: "180px", float: "right", marginTop:"5px"}}
        className='AutoScalDdat'
        freeSolo
      value={dataSc}
      options={todosDataAuto.map((option) => option.data)}
      onInputChange={handleInputChange}
      componentsProps={{ popper: { style: { width: 'fit-content' } } }}
      renderInput={(params) => <TextField  {...params} sx={{
        "& .MuiInputBase-root": { height: "50px" },
        "& .MuiButtonBase-root.MuiAutocomplete-clearIndicator": {  
            color: "white",
         },
         '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
    fieldset: {
              border: "1px solid white",
              borderRadius: "16px",
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            },
            input: {
                color: "#EFEFEF",
                position: "relative",
                bottom: "2.5px"
            }
          }} />}/> {/* fine autocomplete */}
      </div>
      </div>

<div  style={{padding: "0px"}}>
 {/********************Tabella con MUI***************************************** */}
 <TableContainer sx={ {marginTop: "40px", height: "43rem", bgcolor: "#EFEFEF", borderRadius: "10px", boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;"}} component={Paper}>
      <Table stickyHeader sx={{ minWidth: 200  }} aria-label="simple table">
        <TableHead>
        <TableRow align="left">
        <span>

        </span>
        </TableRow>
          <TableRow>
          <TableCell />
            <TableCell><span className='coltext'>Cliente</span></TableCell>
            <TableCell align="right"><span className='coltext'>Debito(€)</span></TableCell>
            <TableCell align="right"><span className='coltext'>Quota(€)</span></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todos.map((row) => (
            <Row key={row.id} row={row} dataSc={dataSc} quot={row.quota} noti={row.note} idnote={row.idNota} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>


</div>
      </>
      
        )
  }
export default ScalettaDataDip;