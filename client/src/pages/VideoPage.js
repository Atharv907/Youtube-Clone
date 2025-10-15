
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoPlayer from '../components/Video/VideoPlayer';
import CommentSection from '../components/Comments/CommentSection';

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingLimit, setViewingLimit] = useState(null);

  const fetchVideo = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/videos/${id}`);
      setVideo(response.data.video);
      setViewingLimit(response.data.viewingLimit);
    } catch (error) {
      console.error('Video fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  if (loading) return <div className="loading">Loading video...</div>;
  if (!video) return <div className="error">Video not found</div>;

  return (
    <div className="video-page">
      <div className="video-player-container">
        <VideoPlayer video={video} viewingLimit={viewingLimit} />
        <div className="video-info">
          <h1>{video.title}</h1>
          <div className="video-meta">
            <span>{video.views} views</span>
            <div className="video-actions">
              <button className="like-btn">👍 {video.likes}</button>
              <button className="dislike-btn">👎 {video.dislikes}</button>
            </div>
          </div>
          <div className="video-description">
            <p>{video.description}</p>
          </div>
        </div>
      </div>

      <CommentSection videoId={video._id} />
    </div>
  );
};

export default VideoPage;
