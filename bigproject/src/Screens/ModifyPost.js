import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import styles from './Board.module.css';
import axios from 'axios';
import { publishRefreshToken } from '../Utiles/axios';

const ModifyPost = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const nav = useNavigate();

    const getDetailData = async () => {
        const detail = await axios.get(`http://localhost:8000/api/post/${id}/`);
        setDetail(detail);
        setTitle(detail.data.post.title);
        setContent(detail.data.post.content);
        setLoading(true);
    };

    const onTitleChg = (e) => {
        const value = e.target.value;
        setTitle(value);
    };

    const onContentChg = (e) => {
        const value = e.target.value;
        setContent(value);
    };

    const onSaveClicked = async () => {
        publishRefreshToken();
        const data = {
            id,
            title,
            content,
        };
        const modify = await axios.put(`http://localhost:8000/api/post/modify/${id}/`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
        });

        nav('/community/1');
    };

    useEffect(() => {
        getDetailData();
    }, []);

    return (
        <div className={styles.container}>
            {loading ? (
                <>
                    <div>
                        <img src='../aivle.png' className={styles.logo} />
                    </div>
                    <div className={styles.content_container}>
                        <div className={styles.navbar}>
                            <div>
                                <a href='#' onClick={onSaveClicked}>
                                    저장
                                </a>
                            </div>
                        </div>
                        <div className={styles.ArticleContentBox}>
                            <div className={styles.article_header}>
                                <div className={styles.ArticleTitle}>
                                    <input className={styles.title_text} value={title} onChange={onTitleChg} />
                                </div>
                            </div>
                            <div className={styles.space}></div>
                            <div className={styles.article_container}>
                                <div className={styles.article_viewer}>
                                    <textarea value={content} onChange={onContentChg}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default ModifyPost;
