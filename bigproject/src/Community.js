import axios from 'axios';
import { useState, useEffect } from 'react';
import styles from './Community.module.css';

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

let pagenum = page_num(34);

const Community = () => {
    const [postData, setPostData] = useState([]);
    const getPostData = async () => {
        const post = await axios.get('http://localhost:8000/api/post/postlist/');
        setPostData(post.data.postList);
    };

    const [data, setData] = useState([]);
    const [pagelist, setPagelist] = useState(pagenum);
    const [totpage, setTotpage] = useState(34);
    const [curpage, setCurpage] = useState(1);
    let p = [];

    const leftbtn_appear = () => {
        if (pagelist[0] != 1) {
            return <button onClick={left_btn}>◀</button>;
        }
    };

    const rightbtn_appear = () => {
        if (pagelist[pagelist.length - 1] < totpage) {
            return <button onClick={right_btn}>▶</button>;
        }
    };

    const right_btn = () => {
        let index_of_totpage = 10;
        for (let i = 0; i < 10; i++) {
            p[i] = pagelist[0] + 10 + i;
            if (p[i] == totpage) {
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
                    <img className={styles.profile} src='king.png' />
                    <h5 id='id'>{localStorage.getItem('user')}</h5>
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
                {postData.map((data) => {
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
                    <a href=''>
                        <button>글쓰기</button>
                    </a>
                </div>
                <div className={styles.page__conatainer}>
                    <div className={styles.page}>
                        {leftbtn_appear()}
                        {pagelist.map((num) => {
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
        </div>
    );
};

export default Community;
