import styles from './Modify.module.css';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { publishRefreshToken } from '../Utiles/axios';

const BASE_URL = 'http://localhost:8000/api/';

const Modify = () => {
    const [idValue, setIdValue] = useState('abcd@dcba.com');
    const [imgSrc, setImgSrc] = useState(
        'https://images-ext-2.discordapp.net/external/RwTCihXk-8XznIG1dqikm3s5sffzfnXvWAKVvWhZsH4/https/cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png?width=936&height=936'
    );
    const [passwordValue, setPasswordValue] = useState('');
    const [password2Value, setPassword2Value] = useState('');
    const [imgForm, setImageForm] = useState([]);
    const [nickNameValue, setNickNameValue] = useState('');
    const [companyValue, setCompanyValue] = useState('');
    const [message, setMessage] = useState(null);

    const getUserData = async () => {
        const { data } = await axios.get(BASE_URL + 'users/user/', {
            headers: { Authorization: `${localStorage.getItem('access')}` },
        });

        console.log(data);
        setIdValue(data.user.email);
        setNickNameValue(data.user['nick_name']);
        setCompanyValue(data.user.wannabe);
        setMessage(data);

        const img = data.user['profile_img'];

        setImgSrc(() => {
            if (img) {
                return `http://localhost:8000${img}`;
            } else {
                return 'https://images-ext-2.discordapp.net/external/RwTCihXk-8XznIG1dqikm3s5sffzfnXvWAKVvWhZsH4/https/cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png?width=936&height=936';
            }
        });
    };

    // 데이터 전달 수정필요
    let formData = new FormData();
    const navigation = useNavigate();

    const handleJoininBtn = (event) => {
        event.preventDefault();
        sendLoginData(passwordValue, password2Value);
    };

    const sendLoginData = async (password, password2) => {
        const loginData = {
            nick_name: nickNameValue,
            password: passwordValue,
            email: idValue,
            wannabe: companyValue,
        };

        formData.append('nick_name', nickNameValue);
        formData.append('email', idValue);
        formData.append('wannabe', companyValue);
        formData.append('profile_img', imgForm);

        const joinState = await axios.post(BASE_URL, formData, {
            headers: {
                'content-type': 'multipart/form-data',
            },
        });
        if (joinState.data.state) {
            navigation('/login');
        }
    };

    const getImageFile = (event) => {
        const file = event.target.files;
        setImgSrc(file[0].name);
        setImageForm(file[0]);
    };

    const nickNameValueChk = (event) => {
        const value = event.target.value;
        setNickNameValue(value);
    };

    const companyValueChk = (event) => {
        const value = event.target.value;
        setCompanyValue(value);
    };

    //여기까지

    const loginChk = () => {
        const loginToken = localStorage.getItem('user');
        if (loginToken) {
            navigation('/modify');
        }
    };

    const clickChgPassword = () => {
        if (message === undefined) {
            localStorage.clear();
        } else {
            localStorage.clear();
            navigation('/send_email');
        }
    };

    useEffect(() => {
        loginChk();
        getUserData();
    }, []);

    useEffect(() => {
        if (message === undefined) {
            localStorage.clear();
        }
    }, [message]);

    return (
        <div className={styles.container}>
            <div className={styles.topbar__container}>
                <div></div>
                <div>
                    <a href='/aivle/main'>
                        <img src='aivle5.png' className={styles.logo} />
                    </a>
                </div>
                <nav className={styles.navigator}>
                    <img className={styles.profile} src={imgSrc} />
                    <h5 id='id'>{nickNameValue}</h5>
                    <a href='http://localhost:3000/modify'>
                        <img src='http://bens1.img12.kr/2021_m_category_renewal/m_icon_mypage.png' />
                    </a>
                </nav>
            </div>
            <div className={styles.box}>
                <div className={styles.nav}>
                    <a href='/modify'>1. 회원정보 수정</a>
                    <a href='/modify_post'>2. 내가 작성한 글</a>
                    <a href='/modify_feedback'>3. 받은 피드백</a>
                </div>
                <div className={styles.input__container}>
                    <h1>이직할까?</h1>
                    <div className={styles.upload__img__container}>
                        <img src={imgSrc} />
                        <input type='file' accept='image/*' onChange={getImageFile} />
                    </div>
                    <div className={styles.form__container}>
                        <form method='post'>
                            <label>아이디</label>
                            <p>{idValue}</p>
                            <label>비밀번호</label>
                            <button type='button' onClick={clickChgPassword}>
                                비밀번호 변경
                            </button>
                            <label htmlFor='nickname'>Nickname</label>
                            <input placeholder={nickNameValue} type='text' id='nickname' required onChange={nickNameValueChk} />
                            <label htmlFor='company'>희망하는 기업</label>
                            <input placeholder={companyValue} type='text' id='company' required onChange={companyValueChk} />
                            <input type='submit' value='변경하기' onClick={handleJoininBtn} />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modify;
