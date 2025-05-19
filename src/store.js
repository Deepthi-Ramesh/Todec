import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import todosReducer from "./features/todoSlice";
import themeReducer from "./features/themeslice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    todos: todosReducer,
    theme: themeReducer,
  },
});
