import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeIcon from '@mui/icons-material/Home';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import InventoryIcon from '@mui/icons-material/Inventory';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import { useNavigate } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import {signOut} from "firebase/auth";
  

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer( {signUserOut} ) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [auth, setAuth] = React.useState(localStorage.getItem("isAuth"))
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} color="secondary">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            
          </Typography>
      {auth && 
          <div >
            <Avatar alt="Remy Sharp" src={localStorage.getItem("profilePic")} onClick={handleMenu}/>
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
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={ () => {signUserOut(); handleClose();}}>LogOut</MenuItem>
              </Menu>
            </div>}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} 
         PaperProps={{
       sx: {
      backgroundColor: "#333",
      color: "white",
    }
  }}
      >
        <DrawerHeader>
            Liguori Srl
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon sx={{ color: "white" }}/>}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>

        <ListItem  disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/")}}>
              <ListItemButton
          selected={selectedIndex === 7}
          onClick={(event) => handleListItemClick(event, 7)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <HomeIcon sx={{ color: "white" }}/>
                </ListItemIcon>
                <ListItemText primary="HomePage" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
          </ListItem>

        <ListItem  disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/scorta")}}>
              <ListItemButton
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <InventoryIcon sx={{ color: "white" }}/>
                </ListItemIcon>
                <ListItemText primary="Magazzino" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
          </ListItem>

          <ListItem  disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/scortatinte")}}>
              <ListItemButton
          selected={selectedIndex === 8}
          onClick={(event) => handleListItemClick(event, 8)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <InvertColorsIcon sx={{ color: "white" }}/>
                </ListItemIcon>
                <ListItemText primary="Magazzino" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
          </ListItem>

        <ListItem  disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/scalettadata")}}>
              <ListItemButton
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                <FormatListNumberedIcon sx={{ color: "white" }}/>
                </ListItemIcon>
                <ListItemText primary="Scaletta" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
          </ListItem>

          <ListItem  disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/listaclienti")}}>
              <ListItemButton
                        selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <ContactPageIcon sx={{ color: "white" }}/>
                </ListItemIcon>
                <ListItemText primary="Clienti" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
          </ListItem>

          <ListItem  disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/listafornitori")}}>
              <ListItemButton
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <PersonOutlineIcon sx={{ color: "white" }}/>
                </ListItemIcon>
                <ListItemText primary="Fornitori" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
          </ListItem>

          <ListItem  disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/ordineclientidata")}}>
              <ListItemButton
                  selected={selectedIndex === 4}
                 onClick={(event) => handleListItemClick(event, 4)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <ListAltIcon sx={{ color: "white" }}/>
                </ListItemIcon>
                <ListItemText primary="Ordine Clienti" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
          </ListItem>

          <ListItem  disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/ordinefornitoridata")}}>
              <ListItemButton
                selected={selectedIndex === 5}
                 onClick={(event) => handleListItemClick(event, 5)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <ReceiptLongIcon sx={{ color: "white" }}/>
                </ListItemIcon>
                <ListItemText primary="Ordine Fornitori" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
          </ListItem>

          <ListItem  disablePadding sx={{ display: 'block' }} onClick={() => {navigate("/notadipdata")}}>
              <ListItemButton
                selected={selectedIndex === 6}
                 onClick={(event) => handleListItemClick(event, 6)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <AdUnitsIcon sx={{ color: "white" }}/>
                </ListItemIcon>
                <ListItemText primary="Nota Dip" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
          </ListItem>

        </List>

      </Drawer>

    </Box>
  );
}