import { useState, useEffect, useRef } from 'react';
import styles from './Community.module.css';
import axios from 'axios';
import { publishRefreshToken } from './Utiles/axios';

const BASE_URL = 'http://localhost:8000/api/';

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

const Community = () => {
    const [idValue, setIdValue] = useState('');
    const [nickNameValue, setNickNameValue] = useState('');
    const [companyValue, setCompanyValue] = useState('');
    const [imgSrc, setImgSrc] = useState(null);
    const [postList, setPostList] = useState([]);
    const [curPage, setCurPage] = useState();
    const [pageCnt, setPageCnt] = useState();
    const [pagelist, setPagelist] = useState([]);

    let p = [];

    const getUserData = async () => {
        publishRefreshToken();

        const { data } = await axios.get(BASE_URL + 'users/user/', {
            headers: { Authorization: localStorage.getItem('access') },
        });

        setIdValue(data.user.email);
        setNickNameValue(data.user['nick_name']);
        setCompanyValue(data.user.wannabe);

        const img = data.user['profile_img'];

        setImgSrc(() => {
            if (img) {
                return `http://localhost:8000${img}`;
            } else {
                return 'https://images-ext-2.discordapp.net/external/RwTCihXk-8XznIG1dqikm3s5sffzfnXvWAKVvWhZsH4/https/cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png?width=936&height=936';
            }
        });
    };

    const getPostData = async () => {
        publishRefreshToken();

        const data = await axios.get(BASE_URL + 'post/postlist/');

        setPostList(data.data.postList);
        setCurPage(data.data.curPage);
        setPageCnt(data.data.pageCnt);
        setPagelist(page_num(data.data.pageCnt));
    };

    const leftbtn_appear = () => {
        if (pagelist[0] != 1) {
            return <button onClick={left_btn}>◀</button>;
        }
    };

    const rightbtn_appear = () => {
        if (pagelist[pagelist.length - 1] < { pageCnt }) {
            return <button onClick={right_btn}>▶</button>;
        }
    };

    const right_btn = () => {
        let index_of_totpage = 10;
        for (let i = 0; i < 10; i++) {
            p[i] = pagelist[0] + 10 + i;
            if (p[i] == { pageCnt }) {
                index_of_totpage = i;
            }
        }
        p = p.slice(0, index_of_totpage + 1);
        setPagelist(p);
    };

    const left_btn = () => {
        for (let i = 0; i < 10; i++) {
            p[i] = pagelist[0] - 10 + i;
        }
        setPagelist(p);
    };

    useEffect(() => {
        getUserData();
        getPostData();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.topbar__container}>
                <div></div>
                <div>
                    <img src='aivle.png' className={styles.logo} />
                </div>
                <nav className={styles.navigator}>
                    <img className={styles.profile} src={imgSrc} />
                    <h5 id='id'>{nickNameValue}</h5>
                    <a href='http://localhost:3000/modify'>
                        <img src='http://bens1.img12.kr/2021_m_category_renewal/m_icon_mypage.png' />
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
                {postList.map((data) => {
                    return (
                        <div className={styles.post_num}>
                            <div id={styles.number}>{data['id']}</div>
                            <div id={styles.title}>
                                <a href={`/board/${data.id}`}>{data['title']}</a>
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
                    <a href='http://localhost:3000/write'>
                        <button>글쓰기</button>
                    </a>
                </div>
                <div className={styles.page__conatainer}>
                    <div className={styles.page}>
                        {leftbtn_appear()}
                        {pagelist.map((num) => {
                            return (
                                <a
                                    href='http://localhost:3000/community'
                                    id={num}
                                    className={num == curPage ? styles.selected_page : styles.not_curpage}>
                                    {num}
                                </a>
                            );
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
        </div>
    );
};

export default Community;
