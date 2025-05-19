import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/themeslice";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
const ThemeToggle = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <p onClick={() => dispatch(toggleTheme())}>
      {darkMode ? (
        <WbSunnyIcon style={{ color: "white" }} />
      ) : (
        <BedtimeRoundedIcon style={{ color: "white" }} />
      )}
    </p>
  );
};

export default ThemeToggle;
