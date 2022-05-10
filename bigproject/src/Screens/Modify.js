import styles from "./Modify.module.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { publishRefreshToken } from "./Utiles/axios";

const BASE_URL = "http://localhost:8000/api/";

const Modify = () => {
  const [idValue, setIdValue] = useState("abcd@dcba.com");
  const [imgSrc, setImgSrc] = useState(null);
  const [passwordValue, setPasswordValue] = useState("");
  const [password2Value, setPassword2Value] = useState("");
  const [imgForm, setImageForm] = useState([]);
  const [nickNameValue, setNickNameValue] = useState("");
  const [companyValue, setCompanyValue] = useState("");
  const [imgFile, setImageFile] = useState(
    "https://images-ext-2.discordapp.net/external/RwTCihXk-8XznIG1dqikm3s5sffzfnXvWAKVvWhZsH4/https/cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png?width=936&height=936"
  );

  const getUserData = async () => {
    publishRefreshToken();

    const { data } = await axios.get(BASE_URL + "users/user/", {
      headers: { Authorization: localStorage.getItem("access") },
    });

    setIdValue(data.user.email);
    setNickNameValue(data.user["nick_name"]);
    setCompanyValue(data.user.wannabe);

    const img = data.user["profile_img"];

    setImgSrc(() => {
      if (img) {
        return `http://localhost:8000${img}`;
      } else {
        return "https://images-ext-2.discordapp.net/external/RwTCihXk-8XznIG1dqikm3s5sffzfnXvWAKVvWhZsH4/https/cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png?width=936&height=936";
      }
    });
  };

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

    formData.append("nick_name", nickNameValue);
    formData.append("email", idValue);
    formData.append("wannabe", companyValue);
    formData.append("profile_img", imgForm);

    const joinState = await axios.post(BASE_URL, formData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    if (joinState.data.state) {
      navigation("/login");
    }
  };

  const getImageFile = (event) => {
    const file = event.target.files;
    setImageFile(file[0].name);
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

  const loginChk = () => {
    const loginToken = localStorage.getItem("user");
    if (loginToken) {
      navigation("/modify");
    }
  };

  useEffect(() => {
    loginChk();
    getUserData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topbar__container}>
        <div></div>
        <div>
          <img src="aivle5.png" className={styles.logo} />
        </div>
        <nav className={styles.navigator}>
          <img className={styles.profile} src={imgSrc} />
          <h5 id="id">{nickNameValue}</h5>
          <a href="http://localhost:3000/modify">
            <img src="http://bens1.img12.kr/2021_m_category_renewal/m_icon_mypage.png" />
          </a>
        </nav>
      </div>
      <div className={styles.box}>
        <div className={styles.input__container}>
          <h1>이직할까?</h1>
          <div className={styles.upload__img__container}>
            <img src={imgFile} />
            <input type="file" accept="image/*" onChange={getImageFile} />
          </div>
          <div className={styles.form__container}>
            <form method="post">
              <label>아이디</label>
              <p>{idValue}</p>
              <label>비밀번호</label>
              <button type="button" onClick="">
                비밀번호 변경
              </button>
              <label htmlFor="nickname">Nickname</label>
              <input
                placeholder="Nickname"
                type="text"
                id="nickname"
                required
                onChange={nickNameValueChk}
              />
              <label htmlFor="company">희망하는 기업</label>
              <input
                placeholder="Nickname으로 사용됩니다"
                type="text"
                id="company"
                required
                onChange={companyValueChk}
              />
              <input type="submit" value="변경하기" onClick={handleJoininBtn} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modify;
