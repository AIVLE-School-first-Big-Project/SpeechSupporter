import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const url = 'http://localhost:8000/api/token/';

const LoginPage = () => {
    const [idInputState, setIdInputState] = useState(false);
    const [passwordInputState, setPasswordInputState] = useState(false);
    const [idValue, setIdValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [idNum, setIdNum] = useState(0);
    const [state, setState] = useState(false);
    const [message, setMessage] = useState('');

    const navigation = useNavigate();

    const handleLoginBtn = (event) => {
        event.preventDefault();
        sendLoginData();
    };

    const sendLoginData = async () => {
        const loginData = {
            email: idValue,
            password: passwordValue,
        };
        const loginState = await axios.post(url, loginData);

        if (loginState.data.access) {
            const access = loginState.data.access;
            const refresh = loginState.data.refresh;
            const decode = jwt_decode(access);
            const userData = { email: decode.user_email, access, refresh };
            localStorage.setItem('user', JSON.stringify(userData));

            setTimeout(() => {
                localStorage.removeItem('user');
            }, 10000);

            navigation('/aivle/main');
        }
        //console.log(decode.user_email);

        /*
        if (loginState.data['login-status']) {
            //navigation('/main', { state: { access, refresh } });
        }

        if (loginState.data.message.non_field_errors[0] === 'user not found') {
            setIdNum(10);
            setState(true);
            return setMessage('이메일을 확인 해주세요!');
        } else if (loginState.data.message.non_field_errors[0] === 'password not matched') {
            setIdNum(20);
            setState(true);
            return setMessage('비밀번호를 확인 해주세요!');
        }
        */
    };

    const loginChk = () => {
        const loginToken = localStorage.getItem('user');
        if (loginToken) {
            navigation('/aivle/main');
        }
    };

    const passwordValueChk = (event) => {
        if (event.target.value !== '') {
            setPasswordInputState(true);
        } else {
            setPasswordInputState(false);
        }
        setPasswordValue(event.target.value);
    };
    const idValueChk = (event) => {
        if (event.target.value !== '') {
            setIdInputState(true);
        } else {
            setIdInputState(false);
        }
        setIdValue(event.target.value);
    };

    useEffect(() => {
        loginChk();
    }, []);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.neckless__container}>
                    <div className={styles.neckless_front}></div>
                    <div className={styles.neckless_back}></div>
                </div>
                <div className={styles.App}>
                    <div className={styles.top}></div>
                    <div className={styles.hole}></div>
                    <div className={styles.logo_container}>
                        <img className={styles.logo} src='aivle.png' unselectable='on' />
                    </div>
                    <div id={styles.login__form}>
                        <div className={styles.id__container}>
                            <input
                                id={styles.id}
                                type='text'
                                className={styles.id_input}
                                onChange={idValueChk}
                                require
                                autoComplete='off'
                            />
                            <label htmlFor='id' className={idInputState ? styles.id_label__focused : styles.id_label}>
                                아이디를 입력해주세요.
                            </label>
                        </div>
                        <div className={styles.password__container}>
                            <input
                                type='password'
                                id={styles.password}
                                className={styles.password_input}
                                onChange={passwordValueChk}
                                required
                                autoComplete='off'
                            />
                            <label
                                htmlFor='password'
                                className={passwordInputState ? styles.password_label__focused : styles.password_label}>
                                패스워드를 입력해주세요.
                            </label>
                        </div>
                        <input type='submit' value='로그인' onClick={handleLoginBtn} id={styles.login__button} />
                        {state && idNum === 10 ? (
                            <span className={styles.message}>{message}</span>
                        ) : (
                            <span className={styles.hidden}></span>
                        )}
                        {state && idNum === 20 ? (
                            <span className={styles.message}>{message}</span>
                        ) : (
                            <span className={styles.hidden}></span>
                        )}
                    </div>
                    <div className={styles.regist__container}>
                        <a href='/register'>
                            <span className={styles.span}>입사하기</span>
                        </a>
                    </div>
                    <div className={styles.link__container}>
                        <img style={{ width: '30px' }} src='./google.png' />
                        <a href='/send_email'>
                            <span className={styles.span}>뇌절 하셨나요?</span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
