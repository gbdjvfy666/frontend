import { Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import Container from "@mui/material/Container";
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import React, { useEffect } from 'react';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';
import { ProfilePage } from './pages/Profile/index';

function App() {
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);

	// Проверка токена в localStorage
	useEffect(() => {
		const token = window.localStorage.getItem('token');

		// Если токен есть, пытаемся получить данные пользователя
		if (token && !isAuth) {
			dispatch(fetchAuthMe());
		}
	}, [dispatch, isAuth]);

	return (
		<>
			<Header />
			<Container maxWidth='lg'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/posts/:id' element={<FullPost />} />
					<Route path='/posts/:id/edit' element={<AddPost />} />
					<Route path='/add-post' element={<AddPost />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Registration />} />
					<Route path="/profile" element={<ProfilePage />} />
				</Routes>
			</Container>
		</>
	);
}


export default App;
