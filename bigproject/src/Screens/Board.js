import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Board.module.css';
import axios from 'axios';
import { publishRefreshToken } from '../Utiles/axios';

const Board = () => {
    const { id } = useParams();
    const [like, setLike] = useState(0);
    const [likeState, setLikeState] = useState(false);
    const [detail, setDetail] = useState([]);
    const [loading, setLoading] = useState(false);
    const [authorCheck, setAuthorCheck] = useState(false);
    const [comments, setComments] = useState('');
    const [img, setImg] = useState();

    const nav = useNavigate();

    const getDetailData = async () => {
        const detail = await axios.get(`http://localhost:8000/api/post/${id}/`);
        setDetail(detail);
        setLike(detail.data.post.like);
        setImg(detail.data.post.user.profile_img);
        const author = detail.data.post.user.email;
        console.log(detail);
        authorChk(author);
    };

    const authorChk = (author) => {
        const user = JSON.parse(localStorage.getItem('user')).email;

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
            { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } }
        );
        window.location.reload();
    };
    const deleteClicked = async () => {
        publishRefreshToken();
        const a = {
            data: { id },
        };
        const headers = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
        };
        const data = await axios.delete(`http://localhost:8000/api/post/modify/${id}/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
        });

        nav('/community/1');
    };
    useEffect(() => {
        getDetailData();
    }, []);

    return (
        <div className={styles.container}>
            {loading ? (
                <>
                    <div>
                        <a href='/aivle/main'>
                            <img src='../aivle5.png' className={styles.logo} />
                        </a>
                    </div>
                    <div className={styles.content_container}>
                        <div className={styles.navbar}>
                            {authorCheck ? (
                                <>
                                    <ul>
                                        <li>
                                            <a href={`/modifypost/${detail.data.post.id}`}>??????</a>
                                        </li>
                                        <li>
                                            <a href='#' onClick={deleteClicked}>
                                                ??????
                                            </a>
                                        </li>
                                        <li>
                                            <a href={detail.data.prevPost === null ? '#' : `/board/${detail.data.prevPost.id}`}>?????????</a>
                                        </li>
                                    </ul>
                                </>
                            ) : (
                                <>
                                    <ul>
                                        <li>
                                            <a href={detail.data.prevPost === null ? '#' : `/board/${detail.data.prevPost.id}`}>?????????</a>
                                        </li>
                                    </ul>
                                </>
                            )}
                            <div>
                                <div>
                                    <a href={detail.data.nextPost === null ? '#' : `/board/${detail.data.nextPost.id}`}>?????????</a>
                                </div>
                                <div>
                                    <a href='/community/1'>??????</a>
                                </div>
                            </div>
                        </div>
                        <div className={styles.ArticleContentBox}>
                            <div className={styles.article_header}>
                                <div className={styles.ArticleTitle}>
                                    <h3 className={styles.title_text}>{detail.data.post['title']}</h3>
                                </div>
                                <ul className={styles.WriterInfo}>
                                    <li>
                                        <a className={styles.thumb}>
                                            <img src={img} alt='????????? ??????' width={50}></img>
                                        </a>
                                    </li>
                                    <li>
                                        <div className={styles.profile_area}>
                                            <button className={styles.profile_Info}>{detail.data.post.user.nick_name}</button>
                                            <div className={styles.article_Info}>
                                                <span className={styles.date}>{detail.data.post.update_dt.slice(5, 10)}</span>
                                                <span className={styles.count}>?????? {detail.data.post['view_count']}</span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className={styles.space}></div>
                            <div className={styles.article_container}>
                                <div className={styles.article_viewer}>
                                    <p>{detail.data.post['content']}</p>
                                </div>
                                <div className={styles.ReplyBox}>
                                    <a className={styles.like_btn_container}>
                                        <span
                                            onClick={async () => {
                                                setLikeState((prev) => {
                                                    return !prev;
                                                });
                                                await axios.get(`http://localhost:8000/api/post/${detail.data.post.id}/like/`, {
                                                    headers: {
                                                        Authorization: `Bearer ${localStorage.getItem('access')}`,
                                                    },
                                                });
                                                setLike((prev) => {
                                                    if (likeState) {
                                                        return prev - 1;
                                                    }
                                                    return prev + 1;
                                                });
                                            }}>
                                            {likeState ? (
                                                <img src='https://emojigraph.org/media/twitter/red-heart_2764-fe0f.png' width={17} />
                                            ) : (
                                                <img
                                                    src='https://cdn4.iconfinder.com/data/icons/48-bubbles/48/39.Heart-512.png'
                                                    width={17}
                                                />
                                            )}
                                        </span>
                                        <a className='like_btn'>????????? {like}</a>
                                    </a>

                                    <img src='https://cdn3.iconfinder.com/data/icons/school-subjects-1/48/a-17-512.png' width={17} />
                                    <a className='rpl'>?????? {detail.data.commentList.length}</a>
                                </div>
                                <div className={styles.CommentBox}></div>
                                <div className={styles.comment_option}>
                                    <h3 className={styles.comment_title}>??????</h3>
                                </div>
                                <ul className={styles.comment_list}>
                                    <div className={styles.CommentItem}>
                                        {detail.data.commentList.map((data) => {
                                            return (
                                                <div className={styles.comment_area}>
                                                    <div className={styles.comment_thumb}>
                                                        <img
                                                            src='https://cdn0.iconfinder.com/data/icons/leto-ui-generic-1/64/leto-04-512.png'
                                                            alt='????????? ??????'
                                                            width={30}></img>
                                                    </div>

                                                    <div className={styles.comment_box}>
                                                        <div className={styles.comment_nick_box}>{data['user']}</div>
                                                        <div className={styles.comment_text_box}>{data.content}</div>
                                                        <div className={styles.comment_info_box}>{data['create_dt']}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ul>

                                <div className={styles.commnet_list}></div>
                                <div className={styles.CommentWritter}>
                                    <div className={styles.comment_inbox}>
                                        <em className={styles.comment_inbox_name}>{localStorage.getItem('nickname')}</em>
                                        <textarea
                                            placeholder='????????? ???????????????'
                                            row='1'
                                            className={styles.comment_inbox_text}
                                            onChange={onCommentChg}></textarea>
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
                                            <a href='#' role='button' className={styles.btn_register} onClick={submitComment}>
                                                ??????
                                            </a>
                                        </div>
                                    </div>
                                    <div className='comment_attach'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default Board;
