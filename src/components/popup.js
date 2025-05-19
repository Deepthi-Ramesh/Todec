import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Login from "./Login/Login";
import { useDispatch } from "react-redux";
import "./../App.css";

export default function Popup({ open, handleClose }) {
  const dispatch = useDispatch();
  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box className="popup">
          <div
            onClick={handleClose}
            style={{
              background: "transparent",
              float: "right",
              color: "white",
              fontSize: "1.4rem",
              paddingBottom: "1rem",
            }}
          >
            X
          </div>
          <Typography style={{ marginTop: "2rem" }}>
            Sigin to TODEC with google.com
          </Typography>
          <img
            src={require("../images/google.png")}
            width={"65%"}
            style={{
              marginTop: "1rem",
            }}
            onClick={() => {
              Login(dispatch);
              handleClose();
            }}
          />
        </Box>
      </Modal>
    </div>
  );
}
