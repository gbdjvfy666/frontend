import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

// Асинхронные действия для авторизации
export const fetchAuthData = createAsyncThunk('auth/fetchUserData', async (params) => {
  const { data } = await axios.post('/auth/login', params);
  return data;
});

// Асинхронное действие для получения текущего авторизованного пользователя
export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  const { data } = await axios.get('/auth/me');
  return data;
});

// Регистрация
export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
  const { data } = await axios.post('/auth/register', params);
  return data;
});

// Начальное состояние
const initialState = {
  data: null,
  status: 'loading',
  error: null, // Добавлено свойство для сообщения об ошибке
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.error = null; // Сбрасываем ошибку при выходе
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthData.pending, (state) => {
        state.status = 'loading';
        state.data = null;
        state.error = null; // Сбрасываем ошибку
      })
      .addCase(fetchAuthData.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.data = action.payload;
      })
      .addCase(fetchAuthData.rejected, (state, action) => {
        state.status = 'error';
        state.data = null;
        state.error = action.error.message; // Сохраняем сообщение об ошибке
      })
      .addCase(fetchAuthMe.pending, (state) => {
        state.status = 'loading';
        state.data = null;
        state.error = null; // Сбрасываем ошибку
      })
      .addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.data = action.payload;
      })
      .addCase(fetchAuthMe.rejected, (state, action) => {
        state.status = 'error';
        state.data = null;
        state.error = action.error.message; // Сохраняем сообщение об ошибке
      })
      .addCase(fetchRegister.pending, (state) => {
        state.status = 'loading';
        state.data = null;
        state.error = null; // Сбрасываем ошибку
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.data = action.payload;
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.status = 'error';
        state.data = null;
        state.error = action.error.message; // Сохраняем сообщение об ошибке
      });
  }
});

// Селектор для проверки авторизации
export const selectIsAuth = (state) => Boolean(state.auth.data);

// Экспортируем редюсер
export const authReducer = authSlice.reducer;

// Экспортируем действие для выхода
export const { logout } = authSlice.actions;
