import { useState, useContext, useEffect } from 'react';
import './navbar.scss';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';  //https://mui.com/material-ui/react-menu/
import MenuItem from '@mui/material/MenuItem';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import Settings from '@mui/icons-material/Settings';
import Person from '@mui/icons-material/Person';
import { AuthContext } from '../../contextApi/AuthContext';
import { NotificationContext } from '../../contextApi/NotificationContext';
import { Button, IconButton, Badge, ListItemText } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

// import io from 'socket.io-client';
// import { backendUrl } from '../../config';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const { logout } = useContext(AuthContext);
  //track number of notification
  const { notificationCount, notificationEvents, markAsRead, markAllAsRead } = useContext(NotificationContext);
  const navigate = useNavigate();


  // const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchorEl);
  const profileOpen = Boolean(profileAnchorEl);


  const handleNotificationIconMenuClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };


  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setNotificationAnchorEl(null);
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleSettings = () => {
    handleClose();
    navigate('/settings');
  };


  //read invididual notification event
  const handleNotificationClick = (index) => {
    markAsRead(index);

  };



  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Finance Tracker</span>
        </Link>
      </div>

      <div className="right">

        <IconButton color="inherit" onClick={handleNotificationIconMenuClick}>
          <Badge badgeContent={notificationCount} color="primary">
            <NotificationsOutlinedIcon className="icon-cls" style={{ marginRight: "-7px" }} />

          </Badge>
        </IconButton>

        <div className="leftRight" onClick={handleProfileClick}>
          <PersonOutlinedIcon className="icon-cls" />
        </div>

        <Menu anchorEl={notificationAnchorEl} open={notificationOpen} onClose={handleClose}>

          {notificationEvents.length > 0 ? (
            [
              notificationEvents.map((event, index) => (
                <MenuItem key={index} onClick={() => handleNotificationClick(index)}>
                  <ListItemIcon>
                    <NotificationsActiveIcon />
                  </ListItemIcon>
                  <ListItemText primary={event.message} />
                </MenuItem>
              )),
              <MenuItem onClick={markAllAsRead}>
                <ListItemText secondary="Mark all as read" align="center" />
              </MenuItem>
            ]
          ) : (
            <MenuItem disabled>

              <ListItemText primary="No notifications" />
            </MenuItem>
          )}
        </Menu>


        <Menu anchorEl={profileAnchorEl} open={profileOpen} onClose={handleClose} >

          <MenuItem onClick={handleProfile}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>

          <MenuItem onClick={handleSettings}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>


          {/* {goalsReached.map((goal, index) => (
            <MenuItem key={index} onClick={handleClose}>
              {goal}
            </MenuItem>
          ))} */}

        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
