import { useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { Button, Collapse, Divider, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { RiHome8Line } from "react-icons/ri";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined"; // Added import for the dropdown arrow icon
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import { FcTodoList } from "react-icons/fc";
import { IoGrid } from "react-icons/io5";
import { FaHandsClapping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { LuUsers2 } from "react-icons/lu";
import { GrNotes } from "react-icons/gr";
import { SiGotomeeting } from "react-icons/si";
import { FaArrowRight } from "react-icons/fa";
const drawerWidth = 240;

function SideBar(props) {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isClosing, setIsClosing] = useState(false);
  const [collapseProjects, setCollapseProjects] = useState(false);
  const pendingTodos = useSelector((state) => state.reload.pendingTodos);
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

  const handleSignOut = () => {
    auth.signOut().then(() => {
      navigate("/login");
    });
  };
  const handleCollapse = () => {
    if (collapseProjects == true) {
      setCollapseProjects(false);
    } else setCollapseProjects(true);
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
        <div className="flex flex-col pl-3">
          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "500",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
            onClick={() => handleNavigate("/")}
          >
            <RiHome8Line
              style={{ color: "tomato", fontSize: "22" }}
              className="mr-4 "
            />
            Dashboard
          </Button>
          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "500",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
            onClick={(event) => handleCollapse(event)}
          >
            <BusinessCenterOutlinedIcon
              style={{ color: "lightgreen", fontSize: "22" }}
              className="mr-4"
            />
            Projects
            <span className="ml-auto">
              <IconButton size="small">
                {collapseProjects ? (
                  <ExpandMoreOutlinedIcon />
                ) : (
                  <KeyboardArrowRightOutlinedIcon />
                )}
              </IconButton>
            </span>
          </Button>

          <Collapse in={collapseProjects} timeout="auto" unmountOnExit>
            <div className="ml-8  text-[#888888]">
              <MenuItem
                style={{ fontSize: "14px" }}
                onClick={() => handleNavigate("/projects")}
              >
                Manage Projects
              </MenuItem>
              <MenuItem
                style={{ fontSize: "14px" }}
                onClick={() => handleNavigate("/projects/favourite")}
              >
                Favorite Projects
              </MenuItem>
              <MenuItem
                style={{ fontSize: "14px" }}
                onClick={() => handleNavigate("/projects/tags")}
              >
                Tags
              </MenuItem>
            </div>
          </Collapse>
          <Button
            className="flex  items-center w-full"
            style={{
              fontWeight: "500",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
            onClick={() => handleNavigate("/tasks")}
          >
            <AssignmentTurnedInOutlinedIcon
              style={{ color: "3f51b5", fontSize: "24" }}
              className="mr-4 pr-0.5 py-0.5"
            />
            Tasks
          </Button>
          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "500",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
            onClick={() => handleNavigate("/statuses")}
          >
            <IoGrid style={{ color: "" }} className="mr-5 ml-1" />
            Statuses
          </Button>

          <Button
            className="flex  items-center w-full"
            style={{
              fontWeight: "500",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
            onClick={() => handleNavigate("/todos")}
          >
            <FcTodoList
              style={{ color: "3f51b5", fontSize: "20" }}
              className="mr-4"
            />
            Todos
            {pendingTodos > 0 && (
              <p className="bg-[#fc2a2ad8] text-white ml-1 px-1.5 h-5 rounded">
                {pendingTodos}
              </p>
            )}
          </Button>
          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "500",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
            onClick={() => handleNavigate("/meetings")}
          >
            <SiGotomeeting
              style={{ fontSize: "16", color: "lightgreen" }}
              className="mr-5 "
            />
            Meetings
          </Button>
          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "500",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
            onClick={() => handleNavigate("/users")}
          >
            <LuUsers2
              style={{ color: "#6479f3", fontSize: "20" }}
              className="mr-4"
            />
            Users
          </Button>
          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "500",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
            onClick={() => handleNavigate("/clients")}
          >
            <LuUsers2
              style={{ color: "orange", fontSize: "20" }}
              className="mr-4"
            />
            Clients
          </Button>
          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "500",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
            onClick={() => handleNavigate("/notes")}
          >
            <GrNotes
              style={{ color: "3f51b5", fontSize: "16" }}
              className="mr-5"
            />
            Notes
          </Button>
          {/* <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "500",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
            onClick={() => handleNavigate("/notes")}
          >
            <FaArrowRight
              style={{ color: "red", fontSize: "16" }}
              className="mr-5"
            />
            Leave Requests
          </Button> */}
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
            <div className="flex">
              <p className="mr-3 text-gray-500 flex">
                Hi{" "}
                <FaHandsClapping className="mx-1 mt-0.5  text-[orange] mr-2" />{" "}
                Admin
              </p>
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
