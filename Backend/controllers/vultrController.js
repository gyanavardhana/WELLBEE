const axios = require('axios');
const logger = require('../logger/logger');
const wellbeeContext = `
# Wellbee: Health & Wellness Platform

## Overview
Wellbee is a comprehensive health and wellness platform that supports both physical and mental well - being through personalized features and professional support.

## Main Features

### 1. Personal Coaching
    - Input height and weight
        - Receive customized exercise recommendations
            - Get personalized diet tips
                - Track progress over time

### 2. Anonymous Group Chat
    - Join mental health discussions anonymously
        - Real - time sentiment analysis of conversations
            - View emotional tone scores
                - Connect with others facing similar challenges

### 3. Mood Meter
    - Automated mood detection
        - Personalized music recommendations
            - Curated playlists based on emotional state
                - Save favorite songs for quick access

### 4. Professional Therapy
    - Schedule consultation sessions
        - Connect with licensed therapists
            - Access professional mental health support
                - Manage appointments

## Website Navigation

### Home Page
    - Platform overview
        - Login / Register options
            - Featured wellness tips
                - Quick access to all main features

### Coaching Dashboard
    - Personal metrics input
        - Exercise recommendations
            - Diet planning
                - Progress tracking

### Group Chat
    - Anonymous chat interface
        - Sentiment analysis display
            - Community guidelines
                - Topic - based chat rooms

### Mood Meter
    - Current mood display
        - Music player
            - Playlist management
                - Mood history tracking

### Therapy Portal
    - Therapist profiles
        - Appointment scheduling
            - Session history
                - Resource library

### User Profile
    - Personal information
        - Preferences settings
            - Progress analytics
                - Account management

## Key User Flows

1. Physical Wellness
    - Home → Coaching Dashboard → Input Metrics → View Recommendations

2. Mental Health Support
    - Home → Group Chat → Join Discussion → View Sentiment Analysis

3. Mood Management
    - Home → Mood Meter → Select Mood → Play Music

4. Professional Help
    - Home → Therapy Portal → Browse Therapists → Schedule Session
`;


exports.getVultrChatResponse = async (req, res) => {
    const userInput = req.body.userInput;

    try {
        const enhancedPrompt = `
            You are a helpful assistant for the Wellbee health and wellness platform. 
            Use this context to inform your responses: ${wellbeeContext}
            
            User question: ${userInput}
            
            Please provide a helpful, relevant response based on Wellbee's features and capabilities.
            If the question is not related to Wellbee or health/wellness, politely redirect the conversation 
            to Wellbee's services.
        `;
        const response = await axios.post(
            'https://api.vultrinference.com/v1/chat/completions',
            {
                model: 'llama2-13b-chat-Q5_K_M',
                messages: [{ role: 'user', content: enhancedPrompt }],
                max_tokens: 512,
                seed: -1,
                temperature: 0.8,
                top_k: 40,
                top_p: 0.9,
                stream: false,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.VULTR_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const botMessageContent = response.data.choices[0].message.content;
        logger.info(`Vultr API response generated`);
        res.json({ botMessage: botMessageContent });
    } catch (error) {
        logger.error(`An error occurred while fetching response from Vultr API: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching response from Vultr API.' });
    }
}