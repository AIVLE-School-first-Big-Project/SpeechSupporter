import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Questions.module.css';

const Questions = (props) => {
    const { countList } = props;

    const [question, setQusetion] = useState([]);
    const [answer, setAnswer] = useState([]);
    const [timer, setTimer] = useState([]);
    const [items, setItems] = useState([]);

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

    const goToInterview = () => {
        nav('/aivle/video', { state: { data: items } });
    };

    return (
        <div>
            {countList &&
                countList.map((div, i) => {
                    return (
                        <div key={i}>
                            <input type='text' placeholder='질문' onChange={handleQuestion} />
                            <input type='text' placeholder='대답' onChange={handleAnswer} />
                            <input type='number' placeholder='시간' onChange={handleTimer} />
                            <button onClick={onClick} className={items[i] ? styles.hidden : ''}>
                                저장하기
                            </button>
                            <span className={items[i] ? styles.span : styles.hidden}>✅</span>
                        </div>
                    );
                })}
            <button onClick={goToInterview}>면접보러가기</button>
        </div>
    );
};

export default Questions;
