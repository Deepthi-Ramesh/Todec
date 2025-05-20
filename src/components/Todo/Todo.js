import "./../../App.css";
import { React, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
//reducers
import { LoginUser, LogoutUser } from "../../features/userSlice";
import { addTodo, setTodos, updateTodo } from "../../features/todoSlice";
import {
  db,
  collection,
  addDoc,
  getDocs,
  logout,
} from "./../../firebaseconfig";
import { doc, query, where, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
//images & icons
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import cross from "../../images/icon-cross.svg";
import { Typography, Popover } from "@mui/material";

//components
import Popup from "../popup";
import Login from "../Login/Login";
import ThemeToggle from "../themeToggle";

import { toast } from "react-toastify";

function Todo() {
  const [isReloadTodos, setIsReloadTodos] = useState(true);
  const [todo, settodo] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [photo, setPhoto] = useState(" ");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const photoURL = useSelector((state) => state?.user?.photoURL);
  const todosList = useSelector((state) => state?.todos?.todos);
  const darkMode = useSelector((state) => state?.theme?.darkMode);
  const dispatch = useDispatch();
  const tommy = getAuth().currentUser;
  const iconRef = useRef(null);
  const [popupopen, setPopupopen] = useState(false);

  const handlePopupopen = () => setPopupopen(true);
  const handlePopupclose = () => setPopupopen(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const [hover, settodoHover] = useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePhoto = (user) => {
    setPhoto(user.photoURL);
  };
  const handleReload = () => {
    setIsReloadTodos(true);
  };
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 599px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 600px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  useEffect(() => {
    if (tommy && isReloadTodos) {
      getAllTodos();
      setIsReloadTodos(false);
    }
  }, [tommy, isReloadTodos]);

  //login of user

  const login = async () => {
    try {
      const user = await Login(dispatch);
      if (user) {
        console.log(photoURL);
        handlePhoto(user);
        setIsReloadTodos(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //logOut of user

  const Logout = async () => {
    await logout();
    dispatch(LogoutUser());
    setAnchorEl(!anchorEl);
    setPhoto("");
    dispatch(setTodos([]));
  };

  // create a todo
  const createTodo = async () => {
    if (tommy?.uid) {
      if (todo.length !== 0) {
        await addDoc(collection(db, "todos"), {
          todo: todo,
          completed: false,
          id: Date.now(),
          uid: tommy?.uid,
        });

        setIsReloadTodos(!isReloadTodos);
      }
    } else {
      handlePopupopen();
    }

    if (tommy) {
      dispatch(
        addTodo({
          todo: todo,
          completed: false,
          id: Date.now(),
          uid: tommy.uid,
        })
      );
    }
    settodo("");
  };

  // fetch todos from firebase
  const getAllTodos = async () => {
    if (tommy) {
      const q = query(collection(db, "todos"), where("uid", "==", tommy.uid));
      const querySnapshot = await getDocs(q);
      const result = querySnapshot.docs.map((doc) => ({
        id: tommy.uid,
        ...doc.data(),
      }));
      dispatch(setTodos([...result]));

      setIsReloadTodos(!isReloadTodos);
    }
  };

  // Mark the todo as completed

  const completedTodo = async (id) => {
    const q = query(collection(db, "todos"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docItem) => {
      const docRef = doc(db, "todos", docItem.id);
      await updateDoc(docRef, {
        completed: true,
      });
    });
    setIsReloadTodos(true);
  };

  const deleteTodo = async (id) => {
    const q = query(collection(db, "todos"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docItem) => {
      await deleteDoc(doc(db, "todos", docItem.id));
    });
    setIsReloadTodos(true);
  };
  //to edit the todo
  const handleEditSave = async (id) => {
    if (editText.trim() === "") return;
    try {
      const q = query(collection(db, "todos"), where("id", "==", id));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (docItem) => {
        const docRef = doc(db, "todos", docItem.id);
        await updateDoc(docRef, {
          todo: editText,
        });
      });

      dispatch(updateTodo({ id: id, newText: editText }));
      setIsReloadTodos(true);
      setEditId(null);
      setEditText("");
    } catch (e) {
      console.log(e);
    }
  };
  //clear completed
  const clearCompleted = async () => {
    const completed = todosList.filter((todo) => todo.completed === true);
    completed.map((element) => {
      deleteTodo(element.id);
    });
  };

  return (
    <div>
      <div className="main-container">
        {photo && photo != " " ? (
          <div
            style={{ display: "inline-block", position: "relative" }}
            ref={iconRef}
          >
            <img
              src={tommy.photoURL}
              id="iconphoto"
              onClick={(e) => {
                setAnchorEl(iconRef.current);
                handleClick(e);
              }}
            />
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              style={{ left: "1.5rem" }}
            >
              <Typography sx={{ p: 2 }} onClick={Logout}>
                LogOut
              </Typography>
            </Popover>
          </div>
        ) : (
          <AccountCircleRoundedIcon
            id="icon"
            fontSize="large"
            onClick={() => login()}
          />
        )}

        <div
          className="container1"
          style={{
            backgroundImage: `url(${
              darkMode ? "/bg-desktop-dark.jpg" : "/bg-desktop-light.jpg"
            })`,
          }}
        >
          <div className="head">
            <h3>TODO</h3>
            <ThemeToggle />
          </div>
          <div className="subcon">
            <input
              type="text"
              onChange={(e) => settodo(e.target.value)}
              placeholder="Create a New TODO"
              value={todo}
              id="input"
              required
              style={{
                backgroundColor: darkMode
                  ? " hsl(235, 24%, 19%)"
                  : " hsl(0, 0%, 98%)",
                color: darkMode ? "hsl(234, 39%, 85%)" : "hsl(235, 19%, 35%)",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (todo.length != 0) {
                    createTodo();
                  }
                }
              }}
            />
          </div>
        </div>
        <div
          className="container2"
          style={{
            backgroundColor: darkMode
              ? "hsl(235, 21%, 11%)"
              : " hsl(236, 33%, 92%)",
          }}
        >
          <div className="subcon2">
            {todosList?.length > 0
              ? todosList.map((element) =>
                  (activeFilter === "active" && element.completed === false) ||
                  (activeFilter === "complete" && element.completed === true) ||
                  activeFilter === "all" ? (
                    <div
                      key={element.id}
                      className="eachtodo"
                      onMouseEnter={() => {
                        settodoHover(element.id);
                      }}
                      onMouseLeave={() => {
                        settodoHover(null);
                      }}
                      onDoubleClick={() => {
                        setEditId(element.id);
                        setEditText(element.todo);
                      }}
                      style={{
                        backgroundColor: darkMode
                          ? " hsl(235, 24%, 19%)"
                          : " hsl(0, 0%, 98%)",
                        color: darkMode
                          ? "hsl(234, 39%, 85%)"
                          : "hsl(235, 19%, 35%)",
                        borderColor: darkMode
                          ? "hsl(237, 14%, 26%)"
                          : "hsl(236, 33%, 92%)",
                      }}
                    >
                      <div id="striketodo">
                        <input
                          type="checkbox"
                          id="radio"
                          checked={element.completed === true}
                          onChange={() => completedTodo(element.id)}
                        />
                        {editId === element.id ? (
                          <input
                            style={{
                              border: "none",
                              outline: "none",
                              height: "1.5rem",
                              background: "transparent",
                              color: darkMode ? "white" : "black",
                              fontFamily: "Josefin Sans",
                              fontSize: "1rem",
                            }}
                            value={editText}
                            onChange={(e) => {
                              setEditText(e.target.value);
                            }}
                            onBlur={() => handleEditSave(element.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleEditSave(element.id);
                            }}
                          />
                        ) : (
                          <p
                            className={
                              element.completed === true ? "line-through" : ""
                            }
                          >
                            {element.todo}
                          </p>
                        )}
                      </div>
                      {hover === element.id ? (
                        <div>
                          <img
                            src={cross}
                            alt=""
                            onClick={() => deleteTodo(element.id)}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : null
                )
              : null}
            <div
              className="todosummary"
              style={{
                backgroundColor: darkMode
                  ? " hsl(235, 24%, 19%)"
                  : " hsl(0, 0%, 98%)",
              }}
            >
              {todosList?.length} items left
              {matches ? (
                <div className="stages">
                  <p
                    style={{
                      color: activeFilter === "all" ? "blue" : "inherit",
                    }}
                    onClick={() => setActiveFilter("all")}
                  >
                    All
                  </p>
                  <p
                    style={{
                      color: activeFilter === "active" ? "blue" : "inherit",
                    }}
                    onClick={() => setActiveFilter("active")}
                  >
                    Active
                  </p>
                  <p
                    style={{
                      color: activeFilter === "complete" ? "blue" : "inherit",
                    }}
                    onClick={() => setActiveFilter("complete")}
                  >
                    Completed
                  </p>
                </div>
              ) : (
                " "
              )}
              <p
                onClick={() => {
                  clearCompleted();
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                Clear Completed
              </p>
            </div>
            {matches ? (
              " "
            ) : (
              <div
                className="stages mobile"
                style={{
                  backgroundColor: darkMode
                    ? " hsl(235, 24%, 19%)"
                    : " hsl(0, 0%, 98%)",
                }}
              >
                <p
                  style={{
                    color: activeFilter === "all" ? "blue" : "inherit",
                  }}
                  onClick={() => setActiveFilter("all")}
                >
                  All
                </p>
                <p
                  style={{
                    color: activeFilter === "active" ? "blue" : "inherit",
                  }}
                  onClick={() => setActiveFilter("active")}
                >
                  Active
                </p>
                <p
                  style={{
                    color: activeFilter === "complete" ? "blue" : "inherit",
                  }}
                  onClick={() => setActiveFilter("complete")}
                >
                  Completed
                </p>
              </div>
            )}
            <p
              style={{
                fontSize: "1rem",
                color: "hsl(235, 19%, 35%)",
                marginTop: "2rem",
              }}
            >
              To edit , Double click the todo{" "}
            </p>
          </div>
        </div>
      </div>
      <Popup
        open={popupopen}
        handleClose={handlePopupclose}
        handlePhoto={handlePhoto}
        handleReload={handleReload}
      />
    </div>
  );
}

export default Todo;
