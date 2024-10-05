import React from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export const FullPost = () => {
  const [data, setData] = React.useState(null); // Начальное значение null
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();

  React.useEffect(() => {
    setLoading(true);
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        console.log('Response:', res); // Логируем успешный ответ
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error Details:', err); // Логируем всю информацию об ошибке
        if (err.response) {
          // Сервер ответил с ошибкой
          console.error('Response Data:', err.response.data);
          console.error('Response Status:', err.response.status);
          console.error('Response Headers:', err.response.headers);
        } else if (err.request) {
          // Запрос был сделан, но ответа нет
          console.error('Request:', err.request);
        } else {
          // Ошибка в настройке запроса
          console.error('Error Message:', err.message);
        }
        alert("Ошибка при получении статьи");
      });
  }, [id]); // Добавлено 'id' в зависимости
  

  if (isLoading || !data) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        _id={data._id}
        title={data.title}
        imageUrl={`http://localhost:4444${data.imageUrl}`}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.commentsCount || 0} // Используем реальное значение комментариев
        tags={data.tags}
        isFullPost>
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={data.comments || []} // Используем комментарии из данных
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
