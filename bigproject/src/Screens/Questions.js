import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Questions.module.css';
import axios from 'axios';
import publishRefreshToken from '../Utiles/PrivateRoute';

const BASE_URL = 'http://localhost8000//api/users/uesr/';

const Questions = (props) => {
    const { countList, btn } = props;

    const [imgSrc, setImgSrc] = useState(null);
    const [nickNameValue, setNickNameValue] = useState('');
    const [question, setQusetion] = useState([]);
    const [answer, setAnswer] = useState([]);
    const [timer, setTimer] = useState([]);
    const [items, setItems] = useState([]);

    const getUserData = async () => {
        setNickNameValue(localStorage.getItem('nickname'));
        setImgSrc(localStorage.getItem('img'));
    };

    const nav = useNavigate();

    const handleQuestion = (e) => {
        const value = e.target.value;
        setQusetion(value);
    };

    const handleAnswer = (e) => {
        const value = e.target.value;
        setAnswer(value);
    };

    const handleTimer = (e) => {
        const value = e.target.value;
        setTimer(value);
    };

    const onClick = () => {
        const item = {
            [`question`]: question,
            [`answer`]: answer,
            [`timer`]: timer,
        };

        setItems([...items, item]);
    };

    useEffect(() => {
        getUserData();
    }, []);

    const goToInterview = () => {
        nav('/aivle/video', { state: { data: items } });
    };

    return (
        <body>
            <div className={styles.container}>
                <div className={styles.topbar__container}>
                    <div></div>
                    <a href='/aivle/main'>
                        <div>
                            <img src='aivle5.png' className={styles.logo} />
                        </div>
                    </a>
                    <nav className={styles.navigator}>
                        <img className={styles.profile} src={imgSrc} />
                        <h5 id='id'>{nickNameValue}</h5>
                        <a href='http://localhost:3000/modify'>
                            <img src='http://bens1.img12.kr/2021_m_category_renewal/m_icon_mypage.png' />
                        </a>
                    </nav>
                </div>
            </div>
            <div>
                <div className={styles.QuestionContentBox}>
                    <div className={styles.QuestionListBox}>
                        <div className={styles.QuestionBox}>
                            <div className={styles.Question_minus}>
                                <div className={styles.cutBox_1}>
                                    {countList &&
                                        countList.map((div, i) => {
                                            if (i < 6) {
                                                return (
                                                    <div className={styles.Question} key={i}>
                                                        <div className={styles.Question_question}>
                                                            <input
                                                                class={styles.comment_inbox_question}
                                                                type='text'
                                                                placeholder='질문'
                                                                onChange={handleQuestion}
                                                            />
                                                        </div>
                                                        <div className={styles.Question_question}>
                                                            <input
                                                                class={styles.comment_inbox_answer}
                                                                type='text'
                                                                placeholder='대답'
                                                                onChange={handleAnswer}
                                                            />
                                                        </div>
                                                        <div className={styles.Question_question}>
                                                            <input
                                                                class={styles.comment_inbox_time}
                                                                type='number'
                                                                placeholder='시간'
                                                                onChange={handleTimer}
                                                            />
                                                        </div>

                                                        <button onClick={onClick} className={items[i] ? styles.hidden : ''}>
                                                            저장
                                                        </button>
                                                        <span className={items[i] ? styles.span : styles.hidden}>✅</span>
                                                    </div>
                                                );
                                            }
                                        })}
                                </div>
                                <div className={styles.cutBox_2}>{btn}</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.Button_area}>
                        <button class={styles.goTo_button} onClick={goToInterview}>
                            면접보러가기
                        </button>
                    </div>
                </div>
            </div>
        </body>
    );
};

export default Questions;
