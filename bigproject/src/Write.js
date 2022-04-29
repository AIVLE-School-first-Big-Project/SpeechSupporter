import axios from 'axios';
import styles from './Write.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publishRefreshToken } from './Utiles/axios';

const url = 'http://localhost:8000/api/post/post/';

const Write = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState(0);

    const nav = useNavigate();

    const sendPostData = async () => {
        publishRefreshToken();

        const data = {
            title,
            content,
            user: JSON.parse(localStorage.getItem('user')).email,
        };
        console.log(localStorage.getItem('access'));
        const post = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
        });
    };

    const onTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);
    };

    const onContentChange = (e) => {
        const value = e.target.value;
        setContent(value);
    };

    const saveBtnClick = () => {
        sendPostData();
        nav('/community');
    };

    return (
        <div className={styles.container}>
            <img src='aivle.png' className={styles.logo} />
            <nav className={styles.navi}>
                <img className={styles.profile} src='king.png' />
                <h5 id='id'>아이디</h5>
                <a href=''>
                    <img src='google.png' />
                </a>
                <a href=''>
                    <img src='google.png' />
                </a>
            </nav>
            <div className={styles.head}>
                <span>글 쓰 기</span>
            </div>
            <div className={styles.select}>
                <input
                    type='radio'
                    name='fuck'
                    id='radio'
                    onClick={() => {
                        setCategory(1);
                    }}
                />
                <span>자유게시판</span>
                <input
                    type='radio'
                    name='fuck'
                    id='radio'
                    onClick={() => {
                        setCategory(2);
                    }}
                />
                <span>다른게시판</span>
                <input
                    type='radio'
                    name='fuck'
                    id='radio'
                    onClick={() => {
                        setCategory(3);
                    }}
                />
                <span>다른게시판</span>
            </div>
            <div className={styles.input_title}>
                <input type='text' placeholder='제목을 입력하세요.' onChange={onTitleChange} />
            </div>
            <div className={styles.input_content}>
                <input type='text' onChange={onContentChange} />
            </div>
            <div className={styles.foot}>
                <div className={styles.write_button}>
                    <button onClick={saveBtnClick}>저 장</button>
                </div>
            </div>
        </div>
    );
};

export default Write;
