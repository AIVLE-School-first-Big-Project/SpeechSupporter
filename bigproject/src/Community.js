import { load } from '@tensorflow-models/posenet';
import { data } from '@tensorflow/tfjs';
import axios from 'axios';
import { useState, useEffect } from 'react';
import styles from './Community.module.css';
import { publishRefreshToken } from './Utiles/axios';

const Community = () => {
    const [page, setPage] = useState();
    const [pageNum, setPageNum] = useState([]);
    const [postData, setPostData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [pagelist, setPagelist] = useState([]);

    const getData = async () => {
        publishRefreshToken();
        setLoading(false);
        const data = await axios.all([
            axios.get('http://localhost:8000/api/users/user/', {
                headers: { Authorization: localStorage.getItem('access') },
            }),
            await axios.get('http://localhost:8000/api/post/postlist/'),
        ]);
        setUserData(data[0]);
        setPostData(data[1]);
        setPage(data[1].data.pageCnt);
        setPageNum(() => {
            return page_num(page);
        });
        setLoading(true);
    };

    let p = [];

    const page_num = (tot) => {
        let page_num = [];

        if (tot < 10) {
            for (let k = 1; k < tot + 1; k++) {
                page_num.push(k);
            }
        } else {
            page_num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        }

        return page_num;
    };

    const leftbtn_appear = () => {
        if (pageNum[0] <= 1) {
            return <button onClick={left_btn}>◀</button>;
        }
    };

    const rightbtn_appear = () => {
        if (pageNum[pageNum.length - 1] < page) {
            return <button onClick={right_btn}>▶</button>;
        }
    };

    const right_btn = () => {
        let index_of_totpage = 10;
        for (let i = 0; i < 10; i++) {
            p[i] = pageNum[0] + 10 + i;
            if (p[i] == page) {
                index_of_totpage = i;
            }
        }
        p = p.slice(0, index_of_totpage + 1);
        setPageNum(p);
    };

    const left_btn = () => {
        for (let i = 0; i < 10; i++) {
            p[i] = pageNum[0] - 10 + i;
        }
        setPageNum(p);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className={styles.container}>
            {loading ? (
                <>
                    <div className={styles.topbar__container}>
                        <div></div>
                        <div>
                            <img src='aivle.png' className={styles.logo} />
                        </div>
                        <nav className={styles.navigator}>
                            <img className={styles.profile} src={userData.data.user['profile_img']} />
                            <h5 id='id'>{userData.data.user.nick_name}</h5>
                            <a href=''>
                                <img src='google.png' />
                            </a>
                            <a href=''>
                                <img src='google.png' />
                            </a>
                        </nav>
                    </div>
                    <nav className={styles.menu}>
                        <div>
                            <a href=''>자유게시판</a>
                            <a href=''>다른게시판</a>
                            <a href='http://localhost:3000/main'>메인으로</a>
                        </div>
                        <div className={styles.search}>
                            <input placeholder='검색' />
                        </div>
                    </nav>
                    <div className={styles.post_title}>
                        <div id={styles.number}></div>
                        <div id={styles.title}>제목</div>
                        <div id={styles.user_id}>ID</div>
                        <div id={styles.date}>날짜</div>
                        <div id={styles.like}>좋아요</div>
                        <div id={styles.view}>조회수</div>
                    </div>
                    <div className={styles.post}>
                        {postData.data.postList.map((data) => {
                            return (
                                <div className={styles.post_num}>
                                    <div id={styles.number}>{data['id']}</div>
                                    <div id={styles.title}>
                                        <a href={`board/${data.id}`}>{data['title']}</a>
                                    </div>
                                    <div id={styles.user_id}>{data['user']}</div>
                                    <div id={styles.date}>{data['create_dt'].slice(5, 10)}</div>
                                    <div id={styles.like}>
                                        <img src='https://emojigraph.org/media/twitter/red-heart_2764-fe0f.png' />
                                        {data['like']}
                                    </div>
                                    <div id={styles.view}>
                                        <img src='https://cdn2.iconfinder.com/data/icons/picol-vector/32/view-512.png' />
                                        {data['view_count']}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.footer}>
                        <div className={styles.write}>
                            <a href='/write'>
                                <button>글쓰기</button>
                            </a>
                        </div>
                        <div className={styles.page__conatainer}>
                            <div className={styles.page}>
                                {leftbtn_appear()}
                                {pageNum.map((num) => {
                                    return <a href=''>{num}</a>;
                                })}
                                {rightbtn_appear()}
                            </div>
                        </div>

                        <div className={styles.sort__conatainer}>
                            <div className={styles.sort}>
                                <input type='radio' name='sort' id='sort_date' defaultChecked />
                                <label htmlFor='sort_date'>최신순</label>
                                <input type='radio' name='sort' id='sort_like' />
                                <label htmlFor='sort_like'>좋아요순</label>
                                <input type='radio' name='sort' id='sort_view' />
                                <label htmlFor='sort_view'>조회순</label>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default Community;
