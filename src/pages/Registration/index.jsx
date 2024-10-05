import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import styles from './Login.module.scss';
import {
	fetchAuthData,
	fetchRegister,
	selectIsAuth,
} from '../../redux/slices/auth';

export const Registration = () => {
	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			fullname: '',
			email: '',
			password: '',
		},
		mode: 'onChange',
	});

	const onSubmit = async values => {
		const data = await dispatch(fetchRegister(values));

		if (!data.payload) {
			return alert('Не удалось зарегистрироваться');
		}

		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token);
		}
	};

	if (isAuth) {
		return <Navigate to='/' />;
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant='h5'>
				Создание аккаунта
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					error={Boolean(errors.fullname?.message)} // Изменено с fullName на fullname
					helperText={errors.fullname?.message} // Изменено с fullName на fullname
					{...register('fullname', { required: 'Укажите полное имя' })} // Изменено с fullName на fullname
					className={styles.field}
					label='Полное имя'
					fullWidth
				/>
				<TextField
					error={Boolean(errors.email?.message)}
					type='email'
					helperText={errors.email?.message}
					{...register('email', { required: 'Укажите почту' })}
					className={styles.field}
					label='E-Mail'
					fullWidth
				/>
				<TextField
					error={Boolean(errors.password?.message)}
					type='password'
					helperText={errors.password?.message}
					{...register('password', { required: 'Укажите пароль' })}
					className={styles.field}
					label='Пароль'
					fullWidth
				/>
				<Button
					disabled={!isValid}
					type='submit'
					size='large'
					variant='contained'
					fullWidth
				>
					Зарегистрироваться
				</Button>
			</form>
		</Paper>
	);
};
