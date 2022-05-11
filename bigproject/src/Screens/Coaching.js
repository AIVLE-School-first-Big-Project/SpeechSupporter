import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Pose } from "@mediapipe/pose";
import styles from "./Coaching.module.css";
import Speeching from "../Components/Speeching";

const WS_URL = `ws://localhost:8000/ws/cam/`;

const Coaching = () => {
  const { state } = useLocation();
  const length = state.data.data.length;
  const videoElement = useRef(null);
  const [result, setResult] = useState([]);
  const [numOfQuestions, setNumOfQuestions] = useState(
    state.data.data.length - length
  );
  const [data, setData] = useState(state.data.data[numOfQuestions]);
  const [items, setItems] = useState([]);

  let keypoints = {};

  // const faceMesh = new FaceMesh({
  //     locateFile: (file) => {
  //         return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
  //     },
  // });

  const pose = new Pose({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    },
  });

  // faceMesh.setOptions({
  //     maxNumFaces: 1,
  //     refineLandmarks: true,
  //     minDetectionConfidence: 0.5,
  //     minTrackingConfidence: 0.5,
  // });

  pose.setOptions({
    modelComplexity: 0,
    minDetectionConfidence: 0.3,
    minTrackingConfidence: 0.3,
  });

  function onResults(results) {
    if (!results.poseLandmarks) {
      return;
    }
    keypoints = { keypoints: results.poseLandmarks };
  }

  useEffect(() => {
    setInterval(async () => {
      await pose.onResults(onResults);
      // await faceMesh.onResults(onResults);
    }, 100);
    const ws = new WebSocket(WS_URL);
    ws.onopen = async () => {
      setInterval(async () => {
        await ws.send(
          JSON.stringify({
            type: "video_message",
            pose_message: keypoints,
          })
        );
      }, 1000);
      ws.onmessage = async (evt) => {
        {
          const data = JSON.parse(evt.data);
          setItems((prevItems) => [...prevItems, data]);
        }
      };
    };
  }, []);

  useEffect(() => {
    if (videoElement.current) {
      const camera = new Camera(videoElement.current, {
        onFrame: async () => {
          await pose.send({ image: videoElement.current });
          // await faceMesh.send({ image: videoElement.current });
        },
        width: 1000,
        height: 600,
      });

      camera.start();
    }
  }, [videoElement]);

  useEffect(() => {
    if (result.length !== 0 && numOfQuestions !== length - 1) {
      setNumOfQuestions((prev) => {
        return prev + 1;
      });
    }
    console.log(result);
  }, [result]);

  useEffect(() => {
    console.log(numOfQuestions);
    setData(state.data.data[numOfQuestions]);
  }, [numOfQuestions]);

  return (
    <>
      <div className={styles.container}>
        <img src="/logo.png" />
        <div className={styles.video__container}>
          <div className={styles.hole}></div>
          <video
            class="input_video"
            ref={videoElement}
            style={{
              objectFit: "cover",
              width: "1000px",
              height: "550px",
              borderRadius: "30px",
              borderTopLeftRadius: "0px",
              borderTopRightRadius: "0px",
            }}
          ></video>
        </div>
        <Speeching interview={data} data={setResult} />
        <div className={styles.chat}>
          {items.map((item) => {
            return (
              <div className={styles.bubble}>
                <p>{item.pose_message}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Coaching;
