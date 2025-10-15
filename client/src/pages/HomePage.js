
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import VideoGrid from '../components/Video/VideoGrid';

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await axios.get('/api/videos', { params });
      setVideos(response.data.videos || []);
    } catch (error) {
      console.error('Videos fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  if (loading) return <div className="loading">Loading videos...</div>;

  return (
    <div className="homepage">
      {searchQuery && (
        <div className="search-results-header">
          <h2>Search results for "{searchQuery}"</h2>
        </div>
      )}
      <VideoGrid videos={videos} />
    </div>
  );
};

export default HomePage;
