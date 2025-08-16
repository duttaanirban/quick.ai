import OpenAI from "openai";
import sql from "../config/db.js";

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
