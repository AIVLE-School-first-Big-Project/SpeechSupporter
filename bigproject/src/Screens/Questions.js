import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Questions.module.css";

const Questions = (props) => {
  const { countList, btn } = props;

  const [question, setQusetion] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [timer, setTimer] = useState([]);
  const [items, setItems] = useState([]);

  const nav = useNavigate();

  const handleQuestion = (e) => {
    const value = e.target.value;
    setQusetion(value);
  };

  const handleAnswer = (e) => {
    const value = e.target.value;
    setAnswer(value);
  };

  const handleTimer = (e) => {
    const value = e.target.value;
    setTimer(value);
  };

  const onClick = () => {
    const item = {
      [`question`]: question,
      [`answer`]: answer,
      [`timer`]: timer,
    };

    setItems([...items, item]);
  };

  const goToInterview = () => {
    nav("/aivle/video", { state: { data: items } });
  };

  return (
    <body>
      <div>
        <div className={styles.QuestionContentBox}>
          <div className={styles.QuestionListBox}>
            <div className={styles.QuestionBox}>
              <div className={styles.Question_minus}>
                <div className={styles.cutBox_1}>
                  {countList &&
                    countList.map((div, i) => {
                      if (i < 6) {
                        return (
                          <div className={styles.Question} key={i}>
                            <div className={styles.Question_question}>
                              <input
                                class={styles.comment_inbox_question}
                                type="text"
                                placeholder="질문"
                                onChange={handleQuestion}
                              />
                            </div>
                            <div className={styles.Question_question}>
                              <input
                                class={styles.comment_inbox_answer}
                                type="text"
                                placeholder="대답"
                                onChange={handleAnswer}
                              />
                            </div>
                            <div className={styles.Question_question}>
                              <input
                                class={styles.comment_inbox_time}
                                type="number"
                                placeholder="시간"
                                onChange={handleTimer}
                              />
                            </div>

                            <button
                              onClick={onClick}
                              className={items[i] ? styles.hidden : ""}
                            >
                              저장
                            </button>
                            <span
                              className={items[i] ? styles.span : styles.hidden}
                            >
                              ✅
                            </span>
                          </div>
                        );
                      }
                    })}
                </div>
                <div className={styles.cutBox_2}>{btn}</div>
              </div>
            </div>
          </div>
          <div className={styles.Button_area}>
            <button class={styles.goTo_button} onClick={goToInterview}>
              면접보러가기
            </button>
          </div>
        </div>
      </div>
    </body>
  );
};

export default Questions;
