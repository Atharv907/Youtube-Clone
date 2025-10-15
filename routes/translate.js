
const express = require('express');
const router = express.Router();

const translateText = async (text, targetLanguage) => {
  const mockTranslations = {
    hi: 'यह एक नमूना अनुवाद है',
    ta: 'இது ஒரு மாதிரி மொழிபெயர்ப்பு',
    te: 'ఇది ఒక నమూనా అనువాదం',
    kn: 'ಇದು ಒಂದು ಮಾದರಿ ಅನುವಾದ',
    ml: 'ഇത് ഒരു സാമ്പിൾ വിവർത്തനമാണ്',
    en: text
  };

  return mockTranslations[targetLanguage] || `[${targetLanguage.toUpperCase()}] ${text}`;
};

// Translate text
router.post('/', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ 
        message: 'Text and target language are required' 
      });
    }

    const translatedText = await translateText(text, targetLanguage);

    res.json({
      originalText: text,
      translatedText,
      targetLanguage
    });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ message: 'Server error during translation' });
  }
});

module.exports = router;
