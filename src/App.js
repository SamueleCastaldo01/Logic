import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import { useState, useEffect } from "react";
import { auth } from "./firebase-config"
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {signOut} from "firebase/auth";
import './App.css';
import { ToastContainer, toast, Slide } from 'react-toastify';
import AnimatedRoutes from './components/AnimatedRoutes';
import { BrowserRouter as Router, Routes, Route, Link, useLocation} from "react-router-dom";
import { styled } from "@mui/material/styles";
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";
import { BottomNavigation } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import MiniDrawer from './components/MiniDrawer';
import Box from '@mui/material/Box';
import moment from 'moment/moment';
import 'moment/locale/it'
import { guid, supa, tutti, dipen } from './components/utenti';

/*  elimina tutti i dati di una collezione
const elimDb = async () => {
  const q = query(collection(db, "prodottoClin"), where("author.name", "==", localStorage.getItem("nomeFliProd")));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (hi) => {
// doc.data() is never undefined for query doc snapshots
  console.log(hi.id, " => ", hi.data().nomeF, hi.data().dataScal);
  await deleteDoc(doc(db, "prodottoClin", hi.id)); 
  }); 
 }  
 */

function App() {

  const [value, setValue] = React.useState(0);
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

    //permessi utente
    let sup= supa.includes(localStorage.getItem("uid"))
    let gui= guid.includes(localStorage.getItem("uid"))
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true
    let dip= dipen.includes(localStorage.getItem("uid"))

  document.addEventListener("touchstart", function() {}, true);

  const timeElapsed = Date.now();  //prende la data attuale in millisecondi
  const today = new Date(timeElapsed);    //converte nel tipo data
  var formattedDate = moment(today).format('DD/MM/YYYY');  //coverte nel formato richiesto
  localStorage.setItem("today", formattedDate);
  const [todayC, setTodayC] = useState(localStorage.getItem("today"));  //variabile che andiamo ad utilizzare

  const matches = useMediaQuery('(max-width:920px)');  //media query true se è un dispositivo più piccolo del value


  const BottomNavigationAction = styled(MuiBottomNavigationAction)(`
  color: #f6f6f6;
`);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      localStorage.setItem("uid", uid);
    } else {
      // User is signed out
      // ...
    }
  });


  //______________________________________________________________________________________________________________
    //signOut
    const signUserOut = () => {
      console.log("hui")
      signOut(auth).then(() => {
        localStorage.clear();
        setIsAuth(false);
      })
    };


  return (
<>
 <Router> 
 <Box sx={{ display: 'flex', padding: "0px" }}> 

{!matches &&
  <MiniDrawer signUserOut={signUserOut}/>
}
  


    <Box component="main" sx={{ flexGrow: 1, p: 3, textAlign: "center", padding: matches ? "0px" : "24px", paddingTop: "24px" }}>
    <div><ToastContainer limit={1} /></div>

  <div style={{marginTop: !matches && "50px"}}>

    <AnimatedRoutes />
  
  </div>
    </Box>

    </Box>

    {matches &&
  <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3} >
        <BottomNavigation 
        sx={{
      bgcolor: '#333',
      '& .Mui-selected': {
      '& .MuiBottomNavigationAction-label': {
        fontSize: theme => theme.typography.caption,
        transition: 'none',
        fontWeight: 'bold',
        lineHeight: '20px'
      },
      '& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label': {
        color: theme => theme.palette.primary.main
        }}}}
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
        {sup ==true   && 
          <BottomNavigationAction
          component={Link}
          className="linq"
          to="/"
           label="Home" icon={<HomeIcon/>}/> }
        {gui ==true   && 
          <BottomNavigationAction
          component={Link}
          className="linq"
          to="/scalettadatadip"
           label="Scaletta" icon={<FormatListBulletedIcon/>}/> }
        {sup ==true   && 
          <BottomNavigationAction
          component={Link}
          className="linq"
          to="/scalettadata"
           label="Scaletta" icon={<FormatListBulletedIcon/>}/> }
        {gui ==true  && 
          <BottomNavigationAction
          component={Link}
          className="linq"
          to="/listaclientidip"
           label="Clienti" icon={<ContactPageIcon/>} /> }
        {sup ==true  && 
          <BottomNavigationAction
          component={Link}
          className="linq"
          to="/listaclienti"
           label="Clienti" icon={<ContactPageIcon/>} /> }
        {(dip ==true || sup == true) &&
          <BottomNavigationAction
          component={Link}
          className="linq"
          to="/scorta"
           label="Scorta"  icon={<InventoryIcon />} /> }
        {sup ==true  &&
          <BottomNavigationAction
           component={Link}
           className="linq"
          to="/ordineclientidata"
           label="Ordine" icon={<ShoppingCartIcon />} />}
        {dip == true &&
           <BottomNavigationAction
           component={Link}
           className="linq"
          to="/notadipdata"
           label="Nota Dip" icon={<AdUnitsIcon />} />}
        </BottomNavigation>
        
      </Paper>
 }

 </Router>


</>
  );
}

export default App;
