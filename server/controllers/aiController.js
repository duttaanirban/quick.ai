import OpenAI from "openai";
import sql from "../config/db.js";
import {v2 as cloudinary} from 'cloudinary';


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
        res.status(500).json({ error: 'Failed to generate article' });
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
        res.status(500).json({ error: 'Failed to generate article' });
    }
};

export const generateImage = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {prompt, publish} = req.body;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.status(403).json({ success: false, message: 'This feature is only available for premium users' });
        }

        const formData = new FormData()
        formData.append('prompt', prompt)

        const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {'x-api-key': process.env.CLIPDROP_API_KEY },
            responseType: 'arraybuffer'
        })

        const base64Image = `data:image/png;base64,${buffer.from(data, 'binary').
            toString('base64')}`;

        const {secure_url} = await cloudinary.uploader.upload(base64Image);

        await sql`
            INSERT INTO creations (user_id, prompt, content, type, publish)
            VALUES (${userId}, ${prompt}, ${content}, 'image', ${publish})`;

            if (plan !== 'premium') {
                await clerkClient.users.updateUserMetadata(userId,{
                    privateMetadata: {
                        free_usage: freeUsage + 1
                    }
                });
            }

            res.status(200).json({ content });

    } catch (error) {
        res.status(500).json({ error: 'Failed to generate article' });
    }
};
