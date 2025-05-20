import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";
import Login from "./Login/Login";
import { useDispatch } from "react-redux";
import "./../App.css";
import cross from "../images/icon-cross.svg";

export default function Popup({
  open,
  handleClose,
  handlePhoto,
  handleReload,
}) {
  const dispatch = useDispatch();
  const LoginUserFunc = async () => {
    const user = await Login(dispatch);
    handlePhoto(user);
    handleReload();
    handleClose();
  };
  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box className="popup">
          <img
            onClick={handleClose}
            style={{
              background: "transparent",
              float: "right",
              color: "white",
              fontSize: "1.4rem",
              paddingBottom: "1rem",
            }}
            src={cross}
          />

          <p style={{ marginTop: "2rem" }}>Sigin to TODEC with google.com</p>
          <img
            src={require("../images/google.png")}
            width={"65%"}
            id="googlesigin"
            style={{
              marginTop: "1rem",
            }}
            onClick={LoginUserFunc}
          />
        </Box>
      </Modal>
    </div>
  );
}
