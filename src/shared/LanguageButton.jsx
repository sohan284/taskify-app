import { useState } from "react";
import { Menu, MenuItem, Checkbox, Button } from "@mui/material";
import { TfiWorld } from "react-icons/tfi";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { useTranslation } from "react-i18next";

const LanguageButton = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English"); // Default to English

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleLanguage = (language) => {
    setSelectedLanguage(language);
    handleClose();
    i18n.changeLanguage(language === "English" ? "en" : "bn"); // Change language based on selection
  };

  return (
    <>
      <Button
        size="small"
        style={{
          color: "#6479f3",
          marginInline: "10px",
          fontSize: "12px",
          paddingInline: "16px",
          border: "1px solid #6479f3",
        }}
        onClick={handleClick}
      >
        <TfiWorld style={{ margin: "5px" }} /> {selectedLanguage}
        <KeyboardArrowRightOutlinedIcon style={{ fontSize: "18px" }} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 300,
            width: 200,
            fontSize: "0.875rem",
          },
        }}
      >
        {["English", "বাংলা"].map((language) => (
          <MenuItem
            key={language}
            onClick={() => handleToggleLanguage(language)} // Handle click on MenuItem
            style={{
              padding: "0px 5px",
              display: "flex",
              alignItems: "center",
            }} // Flex alignment for checkbox and text
          >
            <Checkbox
              size="small"
              checked={selectedLanguage === language}
              readOnly // Make checkbox read-only since we handle selection on MenuItem click
            />
            {language}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageButton;
