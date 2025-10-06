import { useEffect, useRef, useState } from "react";
import { Fireworks } from "fireworks-js";
import "./index.css";

function App() {
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const fireworksRef = useRef(null);
  const [currentLyric, setCurrentLyric] = useState("");
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

  useEffect(() => {
    if (containerRef.current) {
      // 初始化烟花效果
      fireworksRef.current = new Fireworks(containerRef.current, {
        hue: { min: 0, max: 360 },
        delay: { min: 30, max: 60 },
        rocketsPoint: { min: 50, max: 50 },
        opacity: 0.5,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 90,
        trace: 3,
        explosion: 6,
        boundaries: {
          x: 50,
          y: 50,
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        },
      });
    }

    return () => {
      if (fireworksRef.current) {
        fireworksRef.current.stop();
      }
    };
  }, []);

  const handleButtonClick = () => {
    if (!isPlaying) {
      // 开始播放音乐
      audioRef.current.play();
      setIsPlaying(true);

      // 开始烟花效果
      if (fireworksRef.current) {
        fireworksRef.current.start();
      }

      // 开始歌词显示
      startLyrics();
    } else {
      // 停止播放
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentLyric("");

      // 停止烟花效果
      if (fireworksRef.current) {
        fireworksRef.current.stop();
      }
    }
  };

  const startLyrics = () => {
    lyrics.forEach((lyric) => {
      setTimeout(() => {
        setCurrentLyric(lyric.text);
      }, lyric.time * 1000);
    });

    // 在最后一句歌词后清空
    const lastLyric = lyrics[lyrics.length - 1];
    setTimeout(() => {
      setCurrentLyric("");
    }, (lastLyric.time + 3) * 1000);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentLyric("");
    if (fireworksRef.current) {
      fireworksRef.current.stop();
    }
  };

  return (
    <div className="app">
      <div ref={containerRef} className="fireworks-container" />

      <div className="content">
        <button className="main-button" onClick={handleButtonClick}>
          {isPlaying ? "停止" : "点这里吧，宝宝"}
        </button>

        {currentLyric && <div className="lyrics">{currentLyric}</div>}
      </div>

      <audio ref={audioRef} src="/sound.mp3" onEnded={handleAudioEnd} />
    </div>
  );
}

export default App;
