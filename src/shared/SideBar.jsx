import { useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { Button, Divider, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined"; // Added import for the dropdown arrow icon
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
const drawerWidth = 240;

function SideBar(props) {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [projectsMenuAnchorEl, setProjectsMenuAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const projectsMenuOpen = Boolean(projectsMenuAnchorEl);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleNavigate = (route) => {
    navigate(route);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProjectsMenuClick = (event) => {
    setProjectsMenuAnchorEl(event.currentTarget);
  };

  const handleProjectsMenuClose = () => {
    setProjectsMenuAnchorEl(null);
  };

  const handleSignOut = () => {
    auth.signOut().then(() => {
      navigate("/login");
    });
  };

  const drawer = (
    <div>
      <img
        onClick={() => handleNavigate("/")}
        src={logo}
        alt="logo"
        style={{ cursor: "pointer" }}
      />
      <div className="mt-8 w-full">
        <div className="flex flex-col">
          <Button
            className="flex items-center w-full"
            style={{ color: "black", justifyContent: "flex-start" }}
            onClick={() => handleNavigate("/")}
          >
            <HomeOutlinedIcon style={{ color: "red" }} className="mr-4" />
            Dashboard
          </Button>
          <Button
            className="flex items-center w-full"
            style={{ color: "black", justifyContent: "flex-start" }}
            onClick={handleProjectsMenuClick}
          >
            <BusinessCenterOutlinedIcon
              style={{ color: "green" }}
              className="mr-4"
            />
            Projects
            <span className="ml-auto">
              <IconButton size="small">
                <ExpandMoreOutlinedIcon />
              </IconButton>
            </span>
          </Button>
          <Button
            className="flex items-center w-full"
            style={{ color: "black", justifyContent: "flex-start" }}
            onClick={() => handleNavigate("/")}
          >
            <AssignmentTurnedInOutlinedIcon
              style={{ color: "purple" }}
              className="mr-4"
            />
            Tasks
          </Button>
          <Menu
            anchorEl={projectsMenuAnchorEl}
            open={projectsMenuOpen}
            onClose={handleProjectsMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            PaperProps={{
              style: {
                width: "200px", // Set the width to match the button
              },
            }}
          >
            <MenuItem onClick={() => handleNavigate("/project1")}>
              Manage Projects
            </MenuItem>
            <MenuItem onClick={() => handleNavigate("/project2")}>
              Favorite Projects
            </MenuItem>
            <MenuItem onClick={() => handleNavigate("/project3")}>
              Tags
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px - 20px)` },
          left: { sm: `${drawerWidth + 10}px` },
          bgcolor: "white",
          color: "black",
        }}
      >
        <Toolbar sx={{ padding: "0 10px" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <div className="flex justify-between w-full">
            <p className="text-gray-400">Search</p>
            <div>
              {user?.photoURL ? (
                <img
                  className="w-7 h-7 shadow shadow-black rounded-full"
                  src={user?.photoURL}
                  alt="img"
                  onClick={handleMenuClick}
                />
              ) : (
                <AccountCircleIcon onClick={handleMenuClick} />
              )}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={() => handleNavigate("/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/account")}>
                  My Account
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSignOut}>
                  <Button
                    style={{ color: "tomato", border: "1px solid tomato" }}
                    size="small"
                    className="w-full"
                  >
                    Logout
                    <LogoutSharpIcon
                      style={{ fontSize: "18px", marginLeft: "10px" }}
                    />
                  </Button>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

SideBar.propTypes = {
  window: PropTypes.func,
};

export default SideBar;
