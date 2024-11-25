import React, { useState, useEffect } from "react";
import axios from "../axios"; // Импортируем axios
import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { useParams } from "react-router-dom"; // Для получения postId

export const CommentsBlock = ({ items, children, isLoading = true }) => {
  const [comments, setComments] = useState([]); // Стейт для комментариев
  const { id: postId } = useParams(); // Получаем postId из параметров маршрута

  useEffect(() => {
    axios
      .get(`/comments/${postId}`) // Запрос на получение комментариев
      .then((res) => setComments(res.data)) // Устанавливаем полученные данные в стейт
      .catch((err) => console.error("Ошибка при загрузке комментариев", err)); // Ловим ошибки
  }, [postId]); // В зависимости от postId

  const handleAddComment = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]); // Обновляем список комментариев
  };

  return (
    <SideBlock title="Комментарии">
      <List>
        {(isLoading ? [...Array(5)] : comments).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl} />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText
                  primary={obj.user.fullName}
                  secondary={obj.text}
                />
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
