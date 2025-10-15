
import React from 'react';
import { useNavigate } from 'react-router-dom';

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  return (
    <div className="video-card" onClick={() => navigate(`/video/${video._id}`)}>
      <div className="video-thumbnail">
        <img src={video.thumbnail} alt={video.title} />
        <span className="video-duration">{video.duration}</span>
      </div>
      <div className="video-info">
        <div className="video-title">{video.title}</div>
        <div className="video-channel">{video.uploader?.username}</div>
        <div className="video-meta">
          <span>{video.views} views</span>
          <span> • </span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

const VideoGrid = ({ videos }) => {
  if (!videos || videos.length === 0) {
    return <div className="no-videos">No videos found</div>;
  }

  return (
    <div className="video-grid">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;
