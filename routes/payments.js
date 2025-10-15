
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Create payment order (mock)
router.post('/create-order', auth, async (req, res) => {
  try {
    const { planType } = req.body;

    const plans = {
      'Bronze': { amount: 1000, duration: 30 },
      'Silver': { amount: 5000, duration: 30 },
      'Gold': { amount: 10000, duration: 30 }
    };

    if (!plans[planType]) {
      return res.status(400).json({ message: 'Invalid plan type' });
    }

    const order = {
      id: 'order_' + Date.now(),
      amount: plans[planType].amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID || 'demo_key'
    });

  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ message: 'Server error during payment order creation' });
  }
});

// Verify payment (mock)
router.post('/verify', auth, async (req, res) => {
  try {
    const { planType } = req.body;

    const user = await User.findById(req.user.userId);
    const planDurations = {
      'Bronze': 30,
      'Silver': 30,
      'Gold': 30
    };

    user.subscription = {
      type: planType,
      startDate: new Date(),
      endDate: new Date(Date.now() + planDurations[planType] * 24 * 60 * 60 * 1000),
      isActive: true
    };

    await user.save();

    res.json({
      message: 'Payment verified and subscription activated',
      subscription: user.subscription
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Server error during payment verification' });
  }
});

module.exports = router;
