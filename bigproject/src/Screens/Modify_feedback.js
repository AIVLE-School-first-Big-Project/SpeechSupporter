import styles from "./Modify_feedback.module.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { publishRefreshToken } from "../Utiles/axios";

const BASE_URL = "http://localhost:8000/api/";

const Modify_feedback = () => {
  const [idValue, setIdValue] = useState("abcd@dcba.com");
  const [imgSrc, setImgSrc] = useState(null);
  const [nickNameValue, setNickNameValue] = useState("");
  const [companyValue, setCompanyValue] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);

  const getFeedbackData = async () => {
    publishRefreshToken();
    const { data } = await axios.get(
      "http://localhost:8000/api/service/history/",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      }
    );
    setFeedbackList(data.historyList);
    console.log(feedbackList);
  };

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

  useEffect(() => {
    getUserData();
    getFeedbackData();
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
        <div className={styles.nav}>
          <a href="/modify">1. 회원정보 수정</a>
          <a href="/modify_post">2. 내가 작성한 글</a>
          <a href="/modify_feedback">3. 받은 피드백</a>
        </div>
        <div className={styles.feedback_container}>
          <div className={styles.feedback_title}>받은 피드백 목록</div>
          <div className={styles.feedback_list}>
            {feedbackList.map((data) => {
              return (
                <div className={styles.feedback_num}>
                  <div className={styles.feedback_id}>{data.id}</div>
                  <div className={styles.feedback_pose}>{data.pose}</div>
                  <div className={styles.feedback_voice}>{data.voice}</div>
                  <div className={styles.feedback_dt}>
                    {data.create_dt.slice(2, 10)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modify_feedback;
