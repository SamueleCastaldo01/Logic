import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import { useState, useEffect } from "react";
import { auth } from "./firebase-config"
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {signOut} from "firebase/auth";
import './App.css';
import Page_per from './pages/Page_per';
import Login from "./pages/Login";
import HomePage from './pages/HomePage';
import { ToastContainer, toast, Slide } from 'react-toastify';
import ScaletData from './pages/ScaletData';
import Scalet from './pages/Scalet';
import AddCliente from './pages/AddCliente';
import AddFornitori from './pages/AddFornitori';
import OrdineCliData from './pages/OrdineCliData'
import OrdineForniData from './pages/OrdineForniData';
import AddNota from './pages/AddNota';
import AddClienteScalet from './pages/AddClienteScalet';
import NotaDipData from './pages/NotaDipData';
import NotaDip from './pages/NotaDip';
import AddNotaForni from './pages/AddNotaForn';
import Nota from './pages/Nota';
import NotaForni from './pages/NotaForni';
import DashClienti from './pages/DashboardClienti';
import DashFornitori from './pages/DashboardFornitori';
import Scorta from './pages/Scorta';
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import {PrivateRoutes, PrivateCate, PrivatePerm, PrivateDashCli, PrivateOrd, PrivateOrdForn, PrivateNota, PrivateNotaForni, PrivateDashForn, PrivateAddClientiScalet} from './components/PrivateRoutes';
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
import CheckConnection from './components/CheckConnection';
import { Detector } from 'react-detect-offline';
import moment from 'moment/moment';
import 'moment/locale/it'

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
 const polling = {
  enabled: true,
  interval: 500,
  timeout: 10000
};

