import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import axios from "axios";
import jwt_decode from "jwt-decode";

const url = "http://localhost:8000/api/token/";

const LoginPage = () => {
  const [idInputState, setIdInputState] = useState(false);
  const [passwordInputState, setPasswordInputState] = useState(false);
  const [idValue, setIdValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [idNum, setIdNum] = useState(0);
  const [state, setState] = useState(false);
  const [message, setMessage] = useState("");

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
      const userData = { email: decode.user_email };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      navigation("/aivle/main");
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

  const passwordValueChk = (event) => {
    if (event.target.value !== "") {
      setPasswordInputState(true);
    } else {
      setPasswordInputState(false);
    }
    setPasswordValue(event.target.value);
  };
  const idValueChk = (event) => {
    if (event.target.value !== "") {
      setIdInputState(true);
    } else {
      setIdInputState(false);
    }
    setIdValue(event.target.value);
  };

  const loginChk = () => {
    const loginToken = localStorage.getItem("user");
    if (loginToken) {
      navigation("/aivle/main");
    }
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
            <img className={styles.logo} src="aivle5.png" unselectable="on" />
          </div>
          <div id={styles.login__form}>
            <div className={styles.id__container}>
              <input
                id={styles.id}
                type="text"
                className={styles.id_input}
                onChange={idValueChk}
                require
                autoComplete="off"
              />
              <label
                htmlFor="id"
                className={
                  idInputState ? styles.id_label__focused : styles.id_label
                }
              >
                아이디를 입력해주세요.
              </label>
            </div>
            <div className={styles.password__container}>
              <input
                type="password"
                id={styles.password}
                className={styles.password_input}
                onChange={passwordValueChk}
                required
                autoComplete="off"
              />
              <label
                htmlFor="password"
                className={
                  passwordInputState
                    ? styles.password_label__focused
                    : styles.password_label
                }
              >
                패스워드를 입력해주세요.
              </label>
            </div>
            <input
              type="submit"
              value="로그인"
              onClick={handleLoginBtn}
              id={styles.login__button}
            />
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
          <a href="/register" className={styles.regist__container}>
            <span className={styles.span}>입사하기</span>
          </a>
          <a href="aivle/send_email" className={styles.link__container}>
            <span className={styles.span}>비밀번호 초기화</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
