import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

// Асинхронное действие для авторизации пользователя
export const fetchAuthData = createAsyncThunk('auth/fetchUserData', async (params) => {
  const { data } = await axios.post('/auth/login', params);
  return data;
});

// Асинхронное действие для получения текущего авторизованного пользователя
export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  const token = window.localStorage.getItem('token');
  const { data } = await axios.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
});

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
  const { data } = await axios.post('/auth/register', params); // Pass params to the request
  return data;
});

// Начальное состояние
const initialState = {
  data: null, // Данные пользователя
  status: 'loading', // Статус запроса: loading, loaded, error
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Логика для выхода пользователя
    logout: (state) => {
      state.data = null; // Обнуляем данные при выходе
      window.localStorage.removeItem('token'); // Удаляем токен при выходе
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthData.pending, (state) => {
        state.status = 'loading';
        state.data = null;
      })
      .addCase(fetchAuthData.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.data = action.payload; // Сохраняем данные после успешной авторизации
        if (action.payload.token) {
          window.localStorage.setItem('token', action.payload.token); // Сохраняем токен
        }
      })
      .addCase(fetchAuthData.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      })
      .addCase(fetchAuthMe.pending, (state) => {
        state.status = 'loading';
        state.data = null;
      })
      .addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.data = action.payload; // Сохраняем данные текущего пользователя
      })
      .addCase(fetchAuthMe.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      })
      .addCase(fetchRegister.pending, (state) => {
        state.status = 'loading';
        state.data = null;
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.data = action.payload; // Сохраняем данные текущего пользователя
        if (action.payload.token) {
          window.localStorage.setItem('token', action.payload.token); // Сохраняем токен
        }
      })
      .addCase(fetchRegister.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      });
  }
});

// Селектор для проверки авторизации
export const selectIsAuth = (state) => {
  return Boolean(state.auth.data && window.localStorage.getItem('token'));
};

// Экспортируем редюсер
export const authReducer = authSlice.reducer;

// Экспортируем действие для выхода
export const { logout } = authSlice.actions;
