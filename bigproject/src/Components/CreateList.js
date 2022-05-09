import { useState } from 'react';
import Questions from '../Screens/Questions';

const CreateList = () => {
    const [countList, setCountList] = useState([0]);

    const onAddDetailDiv = () => {
        let countArr = [...countList];
        let counter = countArr.slice(-1)[0];
        counter += 1;
        countArr.push(counter); // index 사용 X
        // countArr[counter] = counter	// index 사용 시 윗줄 대신 사용
        setCountList(countArr);
    };

    return (
        <div>
            <Questions countList={countList} />
            <button onClick={onAddDetailDiv}>추가</button>
        </div>
    );
};

export default CreateList;
