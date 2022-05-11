import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './Community.module.css';
import axios from 'axios';
import { publishRefreshToken } from '../Utiles/axios';

const BASE_URL = 'http://localhost:8000/api/';

let ordered = 'time';

const Community = () => {
    const [idValue, setIdValue] = useState('');
    const [nickNameValue, setNickNameValue] = useState('');
    const [companyValue, setCompanyValue] = useState('');
    const [imgSrc, setImgSrc] = useState(null);
    const [postList, setPostList] = useState([]);
    const [curPage, setCurPage] = useState();
    const [pageCnt, setPageCnt] = useState();
    const [defaultPage, setDefaultPage] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [searchOption, setSearchOption] = useState('title');
    const [isSearch, setIsSearch] = useState();

    const nav = useNavigate();

    const params = useParams();
    const orderd = useLocation();

    const settingPage = () => {
        let newPage = [];

        if (pageCnt <= 10) {
            for (let i = 1; i < pageCnt + 1; i++) {
                newPage.push(i);
            }
            setDefaultPage(newPage);
        } else {
            const tmp = parseInt((curPage - 1) / 10);
            const div = parseInt((pageCnt - 1) / 10);
            const mod = 10 - parseInt(pageCnt % 10);
            if (div === tmp) {
                for (let i = tmp * 10 + 1; i < (tmp + 1) * 10 + 1 - mod; i++) {
                    newPage.push(i);
                }
            } else {
                for (let i = tmp * 10 + 1; i < (tmp + 1) * 10 + 1; i++) {
                    newPage.push(i);
                }
            }

            setDefaultPage(newPage);
        }
    };

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

    const getPostData = async (ordered) => {
        publishRefreshToken();
        if (ordered === 'like') {
            const data = await axios.get(BASE_URL + `post/postlist/?page=${params.page}?ordering=like`);
            setPostList(data.data.postList);
            setCurPage(data.data.curPage);
            setPageCnt(data.data.pageCnt);
            settingPage();
        } else if (ordered === 'view') {
            const data = await axios.get(BASE_URL + `post/postlist/?page=${params.page}?ordering=view_count`);
            setPostList(data.data.postList);
            setCurPage(data.data.curPage);
            setPageCnt(data.data.pageCnt);
            settingPage();
        } else {
            const data = await axios.get(BASE_URL + `post/postlist/?page=${params.page}`);
            setPostList(data.data.postList);
            setCurPage(data.data.curPage);
            setPageCnt(data.data.pageCnt);
            settingPage();
        }
    };

    const getSearchData = async () => {
        publishRefreshToken();
        if (searchOption == 'title') {
            const { data } = await axios.get(`http://localhost:8000/api/post/postlist/?title=${searchValue}`);
            console.log(data);
            setPostList(data.postList);
            setCurPage(data.curPage);
            setPageCnt(data.pageCnt);
            settingPage();
            console.log(searchOption);
        } else if (searchOption == 'content') {
            const { data } = await axios.get(`http://localhost:8000/api/post/postlist/?content=${searchValue}`);
            setPostList(data.postList);
            setCurPage(data.curPage);
            setPageCnt(data.pageCnt);
            settingPage();
            console.log(searchOption);
        } else {
            const { data } = await axios.get(`http://localhost:8000/api/post/postlist/?category=${searchValue}`);
            setPostList(data.postList);
            setCurPage(data.curPage);
            setPageCnt(data.pageCnt);
            settingPage();
            console.log(searchOption);
        }
        setIsSearch(false);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchValue(value);
    };

    const handleOnClick = (e) => {
        e.preventDefault();
        setIsSearch(true);
        getSearchData();
    };

    const handleLeftBtn = () => {
        if (defaultPage[0] != 1) {
            nav(`/community/${defaultPage[0] - 10}`);
            window.location.reload();
        }
    };

    const handleRightBtn = () => {
        if (defaultPage[defaultPage.length - 1] < pageCnt) {
            nav(`/community/${defaultPage[0] + 10}`);
            window.location.reload();
        }
    };

    const handleLogoutBtn = () => {
        localStorage.clear();
    };

    useEffect(() => {
        if (!isSearch) {
            getUserData();
            getPostData(orderd);
        }
    }, [pageCnt]);

    return (
        <div className={styles.container}>
            <div className={styles.topbar__container}>
                <div></div>
                <div>
                    <img src='../aivle5.png' className={styles.logo} />
                </div>
                <nav className={styles.navigator}>
                    <img className={styles.profile} src={imgSrc} />
                    <h5 id='id'>{nickNameValue}</h5>
                    <a href='http://localhost:3000/modify'>
                        <img src='http://bens1.img12.kr/2021_m_category_renewal/m_icon_mypage.png' />
                    </a>
                    <a href='' onClick={handleLogoutBtn}>
                        로그아웃
                    </a>
                </nav>
            </div>
            <nav className={styles.menu}>
                <div>
                    <a href=''>자유게시판</a>
                    <a href=''>다른게시판</a>
                    <a href='http://localhost:3000/aivle/main'>메인으로</a>
                </div>
                <div>
                    <input
                        type='radio'
                        name='search_option'
                        id='search_title'
                        onClick={() => {
                            setSearchOption('title');
                        }}
                        defaultChecked
                    />
                    <label htmlFor='search_title'>제목</label>
                    <input
                        type='radio'
                        name='search_option'
                        id='search_content'
                        onClick={() => {
                            setSearchOption('content');
                        }}
                    />
                    <label htmlFor='search_content'>내용</label>
                    <input
                        type='radio'
                        name='search_option'
                        id='search_category'
                        onClick={() => {
                            setSearchOption('category');
                        }}
                    />
                    <label htmlFor='search_category'>게시판</label>
                </div>
                <div className={styles.search}>
                    <input type='text' placeholder='검색' onChange={handleSearch} />
                    <button onClick={handleOnClick}>검색</button>
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
                        <button onClick={handleLeftBtn}>◀️</button>
                        {defaultPage.map((page) => {
                            return (
                                <div className={styles.pagination__container}>
                                    <a
                                        className={page == params.page ? styles.selected_page : styles.pagination}
                                        href=''
                                        onClick={() => {
                                            nav(`/community/${page}`, { state: ordered });
                                        }}>
                                        {page}
                                    </a>
                                </div>
                            );
                        })}
                        <button onClick={handleRightBtn}>▶️</button>
                    </div>
                </div>
                <div className={styles.sort__conatainer}>
                    <div className={styles.sort}>
                        <input
                            type='radio'
                            name='sort'
                            id='sort_date'
                            onClick={() => {
                                ordered = 'time';
                            }}
                            defaultChecked
                        />
                        <label htmlFor='sort_date'>최신순</label>
                        <input
                            type='radio'
                            name='sort'
                            id='sort_like'
                            onClick={() => {
                                ordered = 'like';
                            }}
                        />
                        <label htmlFor='sort_like'>좋아요순</label>
                        <input
                            type='radio'
                            name='sort'
                            id='sort_view'
                            onClick={() => {
                                orderd = 'view';
                            }}
                        />
                        <label htmlFor='sort_view'>조회순</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
