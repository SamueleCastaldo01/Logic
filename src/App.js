import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import { useState, useEffect } from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { auth } from "./firebase-config"
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {signOut} from "firebase/auth";
import './App.css';
import Page_per from './pages/Page_per';
import Login from "./pages/Login";
import ScaletData from './pages/ScaletData';
import Scalet from './pages/Scalet';
import AddCliente from './pages/AddCliente';
import OrdineCliData from './pages/OrdineCliData';
import AddNota from './pages/AddNota';
import Nota from './pages/Nota';
import DashClienti from './pages/DashboardClienti';
import Scorta from './pages/Scorta';
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import {PrivateRoutes, PrivateCate, PrivatePerm, PrivateDashCli, PrivateOrd, PrivateNota} from './components/PrivateRoutes';
import { styled } from "@mui/material/styles";
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";




function App() {
  const [value, setValue] = React.useState(0);
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  const matches = useMediaQuery('(max-width:920px)');  //media query true se è uno smartphone

  const [uid, setUid] = useState(localStorage.getItem("uid"));
  const [scalId, setScalId] = useState(localStorage.getItem("scalId")); //id della data della scaletta
  const [dataScal, setDataScal] = useState(localStorage.getItem("dataScal")); //Prende la data di quel id
  const [dateEli, setDateEli] = useState(localStorage.getItem("dataEli"));

  const [clientId, setClientId] = useState(localStorage.getItem("clientId")); //id cliente
  const [nomeCli, setNomeCli] = useState(localStorage.getItem("nomeCli")); //Prende la data di quel id

  const [ordId, setOrdId] = useState(localStorage.getItem("OrdId")); //Prende la data di quel id
  const [dataOrd, setDataOrd] = useState(localStorage.getItem("dataOrd")); //Prende la data di quel id
  const [dataOrdConf, setDataOrdConf] = useState(localStorage.getItem("dataOrdConfronto"));

  const [notaId, setNotaId] = useState(localStorage.getItem("NotaId")); //Prende la data di quel id
  const [notaCont, setNotaCont] = useState(localStorage.getItem("NotaCon")); //Prende la data di quel id
  const [notaNomeC, setNotaNomeC] = useState(localStorage.getItem("NotaNomeC")); //Prende la data di quel id
  const [notaDataV, setNotaDataV] = useState(localStorage.getItem("NotaDataV"));
  const [notaDataC, setNotaDataC] = useState(localStorage.getItem("NotaDataC"));
  const [numCartoni, setNumCartoni] = useState(localStorage.getItem("NumCartNota"));
  const [sommaTotale, setSommaTotale] = useState(localStorage.getItem("sommaTotNota"));
  const [debitoRes, setDebitoRes] = useState(localStorage.getItem("debitRes"));
  const [debitoTot, setDebitoTot] = useState(localStorage.getItem("debitTot"));


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

  const getOrderIdHandler = (id, nome, data) => {
    localStorage.setItem("OrdId", id); //save the value locally
    localStorage.setItem("dataOrd", nome); 
    localStorage.setItem("dataOrdConfronto", data); 
    setOrdId(id);
    setDataOrd(nome);
    setDataOrdConf(data);
  };

  const getNotadHandler = (id, cont, nome, datav, datac, numCart, sommaTot, debiResi, debiTot ) => {
    localStorage.setItem("NotaId", id); 
    localStorage.setItem("NotaCon", cont); //save the value locally
    localStorage.setItem("NotaNomeC", nome); 
    localStorage.setItem("NotaDataV", datav); 
    localStorage.setItem("NotaDataC", datac); 
    localStorage.setItem("NumCartNota", numCart); 
    localStorage.setItem("sommaTotNota", sommaTot); 
    localStorage.setItem("debitRes", debiResi); 
    localStorage.setItem("debitTot", debiTot); 
    setNotaId(id);
    setNotaCont(cont);
    setNotaNomeC(nome);
    setNotaDataV(datav);
    setNotaDataC(datac);
    setNumCartoni(numCart);
    setSommaTotale(sommaTot);
    setDebitoRes(debiResi);
    setDebitoTot(debiTot);
  };
  //______________________________________________________________________________________________________________
    //signOut
    const signUserOut = () => {
      signOut(auth).then(() => {
        localStorage.clear();
        setIsAuth(false);
      })
    };


  return (
<>


 <Router>
 {!matches?
 <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Container>
      <Navbar.Brand > <Link className='linq ' to="/">Liguori Srl</Link> </Navbar.Brand>
      <Navbar.Brand > <Link className='linq ' to="/">Scaletta</Link> </Navbar.Brand>
      <Navbar.Brand > <Link className='linq ' to="/listaclienti">Clienti</Link> </Navbar.Brand>
      <Navbar.Brand > <Link className='linq ' to="/scorta">Scorta</Link> </Navbar.Brand>
      <Navbar.Brand > <Link className='linq ' to="/ordineclientidata">Ordine</Link> </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
        </Nav>
        <Nav>
        
        {isAuth  && <Nav.Link onClick={signUserOut}> <Link className='linq text-white-50' to="/login">Log Out</Link> </Nav.Link>}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar> : 
  <div className="row navb">
  <div className="col" style={{padding: "0px"}}>
      <h5 style={{paddingTop: "20px", paddingLeft: "18px", color:"white"}}>Liguori Srl</h5>
      </div>
      <div className="col-8" style={{padding: "0px"}}>
      </div>
  </div>
  }
  <Routes>
  <Route element={<PrivateRoutes isAuth={isAuth}/>}>
  <Route element={<PrivatePerm/>}>
    <Route path="/listaclienti" element={<AddCliente getCliId={getCliIdHandler}/>} />
    <Route path="/scorta" element={<Scorta />} />
    <Route path="/" element={<ScaletData getColId={getColIdHandler}/>} />
    <Route path="/ordineclientidata" element={<OrdineCliData getOrdId={getOrderIdHandler}/>} />
    
    <Route element={<PrivateDashCli clientId={clientId}/>}>
    <Route path="/dashclienti" element={<DashClienti clientId={clientId} nomeCli={nomeCli}/>} />
    </Route>

    <Route element={<PrivateCate scalId={scalId}/>}>
      <Route path="/scaletta" element={<Scalet scalId={scalId} dataScal={dataScal} dateEli={dateEli}/>} />
    </Route>

    <Route element={<PrivateOrd ordId={ordId}/>}>
      <Route path="/addnota" element={<AddNota ordId={ordId} dataOrd={dataOrd} dataOrdConf={dataOrdConf} getNotaId={getNotadHandler}/>} />
    </Route>

    <Route element={<PrivateNota notaId={notaId}/>}>
    <Route path="/nota" element={<Nota notaId={notaId} cont={notaCont} nomeCli={notaNomeC} dataNota={notaDataV} dataNotaC={notaDataC} numCart={numCartoni} prezzoTotNota={sommaTotale} debit={debitoRes} debTo={debitoTot}/>} />
    </Route>

  </Route>
  </Route>

  <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
  <Route path="/block" element={<Page_per/>} />

  {isAuth ? <Route path="*" element={<Page_per /> }/> :
            <Route path="*" element={<Login setIsAuth={setIsAuth} />}/>    }
  </Routes>


 {matches &&
  <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3} >
        <BottomNavigation 
        sx={{
      bgcolor: '#212529',
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
          to="/"
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
        </BottomNavigation>
      </Paper>
 }







 </Router>

</>
  );
}

export default App;
