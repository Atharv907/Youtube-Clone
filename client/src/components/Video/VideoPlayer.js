
import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';

const VideoPlayer = ({ video, viewingLimit }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [watchedTime, setWatchedTime] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  const updateViewingTime = useCallback(async (seconds) => {
    try {
      await axios.post('/api/subscription/update-viewing-time', { seconds });
    } catch (error) {
      console.error('Viewing time update error:', error);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateTime = () => setCurrentTime(video.currentTime);
      const updateDuration = () => setDuration(video.duration);

      video.addEventListener('timeupdate', updateTime);
      video.addEventListener('loadedmetadata', updateDuration);

      return () => {
        video.removeEventListener('timeupdate', updateTime);
        video.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, []);

  const pauseVideo = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && !limitReached) {
        setWatchedTime(prev => {
          const newTime = prev + 1;

          if (viewingLimit?.maxTime !== -1 && newTime >= viewingLimit.maxTime * 60) {
            setLimitReached(true);
            pauseVideo();
          }

          return newTime;
        });

        updateViewingTime(1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, limitReached, viewingLimit, updateViewingTime, pauseVideo]);

  const togglePlayPause = () => {
    if (limitReached) return;

    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const centerX = rect.width / 2;

    if (Math.abs(x - centerX) < 100) {
      togglePlayPause();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const watchedPercent = viewingLimit?.maxTime !== -1 ? (watchedTime / (viewingLimit.maxTime * 60)) * 100 : 0;

  return (
    <div className="video-player">
      <div className="video-container" onClick={handleVideoClick}>
        <video
          ref={videoRef}
          src={video.url}
          poster={video.thumbnail}
          className="video-element"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {limitReached && (
          <div className="limit-overlay">
            <h3>Viewing Time Limit Reached</h3>
            <p>Upgrade your subscription to continue watching</p>
          </div>
        )}

        <div className="video-controls visible">
          <div className="progress-bar">
            <div className="progress-background">
              <div 
                className="progress-filled" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="control-buttons">
            <button onClick={togglePlayPause} className="play-btn">
              {isPlaying ? '⏸️' : '▶️'}
            </button>

            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <div className="spacer" />

            <button className="download-btn">📥</button>
            <button className="volume-btn">🔊</button>
            <button className="fullscreen-btn">⛶</button>
          </div>
        </div>

        {viewingLimit?.maxTime !== -1 && (
          <div className="viewing-limit-indicator">
            <div className="limit-bar">
              <div 
                className="limit-progress" 
                style={{ width: `${watchedPercent}%` }}
              />
            </div>
            <span className="limit-text">
              {Math.floor(watchedTime / 60)}m / {viewingLimit.maxTime}m 
              ({viewingLimit.subscription})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
