
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get subscription plans
router.get('/plans', (req, res) => {
  const plans = [
    {
      name: 'Free',
      price: 0,
      features: ['5 minutes video viewing', '1 download per day', 'Ads included'],
      viewingLimit: 5,
      downloadLimit: 1
    },
    {
      name: 'Bronze',
      price: 10,
      features: ['7 minutes video viewing', '5 downloads per day', 'Fewer ads'],
      viewingLimit: 7,
      downloadLimit: 5
    },
    {
      name: 'Silver',
      price: 50,
      features: ['10 minutes video viewing', '20 downloads per day', 'No ads'],
      viewingLimit: 10,
      downloadLimit: 20
    },
    {
      name: 'Gold',
      price: 100,
      features: ['Unlimited video viewing', 'Unlimited downloads', 'Premium features'],
      viewingLimit: -1,
      downloadLimit: -1
    }
  ];

  res.json(plans);
});

// Update viewing time
router.post('/update-viewing-time', auth, async (req, res) => {
  try {
    const { seconds } = req.body;
    const user = await User.findById(req.user.userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.viewingTime.lastReset < today) {
      user.viewingTime.daily = 0;
      user.viewingTime.lastReset = today;
    }

    user.viewingTime.daily += seconds;
    await user.save();

    const limits = {
      'Free': 300,
      'Bronze': 420,
      'Silver': 600,
      'Gold': -1
    };

    const userLimit = limits[user.subscription.type];
    const remaining = userLimit === -1 ? -1 : Math.max(0, userLimit - user.viewingTime.daily);

    res.json({
      dailyViewingTime: user.viewingTime.daily,
      remainingTime: remaining,
      limitReached: userLimit !== -1 && user.viewingTime.daily >= userLimit
    });

  } catch (error) {
    console.error('Viewing time update error:', error);
    res.status(500).json({ message: 'Server error while updating viewing time' });
  }
});

module.exports = router;
