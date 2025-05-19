import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload;
    },
    addTodo: (state, action) => {
      state.todos.push(action.payload);
    },
    updateTodo: (state, action) => {
      const { id, newText } = action.payload;
      const todoToUpdate = state.todos.find((todo) => {
        todo.id === id;
      });
      if (todoToUpdate) {
        todoToUpdate.todo = newText;
        console(state.todos);
      }
    },
  },
});

export const { setTodos, addTodo, updateTodo } = todoSlice.actions;

export default todoSlice.reducer;
