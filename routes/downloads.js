
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Request video download
router.post('/request/:videoId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.downloads.lastReset < today) {
      user.downloads.today = 0;
      user.downloads.lastReset = today;
    }

    const limits = {
      'Free': 1,
      'Bronze': 5,
      'Silver': 20,
      'Gold': -1
    };

    const userLimit = limits[user.subscription.type];

    if (userLimit !== -1 && user.downloads.today >= userLimit) {
      return res.status(403).json({ 
        message: 'Daily download limit reached. Upgrade your plan for more downloads.',
        currentLimit: userLimit,
        used: user.downloads.today
      });
    }

    user.downloads.today += 1;
    await user.save();

    res.json({
      message: 'Download authorized',
      downloadUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      remainingDownloads: userLimit === -1 ? 'Unlimited' : userLimit - user.downloads.today
    });

  } catch (error) {
    console.error('Download request error:', error);
    res.status(500).json({ message: 'Server error during download request' });
  }
});

module.exports = router;
