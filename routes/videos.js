
const express = require('express');
const Video = require('../models/Video');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Sample videos for development
const sampleVideos = [
  {
    _id: '507f1f77bcf86cd799439011',
    title: 'Sample Tech Tutorial',
    description: 'Learn the latest in technology',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://via.placeholder.com/320x180/ff6b6b/white?text=Tech+Tutorial',
    duration: '8:30',
    uploader: { username: 'TechGuru', avatar: 'https://via.placeholder.com/32' },
    views: 1200,
    likes: 45,
    dislikes: 2,
    createdAt: new Date(),
    category: 'Technology'
  },
  {
    _id: '507f1f77bcf86cd799439012',
    title: 'Cooking Masterclass',
    description: 'Master the art of cooking',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://via.placeholder.com/320x180/4ecdc4/white?text=Cooking+Class',
    duration: '12:15',
    uploader: { username: 'ChefMaster', avatar: 'https://via.placeholder.com/32' },
    views: 856,
    likes: 67,
    dislikes: 1,
    createdAt: new Date(),
    category: 'Education'
  }
];

// Get all videos with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search;

    let videos = sampleVideos;

    if (search) {
      videos = videos.filter(video => 
        video.title.toLowerCase().includes(search.toLowerCase()) ||
        video.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({
      videos,
      pagination: {
        current: page,
        pages: 1,
        total: videos.length
      }
    });

  } catch (error) {
    console.error('Videos fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching videos' });
  }
});

// Get single video
router.get('/:id', auth, async (req, res) => {
  try {
    const video = sampleVideos.find(v => v._id === req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const user = await User.findById(req.user.userId);
    const subscription = user.subscription.type;

    let maxViewingTime;
    switch (subscription) {
      case 'Free': maxViewingTime = 5; break;
      case 'Bronze': maxViewingTime = 7; break;
      case 'Silver': maxViewingTime = 10; break;
      case 'Gold': maxViewingTime = -1; break;
      default: maxViewingTime = 5;
    }

    res.json({
      video,
      viewingLimit: {
        maxTime: maxViewingTime,
        subscription: subscription
      }
    });

  } catch (error) {
    console.error('Single video fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching video' });
  }
});

module.exports = router;
