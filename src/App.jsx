import { useEffect, useRef, useState } from "react";
import { Fireworks } from "fireworks-js";
import "./index.css";

function App() {
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const fireworksRef = useRef(null);
  const [displayedLyric, setDisplayedLyric] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  // 歌词时间轴 (时间以秒为单位)
  const lyrics = [
    { time: 0, text: "中秋佳节" },
    { time: 1, text: "愿花好月圆" },
    { time: 3, text: "心中梦圆" },
    { time: 4, text: "左右逢源" },
    { time: 5, text: "生活一年胜一年" },
    { time: 7, text: "希望你开心" },
    { time: 8, text: "无论跟谁" },
    { time: 9, text: "无论在哪" },
  ];

  const initFireworks = () => {
    if (containerRef.current && !fireworksRef.current) {
      // 初始化烟花效果
      fireworksRef.current = new Fireworks(containerRef.current, {
        hue: { min: 0, max: 345 },
        delay: { min: 30, max: 35 },
        rocketsPoint: { min: 50, max: 50 },
        opacity: 0.5,
        acceleration: 1.02,
        friction: 0.97,
        gravity: 1.5,
        particles: 60,
        trace: 3,
        explosion: 5,
        brightness: { min: 50, max: 80 },
        decay: { min: 0.015, max: 0.03 },
        flickering: 50,
        intensity: 30,
        traceLength: 3,
        traceSpeed: 10,
        lineWidth: {
          explosion: { min: 1, max: 4 },
          trace: { min: 0.1, max: 1 },
        },
        lineStyle: "round",
        boundaries: {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
      console.log("Fireworks initialized!"); // Debug log
    }
  };

  useEffect(() => {
    return () => {
      if (fireworksRef.current) {
        fireworksRef.current.stop();
        fireworksRef.current = null;
      }
    };
  }, []);

  const handleButtonClick = () => {
    if (!isPlaying) {
      // 开始播放音乐
      audioRef.current.play();
      setIsPlaying(true);

      // 初始化并开始烟花效果
      initFireworks();
      if (fireworksRef.current) {
        fireworksRef.current.start();
        console.log("Fireworks started!"); // Debug log
      }

      // 开始歌词显示
      startLyrics();
    } else {
      // 停止播放
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setDisplayedLyric("");

      // 停止烟花效果
      if (fireworksRef.current) {
        fireworksRef.current.stop();
      }
    }
  };

  const typewriterEffect = (text, callback) => {
    setDisplayedLyric("");
    let index = 0;
    const timer = setInterval(() => {
      setDisplayedLyric(text.slice(0, index + 1));
      index++;
      if (index >= text.length) {
        clearInterval(timer);
        if (callback) callback();
      }
    }, 150);
  };

  const startLyrics = () => {
    lyrics.forEach((lyric) => {
      setTimeout(() => {
        typewriterEffect(lyric.text);
      }, lyric.time * 1000);
    });

    // 在最后一句歌词后清空
    const lastLyric = lyrics[lyrics.length - 1];
    setTimeout(() => {
      setDisplayedLyric("");
    }, (lastLyric.time + 3) * 1000);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setDisplayedLyric("");
    if (fireworksRef.current) {
      fireworksRef.current.stop();
    }
  };

  return (
    <div className="app">
      <div ref={containerRef} className="fireworks-container">
        <canvas
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
      </div>

      <div className="content">
        {!isPlaying && (
          <button className="main-button" onClick={handleButtonClick}>
            中秋节快乐，丽丽！🎉
          </button>
        )}

        {displayedLyric && <span className="lyrics">{displayedLyric}</span>}
      </div>

      <audio ref={audioRef} src="/sound.mp3" onEnded={handleAudioEnd} />
    </div>
  );
}

export default App;
