import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

// Асинхронные экшены для получения постов и тегов
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts');
  return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await axios.get('/posts/tags');
  return data;
});

// Начальное состояние
const initialState = {
  posts: {
    items: [],
    status: 'loading',  // 'loading', 'loaded', 'error'
    error: null,
  },
  tags: {
    items: [],
    status: 'loading',  // 'loading', 'loaded', 'error'
    error: null,
  }
};

// Создание слайса
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка загрузки постов
      .addCase(fetchPosts.pending, (state) => {
        state.posts.items = [];
        state.posts.status = 'loading';
        state.posts.error = null; // Сбрасываем ошибку
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts.items = action.payload;
        state.posts.status = 'loaded';
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.posts.items = [];
        state.posts.status = 'error';
        state.posts.error = action.error.message; // Сохраняем сообщение об ошибке
      })
      // Обработка загрузки тегов
      .addCase(fetchTags.pending, (state) => {
        state.tags.items = [];
        state.tags.status = 'loading';
        state.tags.error = null; // Сбрасываем ошибку
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags.items = action.payload;
        state.tags.status = 'loaded';
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.tags.items = [];
        state.tags.status = 'error';
        state.tags.error = action.error.message; // Сохраняем сообщение об ошибке
      });
  },
});

// Экспорт редьюсера
export const postsReducer = postsSlice.reducer;
