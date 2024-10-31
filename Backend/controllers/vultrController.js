const axios = require('axios');

exports.getVultrChatResponse = async (req, res) => {
    const userInput = req.body.userInput;

    try {
        const response = await axios.post(
            'https://api.vultrinference.com/v1/chat/completions',
            {
                model: 'llama2-13b-chat-Q5_K_M',
                messages: [{ role: 'user', content: userInput }],
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
        res.json({ botMessage: botMessageContent });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching response from Vultr API.' });
    }
};