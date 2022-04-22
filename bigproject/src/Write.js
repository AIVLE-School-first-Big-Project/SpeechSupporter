import styles from "./Write.module.css";

const Write = () => {
  return (
    <div className={styles.container}>
      <img src="aivle.png" className={styles.logo} />
      <nav className={styles.navi}>
        <img className={styles.profile} src="king.png" />
        <h5 id="id">아이디</h5>
        <a href="">
          <img src="google.png" />
        </a>
        <a href="">
          <img src="google.png" />
        </a>
      </nav>
      <div className={styles.head}>
        <span>글 쓰 기</span>
      </div>
      <div className={styles.select}>
        <input type="radio" id="radio" />
        <span>자유게시판</span>
        <input type="radio" id="radio" />
        <span>다른게시판</span>
        <input type="radio" id="radio" />
        <span>다른게시판</span>
      </div>
      <div className={styles.input_title}>
        <input type="text" placeholder="제목을 입력하세요." />
      </div>
      <div className={styles.input_content}>공 사 중</div>
      <div className={styles.foot}>
        <div className={styles.write_button}>
          <a href="">
            <button>저 장</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Write;
