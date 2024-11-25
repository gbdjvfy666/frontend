import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { Index as AddComment } from "../components/AddComment"; // Компонент для добавления комментария
import { CommentsBlock } from "../components/CommentsBlock";
import ReactMarkdown from "react-markdown";
import axios from "../axios.js";

export const FullPost = () => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const { id } = useParams(); // Получаем id из параметров

  // Загружаем комментарии
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`/posts/${id}/comments`);
        setComments(data.comments); // Сохраняем комментарии
      } catch (error) {
        console.warn("Ошибка при загрузке комментариев", error);
      }
    };
    
    fetchComments();
  }, [id]);

  // Добавление нового комментария в список
  const handleAddComment = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  // Загружаем пост
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при получении статьи:", err);
        alert("Ошибка при получении статьи");
        setLoading(false);
      });
  }, [id]);

  if (isLoading || !data) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        _id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ""}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={comments.length}
        tags={data.tags}
        isFullPost>
        <ReactMarkdown>{data.text}</ReactMarkdown>
      </Post>
      <div>
        <h2>Комментарии</h2>
        {/* Отображение комментариев */}
        <CommentsBlock comments={comments} />
        {/* Добавление нового комментария */}
        <AddComment onAddComment={handleAddComment} />
      </div>
    </>
  );
};
