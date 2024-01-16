const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("myapp.db");

class UserService {
    async registration(fullName, company, phone, email, password) {
        let tokens;
        let userDto;
        db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
            if (row) {
                return { name: 'Error', message: 'String you pass in the constructor' }
            }
            const hashPassword = await bcrypt.hash(password, 3)

            const stmt = db.prepare("INSERT INTO users (fullName, company, phone, email, password) VALUES (?, ?, ?, ?, ?)");
            stmt.run(fullName, company, phone, email, hashPassword);
            stmt.finalize();


            db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
                if (row){
                    let id = row.id;
                    let email = row.email;
                    let isConfirmed = row.isConfirmed;
                    userDto = new UserDto({id, email, isConfirmed})
                    tokens = tokenService.generateTokens({id, email, isConfirmed});
                    await tokenService.saveToken(id, tokens.refreshToken);

                }
            })


        });
        return {
            ...tokens,
            userDto
        }
    }

}

module.exports = new UserService();