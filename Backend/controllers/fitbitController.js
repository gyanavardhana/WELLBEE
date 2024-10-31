// controllers/fitbitController.js
const axios = require('axios');

const CLIENT_ID = process.env.FITBIT_CLIENT_ID;
const CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET;
const REDIRECT_URI = process.env.FITBIT_REDIRECT_URI;

// Redirect user to Fitbit authorization URL
exports.getAuthUrl = (req, res) => {
  const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=activity%20heartrate%20profile`;
  res.redirect(authUrl);
};

// Handle the callback from Fitbit and get the access token
exports.getAccessToken = async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post('https://api.fitbit.com/oauth2/token', null, {
      params: {
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code: code,
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    req.session.accessToken = response.data.access_token;
    res.redirect('/fitbit/profile');
  } catch (error) {
    console.error('Error getting access token:', error);
    res.status(500).send('Authorization failed.');
  }
};

// Fetch user profile
exports.getProfile = async (req, res) => {
  try {
    const response = await axios.get('https://api.fitbit.com/1/user/-/profile.json', {
      headers: { Authorization: `Bearer ${req.session.accessToken}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('Failed to fetch profile.');
  }
};

// Fetch activity data
exports.getActivityData = async (req, res) => {
  try {
    const response = await axios.get('https://api.fitbit.com/1/user/-/activities.json', {
      headers: { Authorization: `Bearer ${req.session.accessToken}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).send('Failed to fetch activities.');
  }
};

// Fetch heart rate data
exports.getHeartRateData = async (req, res) => {
  try {
    const response = await axios.get('https://api.fitbit.com/1/user/-/activities/heart.json', {
      headers: { Authorization: `Bearer ${req.session.accessToken}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching heart rate:', error);
    res.status(500).send('Failed to fetch heart rate data.');
  }
};