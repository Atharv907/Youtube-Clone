
const getLocationFromIP = async (ip) => {
  try {
    if (ip === '127.0.0.1' || ip === '::1' || ip.includes('localhost') || !ip) {
      return {
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        coordinates: {
          lat: 12.9716,
          lng: 77.5946
        }
      };
    }

    return {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      coordinates: {
        lat: 19.0760,
        lng: 72.8777
      }
    };

  } catch (error) {
    console.error('Geolocation error:', error);
    return {
      city: 'Unknown',
      state: 'Unknown',
      country: 'Unknown',
      coordinates: {
        lat: 0,
        lng: 0
      }
    };
  }
};

module.exports = { getLocationFromIP };
