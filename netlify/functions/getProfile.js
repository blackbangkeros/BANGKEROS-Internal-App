// netlify/functions/getProfile.js
const { Pool } = require('pg');

exports.handler = async function(event, context) {
    // Get the user's email from the request
    const { email } = JSON.parse(event.body);

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "User not found" }),
            };
        }

        // In a real app, you would also fetch assets, queue position, etc.
        const userProfile = rows[0];

        return {
            statusCode: 200,
            body: JSON.stringify(userProfile),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch profile" }),
        };
    } finally {
        await pool.end();
    }
};
