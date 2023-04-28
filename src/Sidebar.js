import React from "react";
import { 
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarSubMenu,
  CDBIcon,
  CDBSidebarMenuItem } from "cdbreact";
import { NavLink } from "react-router-dom";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import InventoryIcon from '@mui/icons-material/Inventory';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Sidebar = () => {

  return (
    <div
      className={`app`}
      style={{ display: "flex", height: "100%", overflow:"scroll initial"}}
    >
      <CDBSidebar
        textColor="#fff"
        backgroundColor="#333"
      >
        <CDBSidebarHeader
          prefix={
            <i className="fa fa-bars fa-large"></i>
          }
        >
          <a href="/" className="text-decoration-none" style={{color:"inherit"}}>
            Liguori Srl
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink
              exact
              to="/"
              activeClassName="activeClicked"
            >
              <CDBSidebarMenuItem
                icon="sticky-note"
              >
               <FormatListBulletedIcon fontSize="medium" className="me-3" />
                Scaletta
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink
              exact
              to="/listaclienti"
              activeClassName="activeClicked"
            >
              <CDBSidebarMenuItem>
              <ContactPageIcon fontSize="medium" className="me-3" />
                Clienti
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink
              exact
              to="/listafornitori"
              activeClassName="activeClicked"
            >
              <CDBSidebarMenuItem
                icon="user"
              >
                Fornitori
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink
              exact
              to="/ordinefornitoridata"
              activeClassName="activeClicked"
            >
              <CDBSidebarMenuItem icon="sticky-note">
                Ordine Fornitori
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink
              exact
              to="/scorta"
              activeClassName="activeClicked"
            >
              <CDBSidebarMenuItem>
              <InventoryIcon fontSize="medium" className="me-3" />
                Magazzino
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink
              exact
              to="/ordineclientidata"
              activeClassName="activeClicked"
            >
              <CDBSidebarMenuItem icon="sticky-note">
                Ordine Clienti
              </CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
          <CDBSidebarMenu>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: "center" }}>
          <div
            className="sidebar-btn-wrapper"
            style={{
              padding: "20px 5px"
            }}
          >
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
}

export default Sidebar;
