import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data); // Получаем данные о текущем пользователе

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  React.useEffect(() => {
    dispatch(fetchPosts()).then((res) => console.log(res.payload));
    dispatch(fetchTags()).then((res) => console.log(res.payload));
  }, [dispatch]);

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                  key={obj._id}
                  _id={obj._id}
                  title={obj.title}
                  imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}`: ''}
                  user={obj.user}  // Добавьте это
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  commentsCount={3}
                  tags={obj.tags}  // Добавьте это для тегов
                  isEditable={userData?._id !== obj.user._id}
                />
            ),
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <TagsBlock items={tags.items || []} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Але',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
