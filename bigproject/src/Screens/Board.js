import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./Board.module.css";
import axios from "axios";
import { publishRefreshToken } from "./Utiles/axios";

const data = [
  {
    id: 15,
    user: "소연 이",
    title: "게시글 작성 test",
    category: null,
    content:
      "게시글 작성 test 중 입니다. 게시글을 길게 작성해봅시다. 지금부터는 복붙/n 게시글 작성 test 중 입니다. 게시글을 길게 작성해봅시다. 지금부터는 복붙/n게시글 작성 test 중 입니다. 게시글을 길게 작성해봅시다. 지금부터는 복붙/n게시글 작성 test 중 입니다. 게시글을 길게 작성해봅시다. 지금부터는 복붙/n게시글 작성 test 중 입니다. 게시글을 길게 작성해봅시다. 지금부터는 복붙/n",
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
  const { id } = useParams();
  const [data_com, setData] = useState([]);
  const [like, setLike] = useState(0);
  const [likeState, setLikeState] = useState(false);
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authorCheck, setAuthorCheck] = useState(false);
  const [comments, setComments] = useState("");

  const getDetailData = async () => {
    const detail = await axios.get(`http://localhost:8000/api/post/${id}/`);
    setDetail(detail);
    setLike(detail.data.post.like);
    const author = detail.data.post.email;
    authorChk(author);
    console.log(detail);
  };

  const authorChk = (author) => {
    const user = JSON.parse(localStorage.getItem("user")).email;

    if (user == author) {
      setAuthorCheck(() => {
        return true;
      });
    }
    setLoading(true);
  };

  const onCommentChg = (e) => {
    const value = e.target.value;
    setComments(value);
  };

  const submitComment = async () => {
    publishRefreshToken();
    const comment = await axios.post(
      `http://localhost:8000/api/post/${detail.data.post.id}/comment/`,
      {
        content: comments,
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
    );
    window.location.reload();
  };

  useEffect(() => {
    setData(dat);
    getDetailData();
  }, []);

  return (
    <div className={styles.container}>
      {loading ? (
        <>
          <div>
            <img src="../aivle5.png" className={styles.logo} />
          </div>
          <div className={styles.content_container}>
            <div className={styles.navbar}>
              {authorCheck ? (
                <>
                  <ul>
                    <li>
                      <a href="#">수정</a>
                    </li>
                    <li>
                      <a href="#">삭제</a>
                    </li>
                    <li>
                      <a
                        href={
                          detail.data.prevPost === null
                            ? "#"
                            : `/board/${detail.data.prevPost.id}`
                        }
                      >
                        이전글
                      </a>
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <ul>
                    <li>
                      <a
                        href={
                          detail.data.prevPost === null
                            ? "#"
                            : `/board/${detail.data.prevPost.id}`
                        }
                      >
                        이전글
                      </a>
                    </li>
                  </ul>
                </>
              )}
              <div>
                <a
                  href={
                    detail.data.nextPost === null
                      ? "#"
                      : `/board/${detail.data.nextPost.id}`
                  }
                >
                  다음글
                </a>
              </div>
              <div>
                <a href="/community">목록</a>
              </div>
            </div>
            <div className={styles.ArticleContentBox}>
              <div className={styles.article_header}>
                <div className={styles.ArticleTitle}>
                  {/* <a className={styles.link_board}>전체 글 보기</a> */}
                  <h3 className={styles.title_text}>
                    {detail.data.post["title"]}
                  </h3>
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
                        {detail.data.post.user}
                      </button>
                      <div className={styles.article_Info}>
                        <span className={styles.date}>
                          {detail.data.post.update_dt.slice(5, 10)}
                        </span>
                        <span className={styles.count}>
                          조회 {detail.data.post["view_count"]}
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className={styles.space}></div>
              <div className={styles.article_container}>
                <div className={styles.article_viewer}>
                  <p>{detail.data.post["content"]}</p>
                </div>
                <div className={styles.ReplyBox}>
                  <a className={styles.like_btn_container}>
                    <span
                      onClick={async () => {
                        setLikeState((prev) => {
                          return !prev;
                        });
                        await axios.get(
                          `http://localhost:8000/api/post/${detail.data.post.id}/like/`,
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "access"
                              )}`,
                            },
                          }
                        );
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
                    <a className="like_btn">좋아요 {like}</a>
                  </a>

                  <img
                    src="https://cdn3.iconfinder.com/data/icons/school-subjects-1/48/a-17-512.png"
                    width={17}
                  />
                  <a className="rpl">댓글 {detail.data.commentList.length}</a>
                </div>
                <div className={styles.CommentBox}></div>
                <div className={styles.comment_option}>
                  <h3 className={styles.comment_title}>댓글</h3>
                </div>
                <ul className={styles.comment_list}>
                  <div className={styles.CommentItem}>
                    {detail.data.commentList.map((data) => {
                      return (
                        <div className={styles.comment_area}>
                          <div className={styles.comment_thumb}>
                            <img
                              src="https://cdn0.iconfinder.com/data/icons/leto-ui-generic-1/64/leto-04-512.png"
                              alt="프로필 사진"
                              width={30}
                            ></img>
                          </div>

                          <div className={styles.comment_box}>
                            <div className={styles.comment_nick_box}>
                              {data["user"]}
                            </div>
                            <div className={styles.comment_text_box}>
                              {data.content}
                            </div>
                            <div className={styles.comment_info_box}>
                              {data["create_dt"]}
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
                    <em className={styles.comment_inbox_name}>
                      {detail.data.post["user"]}
                    </em>
                    <input
                      type="text"
                      placeholder="댓글을 남겨보세요"
                      className={styles.comment_inbox_text}
                      onChange={onCommentChg}
                    />
                    {/* <textarea
                      placeholder="댓글을 남겨보세요"
                      row="1"
                      className={styles.comment_inbox_text}
                      onChange={onCommentChg}
                    ></textarea> */}
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
                    <div className={styles.register_box}>
                      <a
                        href="#"
                        role="button"
                        className={styles.btn_register}
                        onClick={submitComment}
                      >
                        등록
                      </a>
                    </div>
                  </div>
                  <div className="comment_attach"></div>
                </div>
              </div>
            </div>
            <div className={styles.ArticleBottomBtns}>
              <div className={styles.navbar_2}>
                <ul>
                  <li>
                    <a href="#" role="button" className={styles.BaseButton}>
                      <span className={styles.BaseButton__txt}>글쓰기</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" role="button" className="BaseButton">
                      <span className="BaseButton__txt">수정</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" role="button" className="BaseButton">
                      <span className="BaseButton__txt">삭제</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">목록</a>
                  </li>
                  <li>
                    <a href="#">TOP</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Board;