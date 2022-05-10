import axios from "axios";
import styles from "./Write.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { publishRefreshToken } from "../Utiles/axios";

const BASE_URL = "http://localhost:8000/api/";
const url = "http://localhost:8000/api/post/post/";

const Write = () => {
  const [idValue, setIdValue] = useState("");
  const [companyValue, setCompanyValue] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(0);
  const [imgSrc, setImgSrc] = useState(null);
  const [nickNameValue, setNickNameValue] = useState("");

  const nav = useNavigate();

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

  const sendPostData = async () => {
    publishRefreshToken();

    const data = {
      title,
      content,
      user: JSON.parse(localStorage.getItem("user")).email,
    };
    console.log(localStorage.getItem("access"));
    const post = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
  };

  const onTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
  };

  const onContentChange = (e) => {
    const value = e.target.value;
    setContent(value);
  };

  const saveBtnClick = () => {
    sendPostData();
    nav("/community");
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className={styles.container}>
      <img src="aivle5.png" className={styles.logo} />
      <nav className={styles.navi}>
        <img className={styles.profile} src={imgSrc} />
        <h5 id="id">{nickNameValue}</h5>
        <a href="http://localhost:3000/modify">
          <img src="http://bens1.img12.kr/2021_m_category_renewal/m_icon_mypage.png" />
        </a>
      </nav>
      <div className={styles.head}>
        <span>글 쓰 기</span>
      </div>
      <div className={styles.select}>
        <input
          type="radio"
          name="fuck"
          id="radio"
          onClick={() => {
            setCategory(1);
          }}
          defaultChecked
        />
        <span>자유게시판</span>
        <input
          type="radio"
          name="fuck"
          id="radio"
          onClick={() => {
            setCategory(2);
          }}
        />
        <span>다른게시판</span>
        <input
          type="radio"
          name="fuck"
          id="radio"
          onClick={() => {
            setCategory(3);
          }}
        />
        <span>다른게시판</span>
      </div>
      <div className={styles.input_title}>
        <input
          type="text"
          placeholder="제목을 입력하세요."
          onChange={onTitleChange}
        />
      </div>
      <div className={styles.input_content}>
        <input type="text" onChange={onContentChange} />
      </div>
      <div className={styles.foot}>
        <div className={styles.write_button}>
          <button onClick={saveBtnClick}>저 장</button>
        </div>
      </div>
    </div>
  );
};

export default Write;
