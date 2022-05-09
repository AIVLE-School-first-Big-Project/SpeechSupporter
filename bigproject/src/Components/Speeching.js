import { useState, useEffect, useMemo, useRef } from 'react';
import Speech from 'speak-tts';
import useSpeechToText from 'react-hook-speech-to-text';
import styles from './Speeching.module.css';
const { compare } = require('string-compare');

const Speeching = (props) => {
    const { interview, data } = props;
    const [isSpeech, setIsSpeech] = useState(true);
    const [question, setQusetion] = useState(interview);
    const [timer, setTimer] = useState(interview['timer']);
    const [loading, setLoading] = useState(true);
    const speech = new Speech();
    const h1 = useRef(null);

    speech
        .init({
            volume: 1,
            lang: 'ko-KR',
            rate: 0.3,
            pitch: 0.1,
            //voice: 'Google KR Korean Female',
            splitSentences: true,
            listeners: {
                onvoiceschanged: (voices) => {},
            },
        })
        .then((data) => {
            setTimeout(() => {
                setIsSpeech(false);
            }, 3000);
        })
        .catch((e) => {
            console.error('An error occured while initializing : ', e);
        });

    const handleSpeech = () => {
        setIsSpeech(true);
        try {
            speech.speak({
                text: question.question,
            });
        } catch (e) {
            console.error('An error occurred :', e);
        }
    };

    const { error, interimResult, isRecording, results, startSpeechToText, stopSpeechToText } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    useEffect(() => {
        if (!isSpeech && !loading) {
            setTimeout(() => {
                h1.current = setInterval(() => {
                    setTimer((prev) => {
                        return prev - 1;
                    });
                }, 1000);
            }, 2000);
        }
    }, [isSpeech]);

    useMemo(async () => {
        if (timer <= 0 && !loading) {
            stopSpeechToText();
            const percent = compare(interview.answer, results[0].transcript);
            data((items) => {
                return [...items, percent];
            });
            clearInterval(h1.current);
        }
    }, [timer]);

    useEffect(() => {
        setTimer(question.timer);
        if (!loading) {
            setTimeout(() => {
                handleSpeech();
            }, 3000);
        }
    }, [question]);

    useEffect(() => {
        if (!isSpeech && !loading) {
            setTimeout(() => {
                startSpeechToText();
            }, 2000);
        }
    }, [isSpeech]);

    useEffect(() => {
        setQusetion(interview);
    }, [interview]);

    const handleStartBtn = () => {
        setLoading(false);
    };

    return (
        <div>
            {loading ? (
                <button className={styles.button} onClick={handleStartBtn}>
                    시작하기
                </button>
            ) : (
                <span className={styles.timer}>{timer}</span>
            )}
        </div>
    );
};

export default Speeching;
