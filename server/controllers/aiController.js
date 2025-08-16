import OpenAI from "openai";
import sql from "../config/db.js";
import {v2 as cloudinary} from 'cloudinary';
import axios from "axios";
import FormData from "form-data"; // <-- Proper Node.js FormData

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {prompt, length} = req.body;
        const plan = req.plan;
        const freeUsage = req.free_usage;

        if (plan !== 'premium' && freeUsage >= 10) {
            return res.status(403).json({ error: 'Insufficient free usage' });
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: length,
        });

        const content = response.choices[0].message.content;

        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, ${prompt}, ${content}, 'article')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId,{
                privateMetadata: {
                    free_usage: freeUsage + 1
                }
            });
        }

        res.status(200).json({ content });

    } catch (error) {
        // Improved error handling
        let message = 'Failed to generate article';
        if (error.response) {
            try {
                const json = typeof error.response.data === 'string' ? JSON.parse(error.response.data) : error.response.data;
                if (json && json.error) message = `API error: ${json.error}`;
                else if (json && json.message) message = `API: ${json.message}`;
            } catch (e) {
                message = `API error: ${error.response.status} ${error.response.statusText}`;
            }
        } else if (error.request) {
            message = 'No response from API';
        } else if (error.message) {
            message = error.message;
        }
        res.status(500).json({ error: message });
    }
};

export const generateBlogTitle = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {prompt} = req.body;
        const plan = req.plan;
        const freeUsage = req.free_usage;

        if (plan !== 'premium' && freeUsage >= 10) {
            return res.status(403).json({ success: false, message: 'Insufficient free usage' });
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 100,
        });

        const content = response.choices[0].message.content;

        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId,{
                privateMetadata: {
                    free_usage: freeUsage + 1
                }
            });
        }

        res.status(200).json({ content });

    } catch (error) {
        // Improved error handling
        let message = 'Failed to generate blog title';
        if (error.response) {
            try {
                const json = typeof error.response.data === 'string' ? JSON.parse(error.response.data) : error.response.data;
                if (json && json.error) message = `API error: ${json.error}`;
                else if (json && json.message) message = `API: ${json.message}`;
            } catch (e) {
                message = `API error: ${error.response.status} ${error.response.statusText}`;
            }
        } else if (error.request) {
            message = 'No response from API';
        } else if (error.message) {
            message = error.message;
        }
        res.status(500).json({ error: message });
    }
};

export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.status(403).json({ success: false, message: 'This feature is only available for premium users' });
        }

        // Use form-data package for Node.js compatibility
        const formData = new FormData();
        formData.append('prompt', prompt);

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                ...formData.getHeaders(),
                'x-api-key': process.env.CLIPDROP_API_KEY
            },
            responseType: 'arraybuffer'
        });

        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

        const { secure_url } = await cloudinary.uploader.upload(base64Image);

        await sql`
            INSERT INTO creations (user_id, prompt, content, type, publish)
            VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

        res.status(200).json({ success: true, content: secure_url });
    } catch (error) {
        console.error('Image generation error:', error);
        // Try to extract a more helpful error message from Axios/ClipDrop
        let message = 'Failed to generate image';
        if (error.response) {
            // API responded with an error status
            try {
                // Try to parse JSON error message from response
                const json = JSON.parse(Buffer.from(error.response.data).toString('utf8'));
                if (json && json.error) message = `ClipDrop API error: ${json.error}`;
                else if (json && json.message) message = `ClipDrop API: ${json.message}`;
            } catch (e) {
                // Not JSON, fallback to status text
                message = `ClipDrop API error: ${error.response.status} ${error.response.statusText}`;
            }
        } else if (error.request) {
            message = 'No response from ClipDrop API';
        } else if (error.message) {
            message = error.message;
        }
        res.status(500).json({ error: message });
    }
};