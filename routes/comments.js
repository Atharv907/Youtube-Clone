
const express = require('express');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');
const { getLocationFromIP } = require('../utils/locationService');
const router = express.Router();

// Sample comments for development
const sampleComments = [
  {
    _id: '507f1f77bcf86cd799439021',
    videoId: '507f1f77bcf86cd799439011',
    userId: { username: 'TechEnthusiast', avatar: 'https://via.placeholder.com/32' },
    content: { original: 'Great tutorial! Very helpful.' },
    city: 'Bangalore',
    likes: 15,
    dislikes: 1,
    likedBy: [],
    dislikedBy: [],
    createdAt: new Date(),
    isBlocked: false
  }
];

// Get comments for a video
router.get('/:videoId', async (req, res) => {
  try {
    const comments = sampleComments.filter(c => c.videoId === req.params.videoId && !c.isBlocked);
    res.json(comments);
  } catch (error) {
    console.error('Comments fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching comments' });
  }
});

// Add comment
router.post('/:videoId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;

    if (/[!@#$%^&*()+={}\[\]|:";'<>?,.]/.test(content)) {
      return res.status(400).json({ 
        message: 'Comments with special characters are not allowed' 
      });
    }

    const location = await getLocationFromIP(clientIP);

    const newComment = {
      _id: new Date().getTime().toString(),
      videoId: req.params.videoId,
      userId: { username: req.user.user.username, avatar: req.user.user.avatar },
      content: { original: content },
      city: location.city || 'Unknown',
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
      createdAt: new Date(),
      isBlocked: false
    };

    sampleComments.push(newComment);
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Comment creation error:', error);
    res.status(500).json({ message: 'Server error while creating comment' });
  }
});

// Vote on comment
router.post('/vote/:commentId', auth, async (req, res) => {
  try {
    const { voteType } = req.body;
    const comment = sampleComments.find(c => c._id === req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (voteType === 'like') {
      comment.likes += 1;
    } else if (voteType === 'dislike') {
      comment.dislikes += 1;
      if (comment.dislikes >= 2) {
        comment.isBlocked = true;
      }
    }

    res.json({
      likes: comment.likes,
      dislikes: comment.dislikes,
      userVote: voteType
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: 'Server error while voting' });
  }
});

module.exports = router;
