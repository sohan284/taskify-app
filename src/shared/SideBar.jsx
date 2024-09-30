import { useEffect, useState } from "react";
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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import { FcTodoList } from "react-icons/fc";
import { IoGrid, IoSettingsOutline } from "react-icons/io5";
import { FaHandsClapping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { LuUsers2 } from "react-icons/lu";
import { GrNotes } from "react-icons/gr";
import { SiGotomeeting } from "react-icons/si";
import UserManagement from "../service/User";
import { useAuth } from "../context/AuthContext";
import { FaArrowUp, FaRegUser } from "react-icons/fa";
import LanguageButton from "./LanguageButton";
import { useTranslation } from "react-i18next";
import { BiChat, BiLineChart } from "react-icons/bi";
const drawerWidth = 240;

function SideBar(props) {
  const { t } = useTranslation();
  const { userEmail, userRole } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isClosing, setIsClosing] = useState(false);
  const [collapseProjects, setCollapseProjects] = useState(false);
  const pendingTodos = useSelector((state) => state.reload.pendingTodos);
  const [userId, setUserId] = useState(null);
  let usertype = userRole === "client" ? "client" : "";

  useEffect(() => {
    UserManagement.getUserList(usertype).then((res) => {
      const foundUser = res.data.find((u) => u.email === userEmail);
      if (foundUser) {
        setUserId(foundUser._id);
        setUser(foundUser);
      }
    });
  }, [userEmail, usertype]);

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
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleCollapse = () => {
    setCollapseProjects(!collapseProjects);
  };

  const drawer = (
    <div>
      <img
        onClick={() => handleNavigate("/")}
        src={logo}
        alt="logo"
        style={{ cursor: "pointer" }}
      />
      <div className="bg-[#6479f3] mx-1 rounded text-white text-center py-2 mt-2 shadow-lg">
        <p className="inline">{t("mainWorkSpace")}</p>
        <KeyboardArrowRightOutlinedIcon />
      </div>
      <div className="mt-5 w-full">
        <div className="flex flex-col pl-3">
          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "400",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
              fontSize: "15px",
            }}
            onClick={() => {
              handleNavigate("/"), handleDrawerClose();
            }}
          >
            <RiHome8Line
              style={{ color: "tomato", fontSize: "22" }}
              className="mr-4"
            />
            {t("dashboard")}
          </Button>
          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "400",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
              fontSize: "15px",
            }}
            onClick={handleCollapse}
          >
            <BusinessCenterOutlinedIcon
              style={{ color: "lightgreen", fontSize: "22" }}
              className="mr-4"
            />
            {t("projects")}
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
            <div className="ml-8 text-[#888888]">
              <MenuItem
                style={{ fontSize: "14px" }}
                onClick={() => {
                  handleNavigate("/projects"), handleDrawerClose();
                }}
              >
                {t("manageProjects")}
              </MenuItem>
              <MenuItem
                style={{ fontSize: "14px" }}
                onClick={() => {
                  handleNavigate("/projects/favourite"), handleDrawerClose();
                }}
              >
                {t("favoriteProjects")}
              </MenuItem>
              <MenuItem
                style={{ fontSize: "14px" }}
                onClick={() => {
                  handleNavigate("/projects/tags"), handleDrawerClose();
                }}
              >
                {t("tags")}
              </MenuItem>
            </div>
          </Collapse>

          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "400",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
              fontSize: "15px",
            }}
            onClick={() => {
              handleNavigate("/tasks"), handleDrawerClose();
            }}
          >
            <AssignmentTurnedInOutlinedIcon
              style={{ color: "3f51b5", fontSize: "24" }}
              className="mr-4 pr-0.5 py-0.5"
            />
            {t("tasks")}
          </Button>
          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "400",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
              fontSize: "15px",
            }}
            onClick={() => {
              handleNavigate("/statuses"), handleDrawerClose();
            }}
          >
            <IoGrid className="mr-5 ml-1" />
            {t("statuses")}
          </Button>
          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "400",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
              fontSize: "15px",
            }}
            onClick={() => {
              handleNavigate("/priorities"), handleDrawerClose();
            }}
          >
            <FaArrowUp className="mr-5 ml-1" style={{ color: "lightgreen" }} />
            {t("priorities")}
          </Button>
          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "400",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
              fontSize: "15px",
            }}
            onClick={() => {
              handleNavigate("/chat"), handleDrawerClose();
            }}
          >
            <BiChat
              className="mr-5"
              style={{ color: "orange", fontSize: "18" }}
            />
            {t("chat")}
          </Button>
          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "400",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
              fontSize: "15px",
            }}
            onClick={() => {
              handleNavigate("/todos"), handleDrawerClose();
            }}
          >
            <FcTodoList
              style={{ color: "3f51b5", fontSize: "20" }}
              className="mr-4"
            />
            {t("todos")}
            {pendingTodos > 0 && (
              <p className="bg-[#fc2a2ad8] text-white ml-1 px-1.5 h-5 rounded">
                {pendingTodos}
              </p>
            )}
          </Button>
          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "400",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
              fontSize: "15px",
            }}
            onClick={() => {
              handleNavigate("/meetings"), handleDrawerClose();
            }}
          >
            <SiGotomeeting className="mr-5" style={{ color: "lightgreen" }} />
            {t("meetings")}
          </Button>
          {userRole === "admin" && (
            <Button
              className="flex items-center w-full"
              style={{
                fontWeight: "400",
                color: "#888888",
                justifyContent: "flex-start",
                textTransform: "none",
                fontSize: "15px",
              }}
              onClick={() => {
                handleNavigate("/users"), handleDrawerClose();
              }}
            >
              <LuUsers2
                style={{ color: "#6479f3", fontSize: "20" }}
                className="mr-4"
              />
              {t("users")}
            </Button>
          )}
          {userRole === "admin" && (
            <Button
              className="flex items-center w-full"
              style={{
                fontWeight: "400",
                color: "#888888",
                justifyContent: "flex-start",
                textTransform: "none",
                fontSize: "15px",
              }}
              onClick={() => {
                handleNavigate("/clients"), handleDrawerClose();
              }}
            >
              <LuUsers2
                style={{ color: "orange", fontSize: "20" }}
                className="mr-4"
              />
              {t("clients")}
            </Button>
          )}
          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "400",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
              fontSize: "15px",
            }}
            onClick={() => {
              handleNavigate("/notes"), handleDrawerClose();
            }}
          >
            <GrNotes className="mr-5" />
            {t("notes")}
          </Button>
          <Button
            className="flex items-center w-full"
            style={{
              fontWeight: "400",
              color: "#888888",
              justifyContent: "flex-start",
              textTransform: "none",
              fontSize: "15px",
            }}
            onClick={() => {
              handleNavigate("/activity-log"), handleDrawerClose();
            }}
          >
            <BiLineChart
              style={{ color: "orange", fontSize: "18" }}
              className="mr-4"
            />
            {t("activity log")}
          </Button>
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
            <p className="text-gray-400">{t("search")}</p>
            <div className="flex">
              <LanguageButton />
              <p className="mr-3 mt-1.5 text-gray-500 flex">
                {t("hi")}{" "}
                <FaHandsClapping className="mx-1 mt-0.5 text-[orange] mr-2" />
                <p className="uppercase">{userRole}</p>
              </p>
              {user?.photoURL ? (
                <img
                  className="w-7 h-7 shadow shadow-black rounded-full"
                  src={user?.photoURL}
                  alt="img"
                  onClick={handleMenuClick}
                />
              ) : (
                <AccountCircleIcon
                  style={{ fontSize: "32px" }}
                  onClick={handleMenuClick}
                />
              )}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  style: {
                    width: "200px",
                    paddingBlock: "10px",
                  },
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem>
                  <div>
                    <div className="flex justify-around">
                      {user?.photoURL ? (
                        <img
                          className="w-10 h-10 shadow shadow-black rounded-full"
                          src={user?.photoURL}
                          alt="img"
                        />
                      ) : (
                        <AccountCircleIcon style={{ fontSize: "36px" }} />
                      )}
                      <p className="text-[14px] text-gray-500 ml-5">
                        <p className="font-medium">{user?.displayName}</p>
                        <p className="text-gray-400 text-[12px]">
                          {user?.role}
                        </p>
                      </p>
                    </div>
                  </div>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => handleNavigate(`/profile/${userId}`)}
                  style={{ color: "gray", fontSize: "14px" }}
                >
                  <FaRegUser className="mr-3 text-lg m-1" /> {t("myProfile")}
                </MenuItem>
                <MenuItem
                  onClick={() => handleNavigate("/account")}
                  style={{ color: "gray", fontSize: "14px" }}
                >
                  <IoSettingsOutline className="mr-3 text-lg m-1" />{" "}
                  {t("preferences")}
                </MenuItem>
                <Divider />
                <div
                  className="text-[tomato] m-5 inline cursor-pointer rounded p-1.5 hover:bg-[tomato] hover:text-white"
                  onClick={handleSignOut}
                  style={{
                    border: "1px solid tomato",
                    fontSize: "12px",
                  }}
                  size="small"
                >
                  {t("logout")}
                  <LogoutSharpIcon
                    style={{ fontSize: "18px", marginLeft: "10px" }}
                  />
                </div>
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
            keepMounted: true,
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
