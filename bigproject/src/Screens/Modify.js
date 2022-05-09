import styles from './Modify.module.css';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8000/api/users/register/';

const Modify = () => {
    const [idValue, setIdValue] = useState('abcd@dcba.com');
    const [passwordValue, setPasswordValue] = useState('');
    const [password2Value, setPassword2Value] = useState('');
    const [imgForm, setImageForm] = useState([]);
    const [nickNameValue, setnickNameValue] = useState('');
    const [companyValue, setCompanyValue] = useState('');
    const [imgFile, setImageFile] = useState(
        'https://images-ext-2.discordapp.net/external/RwTCihXk-8XznIG1dqikm3s5sffzfnXvWAKVvWhZsH4/https/cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png?width=936&height=936'
    );

    let formData = new FormData();
    const navigation = useNavigate();

    const handleJoininBtn = (event) => {
        event.preventDefault();
        sendLoginData(passwordValue, password2Value);
    };

    const sendLoginData = async (password, password2) => {
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
        setImageFile(file[0].name);
        setImageForm(file[0]);
    };

    const nickNameValueChk = (event) => {
        const value = event.target.value;
        setnickNameValue(value);
    };

    const companyValueChk = (event) => {
        const value = event.target.value;
        setCompanyValue(value);
    };

    const onChgPasswordBtnClicked = () => {
        navigation('/modify_password');
    };

    useEffect(() => {}, []);

    return (
        <div className={styles.container}>
            <div className={styles.employee__card}>
                <div className={styles.neckless__container}>
                    <div className={styles.neckless_front}></div>
                    <div className={styles.neckless_back}></div>
                </div>
                <div className={styles.App__rotate}>
                    <div className={styles.top}></div>
                    <div className={styles.hole}></div>
                    <div className={styles.logo_container}>
                        <img className={styles.logo} src='aivle.png' />
                    </div>
                    <div className={styles.img__container}>
                        <img src={imgFile} />
                    </div>
                    <div className={styles.employee__card__text__container}>
                        <span>이메일 : {idValue}</span>
                        <span>닉네임 : {nickNameValue}</span>
                        <span>{companyValue}</span>
                    </div>
                </div>
            </div>
            <div className={styles.input__container}>
                <h1>이직할까?</h1>
                <div className={styles.upload__img__container}>
                    <img src={imgFile} />
                    <input type='file' accept='image/*' onChange={getImageFile} />
                </div>
                <div className={styles.form__container}>
                    <form method='post'>
                        <label>아이디</label>
                        <p>{idValue}</p>
                        <label>비밀번호</label>
                        <button type='button' onClick={onChgPasswordBtnClicked}>
                            비밀번호 변경
                        </button>
                        <label htmlFor='nickname'>Nickname</label>
                        <input placeholder='Nickname' type='text' id='nickname' required onChange={nickNameValueChk} />
                        <label htmlFor='company'>희망하는 기업</label>
                        <input placeholder='Nickname으로 사용됩니다' type='text' id='company' required onChange={companyValueChk} />
                        <input type='submit' value='변경하기' onClick={handleJoininBtn} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Modify;
