import { Outlet, Navigate } from 'react-router-dom'
import { tutti } from './utenti';


export function PrivateRoutes ({isAuth})  {
    return(
        isAuth ? <Outlet/> : <Navigate to="/login"/>
    );
}

  
export function PrivateCate({scalId}) {
    return (
        scalId ? <Outlet/> : <Navigate to="/"/>
    );
}

export function PrivateOrd({ordId}) {
    return (
        ordId ? <Outlet/> : <Navigate to="/ordineclientidata"/>
    );
}

export function PrivateNota({notaId}) {
    return (
        notaId ? <Outlet/> : <Navigate to="/ordineclientidata"/>
    );
}

export function PrivateDashCli({clientId}) {
    return (
        clientId ? <Outlet/> : <Navigate to="/listaclienti"/>
    );
}

export function PrivatePerm({}) {
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true
    return (
        ta ? <Outlet/> : <Navigate to="/block"/>
    );
}