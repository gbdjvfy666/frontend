import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../axios';
import styles from './ProfilePage.module.scss';

export const ProfilePage = () => {
  const [profileData, setProfileData] = useState({ fullName: 'Загрузка...', email: 'Загрузка...', avatarUrl: 'https://via.placeholder.com/150' });
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({ fullName: '', email: '', avatarUrl: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const isAuth = useSelector((state) => state.auth.isAuth);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("Токен не найден");
        return;
      }
      try {
        const { data } = await axios.get('/profile');
        setProfileData(data);
        setUpdatedProfile({ fullName: data.fullName, email: data.email, avatarUrl: data.avatarUrl });
      } catch (error) {
        console.error("Ошибка при получении данных профиля", error);
        setProfileData({ fullName: 'Ошибка загрузки', email: 'Ошибка загрузки', avatarUrl: 'https://via.placeholder.com/150' });
      }
    };

    if (isAuth) {
      fetchProfileData();
    }
  }, [isAuth]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Функция для обработки загрузки файла
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Отображение локального превью
    const reader = new FileReader();
    reader.onloadend = () => {
      setUpdatedProfile({ ...updatedProfile, avatarUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert("Токен не найден");
      return;
    }
  
    // Обработка загрузки файла на сервер
    const formData = new FormData();
    formData.append('fullName', updatedProfile.fullName);
    formData.append('email', updatedProfile.email);
  
    if (selectedFile) {
      formData.append('avatar', selectedFile); // Добавляем изображение в formData
    }
  
    try {
      await axios.put('/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Добавляем токен в заголовки
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfileData(updatedProfile); // Обновляем локальные данные
      alert("Профиль успешно обновлен");
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при обновлении профиля", error);
      alert("Не удалось обновить профиль");
    }
  };
  

  return (
    <div className={styles.profile}>
      <img 
        src={updatedProfile.avatarUrl || '/noavatar.png'} 
        alt="Avatar" 
        className={styles.avatar} 
      />
      {isEditing && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      )}
      <div className={styles.username}>{profileData.fullName}</div>
      <div className={styles.email}>{profileData.email}</div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <label>
            Имя:
            <input
              type="text"
              name="fullName"
              value={updatedProfile.fullName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={updatedProfile.email}
              onChange={handleInputChange}
            />
          </label>
          <div className={styles['profile-actions']}>
            <button type="submit">Сохранить</button>
            <button type="button" onClick={handleEditToggle}>Отменить</button>
          </div>
        </form>
      ) : (
        <div className={styles['profile-actions']}>
          <button onClick={handleEditToggle}>Редактировать профиль</button>
        </div>
      )}

      <div className={styles.bio}>
        info
      </div>
    </div>
  );
};
