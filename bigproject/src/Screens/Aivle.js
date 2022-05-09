import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import styles from './Aivle.module.css';
import { publishRefreshToken } from '../Utiles/axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Aivle = () => {
    const { state } = useLocation();
    const nav = useNavigate();
    const h1 = useRef(null);

    const [timer, setTimer] = useState(4);

    useEffect(() => {
        h1.current = setInterval(() => {
            setTimer((prev) => {
                return prev - 1;
            });
        }, 1000);
    }, []);

    useEffect(() => {
        if (timer <= 0) {
            setTimer('코칭을 시작합니다!');
            clearInterval(h1.current);
            setTimeout(() => {
                nav('/aivle/coaching', { state: { data: state } });
            }, 2000);
        }
    }, [timer]);

    return (
        <div class='container'>
            <div className={styles.loading__container}>
                <h1 ref={h1}>{timer}</h1>
            </div>
        </div>
    );
};

export default Aivle;
