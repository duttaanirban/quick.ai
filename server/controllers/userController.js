import sql from "../config/db.js";

export const getUserCreations = async (req, res) => {
    try {
        const { userId } = req.auth();

        const creations = await sql`
            SELECT * FROM creations WHERE user_id = ${userId}
        ORDER BY created_at DESC`;

        res.status(200).json({ creations });
    } catch (error) {
        console.error('Error fetching user creations:', error);
        res.status(500).json({ error: 'Failed to fetch user creations' });
    }
};

export const getPublishedCreations = async (req, res) => {
    try {
        const creations = await sql`
            SELECT * FROM creations WHERE publish = true
        ORDER BY created_at DESC`;

        res.status(200).json({ success: true, creations });
    } catch (error) {
        console.error('Error fetching user creations:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch user creations' });
    }
};

export const toggleLikeCreation = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body;

        const [creation] = await sql`
            SELECT * FROM creations WHERE id = ${id} AND user_id = ${userId}
        `;

        if (!creation) {
            return res.status(404).json({ error: 'Creation not found' });
        }

        const currentLikes = creation.likes;
        const userIdStr = userId.toString();
        let updatedLikes;
        let message;

        if (currentLikes && currentLikes.includes(userIdStr)) {
            updatedLikes = currentLikes.filter((user)=>user !== userIdStr);
            message = 'Creation unliked successfully';
        } else {
            updatedLikes = [...currentLikes, userIdStr];
            message = 'Creation liked successfully';
        }

        const formattedArray = `{${updatedLikes.join(',')}}`;

        await sql`
            UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;

        res.status(200).json({ message: 'Like toggled successfully' });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
};
