import React, { useState } from "react";
import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from "../../axios"; // Импорт axios для отправки комментария
import { useParams } from 'react-router-dom';

export const Index = ({ onAddComment }) => { // Передаем функцию onAddComment
  const [comment, setComment] = useState(''); // Стейт для хранения текста комментария
  const [loading, setLoading] = useState(false); // Стейт для индикатора загрузки
  const { id: postId } = useParams(); // Получение postId из параметров маршрута

  const handleCommentChange = (e) => {
    setComment(e.target.value); // Обновление состояния с текстом комментария
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      alert('Комментарий не может быть пустым');
      return;
    }

    try {
      setLoading(true);
      // Отправка комментария на сервер
      const { data } = await axios.post('/comments', { text: comment, postId });

      onAddComment(data); // Добавляем новый комментарий в список
      setComment(''); // Очистить поле ввода после успешной отправки
    } catch (error) {
      console.warn('Ошибка при отправке комментария', error);
      alert('Не удалось отправить комментарий');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <Avatar
        classes={{ root: styles.avatar }}
        src="https://mui.com/static/images/avatar/5.jpg"
      />
      <div className={styles.form}>
        <TextField
          label="Написать комментарий"
          variant="outlined"
          maxRows={10}
          multiline
          fullWidth
          value={comment}
          onChange={handleCommentChange} // Добавление изменения поля ввода
        />
        <Button
          variant="contained"
          onClick={handleSubmit} // Обработчик для отправки комментария
          disabled={loading} // Отключаем кнопку во время загрузки
        >
          {loading ? 'Отправка...' : 'Отправить'}
        </Button>
      </div>
    </div>
  );
};
