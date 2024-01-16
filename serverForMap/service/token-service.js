const jwt = require('jsonwebtoken');
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("myapp.db");

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        db.get("SELECT * FROM tokens WHERE user = ?", [userId], async (err, row) => {
            if (row) {
                row.refreshToken = refreshToken;
            }
            const token = db.prepare("INSERT INTO tokens (user, refreshToken) VALUES (?, ?)");
            token.run(userId, refreshToken);
            token.finalize();
            db.get("SELECT * FROM tokens WHERE user = ?", [userId], async (err, row) => {
                return row
            });
        });
    }
}

module.exports = new TokenService();