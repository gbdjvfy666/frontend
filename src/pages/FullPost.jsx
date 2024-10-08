import React from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import ReactMarkdown from "react-markdown";
import instance from "../axios";

export const FullPost = () => {
  const [data, setData] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();

  React.useEffect(() => {
    setLoading(true);
    instance
      .get(`/posts/${id}`)
      .then((res) => {
        console.log('Response:', res);
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
        commentsCount={data.commentsCount || 0}
        tags={data.tags}
        isFullPost>
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock items={data.comments || []} isLoading={false}>
        <Index />
      </CommentsBlock>
    </>
  );
};
