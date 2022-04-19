import { useState, useRef } from 'react';
import './App.css';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const MainPage = () => {
    const x = useMotionValue(0);
    const background = useTransform(x, [-100, 0, 100], ['#ff008c', '#7700ff', 'rgb(230, 255, 0)']);

    const [loginState, setLoginState] = useState(false);
    const [idInputState, setIdInputState] = useState(false);
    const [passwordInputState, setPasswordInputState] = useState(false);

    const passwordValueChk = (event) => {
        if (event.target.value !== '') {
            setPasswordInputState(true);
        } else {
            setPasswordInputState(false);
        }
    };
    const idValueChk = (event) => {
        if (event.target.value !== '') {
            setIdInputState(true);
        } else {
            setIdInputState(false);
        }
    };
    return (
        <>
            <button
                className='test'
                onClick={() => {
                    setLoginState((prev) => {
                        return !prev;
                    });
                }}>
                돌아버렷!
            </button>
            {loginState ? (
                <>
                    <div className='container'>
                        <motion.div className='App__rotate' drag='x' dragConstraints={{ left: 0, right: 0 }} style={{ x }}>
                            <div className='top'></div>
                            <div className='hole'></div>
                            <div className='logo_container'>
                                <img className='logo' src='aivle.png' />
                            </div>
                            <div className='img__container'>
                                <img src='' />
                            </div>
                        </motion.div>
                    </div>
                </>
            ) : (
                <>
                    <div className='container'>
                        <div className='neckless__container'>
                            <div className='neckless_front'></div>
                            <div className='neckless_back'></div>
                        </div>
                        <div className='App'>
                            <div className='top'></div>
                            <div className='hole'></div>
                            <div className='logo_container'>
                                <img className='logo' src='aivle.png' />
                            </div>
                            <form id='login__form'>
                                <div className='id__container'>
                                    <input id='id' type='text' className='id_input' onChange={idValueChk} require autoComplete='off' />
                                    <label htmlFor='id' className={idInputState ? 'id_label__focused' : 'id_label'}>
                                        아이디를 입력해주세요.
                                    </label>
                                </div>
                                <div className='password__container'>
                                    <input
                                        type='password'
                                        id='password'
                                        className='password_input'
                                        onChange={passwordValueChk}
                                        required
                                        autoComplete='off'
                                    />
                                    <label htmlFor='password' className={passwordInputState ? 'password_label__focused' : 'password_label'}>
                                        패스워드를 입력해주세요.
                                    </label>
                                </div>
                                <input type='submit' value='로그인' />
                            </form>
                            <div className='regist__container'>
                                <a href=''>
                                    <span className='span'>Join Us</span>
                                </a>
                            </div>
                            <div className='link__container'>
                                <img style={{ width: '30px' }} src='./google.png' />
                                <a href=''>
                                    <span className='span'>Login With Google</span>
                                </a>
                            </div>

                            <div className='hidden'>
                                <img src='' />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default MainPage;