function App() {
  const [value, setValue] = React.useState(0);
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  document.addEventListener("touchstart", function() {}, true);

  const timeElapsed = Date.now();  //prende la data attuale in millisecondi
  const today = new Date(timeElapsed);    //converte nel tipo data
  var formattedDate = moment(today).format('DD/MM/YYYY');  //coverte nel formato richiesto
  localStorage.setItem("today", formattedDate);
  const [todayC, setTodayC] = useState(localStorage.getItem("today"));  //variabile che andiamo ad utilizzare


  const matches = useMediaQuery('(max-width:920px)');  //media query true se è uno smartphone

  const [uid, setUid] = useState(localStorage.getItem("uid"));
  const [scalId, setScalId] = useState(localStorage.getItem("scalId")); //id della data della scaletta
  const [dataScal, setDataScal] = useState(localStorage.getItem("dataScal")); 
  const [dateEli, setDateEli] = useState(localStorage.getItem("dataEli"));

  const [clientId, setClientId] = useState(localStorage.getItem("clientId")); //id cliente
  const [nomeCli, setNomeCli] = useState(localStorage.getItem("nomeCli")); 

  const [fornId, setFornId] = useState(localStorage.getItem("fornId")); //id cliente
  const [nomeForn, setNomeForn] = useState(localStorage.getItem("nomeForn")); 

  const [ordId, setOrdId] = useState(localStorage.getItem("OrdId")); 
  const [dataOrd, setDataOrd] = useState(localStorage.getItem("dataOrd")); 
  const [dataOrdConf, setDataOrdConf] = useState(localStorage.getItem("dataOrdConfronto"));

  const [ordFornId, setOrdFornId] = useState(localStorage.getItem("OrdFornId")); 
  const [dataOrdForn, setDataOrdForn] = useState(localStorage.getItem("dataOrdForn")); 
  const [dataOrdFornConf, setDataOrdFornConf] = useState(localStorage.getItem("dataOrdFornConfronto"));

  const [notaId, setNotaId] = useState(localStorage.getItem("NotaId")); 
  const [notaCont, setNotaCont] = useState(localStorage.getItem("NotaCon")); 
  const [notaNomeC, setNotaNomeC] = useState(localStorage.getItem("NotaNomeC")); 
  const [notaDataV, setNotaDataV] = useState(localStorage.getItem("NotaDataV"));
  const [notaDataC, setNotaDataC] = useState(localStorage.getItem("NotaDataC"));
  const [numCartoni, setNumCartoni] = useState(localStorage.getItem("NumCartNota"));
  const [sommaTotale, setSommaTotale] = useState(localStorage.getItem("sommaTotNota"));
  const [debitoRes, setDebitoRes] = useState(localStorage.getItem("debitRes"));
  const [debitoTot, setDebitoTot] = useState(localStorage.getItem("debitTot"));
  const [notaIndi, setNotaIndi] = useState(localStorage.getItem("notaIndi"));
  const [notaTel, setNotaTel] = useState(localStorage.getItem("notaTel"));
  const [notaIva, setNotaIva] = useState(localStorage.getItem("notaIva"));
  const [notaCompleta, setNotaCompleta] = useState(localStorage.getItem("notaCompleta"));

  const [notaDipId, setNotaDipId] = useState(localStorage.getItem("notaDipId"));
  const [notaDipCont, setNotaDipCont] = useState(localStorage.getItem("notaDipCon"));
  const [notaDipNomeC, setNotaDipNomeC] = useState(localStorage.getItem("notaDipNomeC"));  
  const [notaDipDataC, setNotaDipDataC] = useState(localStorage.getItem("notaDipDataC"));
  const [NumCartNotaDip, setNumCartoniDip] = useState(localStorage.getItem("NumCartNotaDip"));

  const [notaFornId, setNotaFornId] = useState(localStorage.getItem("NotaFornId")); 
  const [notaFornNomeF, setNotaFornNomeF] = useState(localStorage.getItem("notaFornNomeF")); 
  const [notaFornDataV, setNotaFornDataV] = useState(localStorage.getItem("NotaFornDataV"));
  const [notaFornDataC, setNotaFornDataC] = useState(localStorage.getItem("notaFornDataC"));

  const [notaDat, setNotaDat] = useState(localStorage.getItem("notaDat"));

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

  function refreshPage() {
    window.location.reload(false);
  }

  const getColIdHandler = (id, data, datEl) => {
    localStorage.setItem("scalId", id); //save the value locally
    localStorage.setItem("dataScal", data); 
    localStorage.setItem("dataEli", datEl); 
    setScalId(id);
    setDataScal(data);
    setDateEli(datEl);
  };

  const getCliIdHandler = (id, nome) => {
    localStorage.setItem("clientId", id); //save the value locally
    localStorage.setItem("nomeCli", nome); 
    setClientId(id);
    setNomeCli(nome);
  };

  const getFornIdHandler = (id, nome) => {
    localStorage.setItem("fornId", id); //save the value locally
    localStorage.setItem("nomeForn", nome); 
    setFornId(id);
    setNomeForn(nome);
  }

  const getOrderIdHandler = (id, nome, data) => {
    localStorage.setItem("OrdId", id); //save the value locally
    localStorage.setItem("dataOrd", nome); 
    localStorage.setItem("dataOrdConfronto", data); 
    setOrdId(id);
    setDataOrd(nome);
    setDataOrdConf(data);
  };

  const getOrderFornIdHandler = (id, nome, data) => {
    localStorage.setItem("OrdFornId", id); //save the value locally
    localStorage.setItem("dataOrdForn", nome); 
    localStorage.setItem("dataOrdFornConfronto", data); 
    setOrdFornId(id);
    setDataOrdForn(nome);
    setDataOrdFornConf(data);
  };

  const getNotadHandler = (id, cont, nome, datav, datac, numCart, sommaTot, debiResi, debiTot, indi, tel, iva, comp) => {
    localStorage.setItem("NotaId", id); 
    localStorage.setItem("NotaCon", cont); //save the value locally
    localStorage.setItem("NotaNomeC", nome); 
    localStorage.setItem("NotaDataV", datav); 
    localStorage.setItem("NotaDataC", datac); 
    localStorage.setItem("NumCartNota", numCart); 
    localStorage.setItem("sommaTotNota", sommaTot); 
    localStorage.setItem("debitRes", debiResi); 
    localStorage.setItem("debitTot", debiTot);
    localStorage.setItem("notaIndi", indi);  
    localStorage.setItem("notaTel", tel); 
    localStorage.setItem("notaIva", iva); 
    localStorage.setItem("notaCompleta", comp);
    console.log({comp})
    setNotaId(id);
    setNotaCont(cont);
    setNotaNomeC(nome);
    setNotaDataV(datav);
    setNotaDataC(datac);
    setNumCartoni(numCart);
    setSommaTotale(sommaTot);
    setDebitoRes(debiResi);
    setDebitoTot(debiTot);
    setNotaIndi(indi);
    setNotaTel(tel);
    setNotaIva(iva);
    setNotaCompleta(comp)
  };

  const getNotaDipHandler = (id, cont, nome, datac, nuCat) => {
    localStorage.setItem("notaDipId", id);
    localStorage.setItem("notaDipContC", cont);
    localStorage.setItem("notaDipNomeC", nome);
    localStorage.setItem("notaDipDataC", datac);
    localStorage.setItem("NumCartNotaDip", nuCat); 
    setNotaDipId(id);
    setNotaDipCont(cont);
    setNotaDipNomeC(nome);
    setNotaDipDataC(datac);
    setNumCartoniDip(nuCat);
  }

  const getNotafornHandler = (id, nome, datav, datac) => {
    localStorage.setItem("NotaFornId", id);
    localStorage.setItem("notaFornNomeF", nome);
    localStorage.setItem("NotaFornDataV", datav); 
    localStorage.setItem("NotaFornDataC", datac); 
    setNotaFornId(id);
    setNotaFornNomeF(nome);
    setNotaFornDataV(datav);
    setNotaFornDataC(datac);
  }

  const getNotaDataScalHandler = (data) => {
    localStorage.setItem("notaDat", data);
    setNotaDat(data);
  }

  const getDataScalHandler = (data) => {
    localStorage.setItem("dataScal", data);
    setDateEli(data);
  }
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
  


    <Box component="main" sx={{ flexGrow: 1, p: 3, textAlign: "center" }}>
    <div><ToastContainer limit={1} /></div>

<div style={{marginTop: !matches && "50px"}}>


      <Routes>
  <Route element={<PrivateRoutes isAuth={isAuth}/>}>
  <Route element={<PrivatePerm/>}>
  <Route path="/" element={<HomePage />} />
    <Route path="/listaclienti" element={<AddCliente getCliId={getCliIdHandler}/>} />
    <Route path="/scorta" element={<Scorta />} />
    <Route path="/listafornitori" element={<AddFornitori getFornId={getFornIdHandler}/>} />
    <Route path="/scalettadata" element={<ScaletData getColId={getColIdHandler}/>} />
    <Route path="/ordineclientidata" element={<OrdineCliData getOrdId={getOrderIdHandler}/>} />
    <Route path="/ordinefornitoridata" element={<OrdineForniData getOrdFornId={getOrderFornIdHandler}/>} />
    <Route path="/notadipdata" element={<NotaDipData notaDat={todayC} getNotaDip={getNotaDipHandler}/>} />
    <Route path="/notadip" element={<NotaDip notaDipId={notaDipId} notaDipCont={notaDipCont} notaDipNome={notaDipNomeC} notaDipDataC={notaDipDataC} numCart={NumCartNotaDip}/>} />
    
    <Route element={<PrivateDashCli clientId={clientId}/>}>
    <Route path="/dashclienti" element={<DashClienti clientId={clientId} nomeCli={nomeCli}/>} />
    </Route>

    <Route element={<PrivateDashForn fornId={fornId}/>}>
    <Route path="/dashfornitore" element={<DashFornitori fornId={fornId} nomeForn={nomeForn}/>} />
    </Route>

    <Route element={<PrivateCate dataScal={dataScal}/>}>
      <Route path="/scaletta" element={<Scalet  dateEli={dateEli}/>} />
    </Route>

    <Route element={<PrivateAddClientiScalet notaDat={notaDat}/>}>
      <Route path="/addclientescaletta" element={<AddClienteScalet notaDat={notaDat} getDataScal={getDataScalHandler}/>} />
    </Route>

    <Route element={<PrivateOrd ordId={ordId}/>}>
      <Route path="/addnota" element={<AddNota ordId={ordId} dataOrd={dataOrd} dataOrdConf={dataOrdConf} getNotaId={getNotadHandler} getNotaDataScal={getNotaDataScalHandler}/>} />
    </Route>

    <Route element={<PrivateOrdForn ordFornId={ordFornId}/>}>
      <Route path="/addnotaforn" element={<AddNotaForni ordId={ordFornId} dataOrd={dataOrdForn} dataOrdConf={dataOrdFornConf} getNotaForniId={getNotafornHandler}/>} />
    </Route>

    <Route element={<PrivateNota notaId={notaId}/>}>
    <Route path="/nota" element={<Nota notaId={notaId} cont={notaCont} nomeCli={notaNomeC} dataNota={notaDataV} dataNotaC={notaDataC} numCart={numCartoni} prezzoTotNota={sommaTotale} debit={debitoRes} debTo={debitoTot} indirizzo={notaIndi} tel={notaTel} iva={notaIva} completa={notaCompleta}/>} />
    </Route>

    <Route element={<PrivateNotaForni notaFornId={notaFornId}/>}>
    <Route path="/notaforni" element={<NotaForni notaId={notaFornId} nomeForni={notaFornNomeF} dataNota={notaFornDataV} dataNotaC={notaFornDataC} />} />
    </Route>

  </Route>
  </Route>
  <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
  <Route path="/block" element={<Page_per/>} />

  {isAuth ? <Route path="*" element={<Page_per /> }/> :
            <Route path="*" element={<Login setIsAuth={setIsAuth} />}/>    }
  </Routes>
  

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
          <BottomNavigationAction
          component={Link}
          className="linq"
          to="/scalettadata"
           label="Scaletta" icon={<FormatListBulletedIcon/>}/>
          <BottomNavigationAction
          component={Link}
          className="linq"
          to="/listaclienti"
           label="Clienti" icon={<ContactPageIcon/>} />
          <BottomNavigationAction
          component={Link}
          className="linq"
          to="/scorta"
           label="Scorta"  icon={<InventoryIcon />} />
          <BottomNavigationAction
           component={Link}
           className="linq"
          to="/ordineclientidata"
           label="Ordine" icon={<ShoppingCartIcon />} />
           <BottomNavigationAction
           component={Link}
           className="linq"
          to="/notadipdata"
           label="Nota Dip" icon={<AdUnitsIcon />} />
        </BottomNavigation>
        
      </Paper>
 }

 </Router>


</>
  );
}

export default App;
