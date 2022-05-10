import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Speech from 'speak-tts';
import useSpeechToText from 'react-hook-speech-to-text';
import styles from './Speeching.module.css';
const { compare } = require('string-compare');

const Speeching = (props) => {
    const { interview, data } = props;
    const [isSpeech, setIsSpeech] = useState(null);
    const [question, setQusetion] = useState(interview);
    const [timer, setTimer] = useState(interview['timer']);
    const [loading, setLoading] = useState(true);
    const speech = new Speech();
    const h1 = useRef(null);

    const handleSpeech = () => {
        setIsSpeech(true);
        try {
            speech.speak({
                text: question,
            });
        } catch (e) {
            console.error('An error occurred :', e);
        } finally {
            setIsSpeech(false);
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
            if (results[0].transcript) {
                data((items) => {
                    return [...items, [percent * 100]];
                });
            } else {
                data([null]);
            }

            clearInterval(h1.current);
        }
    }, [timer]);

    useEffect(() => {
        if (!loading) {
            setTimeout(() => {
                handleSpeech();
            }, 3000);
        }
    }, [question, loading]);

    useEffect(() => {
        if (!isSpeech && !loading) {
            setTimeout(() => {
                startSpeechToText();
            }, 2000);
        }
    }, [isSpeech]);

    useEffect(() => {
        setQusetion(interview.question);
        setTimer(interview.timer);
    }, [interview]);

    useEffect(() => {
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
            .then((data) => {})
            .catch((e) => {
                console.error('An error occured while initializing : ', e);
            });
    }, []);

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
