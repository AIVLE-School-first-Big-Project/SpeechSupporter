import { useState, useEffect } from "react";
import styles from "./Board.module.css";

const data = [
  {
    id: 15,
    user: "소연 이",
    title: "취준생을 위한 면접 도우미  : AIVLE",
    category: null,
    content:
      "기업들이 AI 면접을 채용 프로세스에 추가하고 있지만, 이를 준비하기 위해서는 서로의 면접 준비를 도와줄 사람을 구해야 하는 등 많은 제약이 존재한다. 이러한 상황 속에서 AI를 통해 취업 준비생들이 면접 준비를 수월하게 할 수 있도록 도와주고 서로 정보 공유를 할 수 있는 커뮤니티를 조성하여 도움을 주고자 한다. ",
    create_dt: "2022-04-19T21:21:11.541097+09:00",
    like: 15,
    view_count: 2,
    comment: "일단 댓글 작성해봅니다",
  },
  {
    id: 16,
    user: "Soyeon Lee",
    title: "게시글 작성 test 2",
    category: null,
    content: "게시글 작성 test 2 중 입니다.",
    create_dt: "2022-04-21T21:21:11.541097+09:00",
    like: 131,
    view_count: 256,
  },
];

const dat = [
  {
    id: 15,
    user: "밍밍밍",
    comment: "댓글 작성 test 중 입니다.",
    create_dt: "2022-04-19T21:21:11.541097+09:00",
  },
  {
    id: 16,
    user: "홍홍홍",
    comment: "댓글 작성 test 2 중 입니다.",
    create_dt: "2022-04-21T21:21:11.541097+09:00",
  },
];
const pagecnt = 10;
const curpage = 1;

const Board = () => {
  const [data_com, setData] = useState([]);
  const [like, setLike] = useState(data[0]["like"]);
  const [likeState, setLikeState] = useState(false);

  useEffect(() => {
    setData(dat);
  }, []);

  return (
    <div className={styles.container}>
      <div>
        <img src="aivle.png" className={styles.logo} />
      </div>
      <div className={styles.content_container}>
        <div class={styles.navbar}>
          <ul>
            <li>
              <a href="#">수정</a>
            </li>
            <li>
              <a href="#">삭제</a>
            </li>
            <li>
              <a href="#">이전글</a>
            </li>
          </ul>
          <div>
            <a href="#">다음글</a>
          </div>
          <div>
            <a href="#">목록</a>
          </div>
        </div>
        <div className={styles.ArticleContentBox}>
          <div className={styles.article_header}>
            <div className={styles.ArticleTitle}>
              <a className={styles.link_board}>전체 글 보기</a>
              <h3 className={styles.title_text}>{data[0]["title"]}</h3>
            </div>
            <ul className={styles.WriterInfo}>
              <li>
                <a className={styles.thumb}>
                  <img
                    src="https://cdn0.iconfinder.com/data/icons/leto-ui-generic-1/64/leto-04-512.png"
                    alt="프로필 사진"
                    width={50}
                  ></img>
                </a>
              </li>
              <li>
                <div className={styles.profile_area}>
                  <button className={styles.profile_Info}>
                    {data[0]["user"]}
                  </button>
                  <div className={styles.article_Info}>
                    <span className={styles.date}>{data[0]["create_dt"]}</span>
                    <span className={styles.count}>
                      조회 {data[0]["view_count"]}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className={styles.space}></div>
          <div className={styles.article_container}>
            <div className={styles.article_viewer}>
              <p>{data[0]["content"]}</p>
            </div>
            <div className={styles.ReplyBox}>
              <a className={styles.like_btn_container}>
                <span
                  onClick={() => {
                    setLikeState((prev) => {
                      return !prev;
                    });
                    setLike((prev) => {
                      if (likeState) {
                        return prev - 1;
                      }
                      return prev + 1;
                    });
                  }}
                >
                  {likeState ? (
                    <img
                      src="https://emojigraph.org/media/twitter/red-heart_2764-fe0f.png"
                      width={17}
                    />
                  ) : (
                    <img
                      src="https://cdn4.iconfinder.com/data/icons/48-bubbles/48/39.Heart-512.png"
                      width={17}
                    />
                  )}
                </span>
                <a class="like_btn">좋아요 {like}</a>
              </a>

              <img
                src="https://cdn3.iconfinder.com/data/icons/school-subjects-1/48/a-17-512.png"
                width={17}
              />
              <a class="rpl">댓글 {data[0]["view_count"]}</a>
            </div>
            <div className={styles.CommentBox}></div>
            <div className={styles.comment_option}>
              <h3 className={styles.comment_title}>댓글</h3>
            </div>
            <ul class={styles.comment_list}>
              <div class={styles.CommentItem}>
                {data_com.map((data_com) => {
                  return (
                    <div className={styles.comment_area}>
                      <div class={styles.comment_thumb}>
                        <img
                          src="https://cdn0.iconfinder.com/data/icons/leto-ui-generic-1/64/leto-04-512.png"
                          alt="프로필 사진"
                          width={30}
                        ></img>
                      </div>

                      <div class={styles.comment_box}>
                        <div class={styles.comment_nick_box}>
                          {data_com["user"]}
                        </div>
                        <div class={styles.comment_text_box}>
                          {data_com["comment"]}
                        </div>
                        <div class={styles.comment_info_box}>
                          {data_com["create_dt"]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ul>

            <div className={styles.commnet_list}></div>
            <div className={styles.CommentWritter}>
              <div className={styles.comment_inbox}>
                <em className={styles.comment_inbox_name}>{data[0]["user"]}</em>

                <textarea
                  placeholder="댓글을 남겨보세요"
                  row="1"
                  class={styles.comment_inbox_text}
                ></textarea>
              </div>
              <div className={styles.comment_attach}>
                {/* <div className={styles.attach_box}>
                <img
                  src="https://cdn0.iconfinder.com/data/icons/interface-line-4/48/Camera_capture_interface_-512.png"
                  width={17}
                />
                <img
                  src="https://cdn0.iconfinder.com/data/icons/lineo-shopping/100/customer_satisfaction-512.png"
                  width={17}
                />
              </div> */}
                <div class={styles.register_box}>
                  <a href="#" role="button" className={styles.btn_register}>
                    등록
                  </a>
                </div>
              </div>
              <div className="comment_attach"></div>
            </div>
          </div>
        </div>
        <div className={styles.ArticleBottomBtns}>
          <div class={styles.navbar_2}>
            <ul>
              <li>
                <a href="#" role="button" class={styles.BaseButton}>
                  <span class={styles.BaseButton__txt}>글쓰기</span>
                </a>
              </li>
              <li>
                <a href="#" role="button" class="BaseButton">
                  <span class="BaseButton__txt">수정</span>
                </a>
              </li>
              <li>
                <a href="#" role="button" class="BaseButton">
                  <span class="BaseButton__txt">삭제</span>
                </a>
              </li>
            </ul>
            <div>
              <a href="#">목록</a>
            </div>
            <div>
              <a href="#">TOP</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
