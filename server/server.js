const express = require("express");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const fs = require("fs");
const tokenService = require('./service/token-service');
const https = require('https');
// Подключение к локальной базе данных SQLite
const db = new sqlite3.Database("myapp.db");

const app = express();

let cors = require ( 'cors' );
const { isContext } = require("vm");
let corsOptions = {
    methods: ['OPTIONS,GET,POST,PUT,DELETE'],
    credentials: true,
    origin: true,
    maxAge: 3600,
    allowedHeaders: ['Content-Type,Access-Control-Allow-Headers,Authorization,X-Requested-With'],
    optionsSuccessStatus: 200
}

app.use(express.json());
// app.use('/api', router)
app.use(cookieParser())
app.use(cors(corsOptions))
app.get('env')
dotenv.config();

const options = {
    key: fs.readFileSync('../../private.key'),
    cert: fs.readFileSync('../../certificate.crt')
};

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT,
    company TEXT,
    phone TEXT,
    email TEXT UNIQUE,
    password TEXT,
    isConfirmed INTEGER DEFAULT 0
  )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        inn TEXT,
        email TEXT,
        phone TEXT,
        main TEXT,
        address TEXT,
        site TEXT,
        ocved TEXT,
        region TEXT,
        direction TEXT,
        coordinates TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user INTEGER,
        refreshToken TEXT
    )`);
});

app.get('/api/ping', async(req,res) => {
    console.log('ping!')
})

app.get('/api/getuser', async (req, res) => {
    const token = req?.headers?.authorization.split(' ')[1]
    console.log(token)
    if (!token) {
        return res.status(403).json({ error: "Неверный токен." })
    }

    try {
        jwt.verify(token, process.env.JWT_REFRESH_TOKEN, (err, decoded) => {
            if (err) {console.error(err)}
            if (decoded) {
                res.json({ decoded });
            } else {
                res.sendStatus(401)
            }
        })
    } catch (e) {
        console.log(e)

    }
});

app.post("/api/register", async (req, res) => {
    const { fullName, company, phone, email, password } = req.body;
    try {
        // Проверка, что пользователь с такой почтой не существует
        db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
            if (row) {
                return res.status(400).json({ error: "Пользователь с такой почтой уже зарегистрирован" });
            }

            // Хеширование пароля
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error("Ошибка хеширования пароля", err);
                    return res.status(500).json({ error: "Ошибка регистрации" });
                }

                // Создание нового пользователя
                const stmt = db.prepare("INSERT INTO users (fullName, company, phone, email, password) VALUES (?, ?, ?, ?, ?)");
                stmt.run(fullName, company, phone, email, hashedPassword);
                stmt.finalize();


                db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
                    if (row){
                        let id = row.id;
                        let email = row.email;
                        let isConfirmed = row.isConfirmed;
                        const tokens = tokenService.generateTokens({id, email, isConfirmed});
                        await tokenService.saveToken(id, tokens.refreshToken);
                        res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
                        res.json({...tokens, user: {id, email, isConfirmed}})
                    }
                })
            });
        });
    } catch (error) {
        console.error("Ошибка регистрации", error);
        res.status(500).json({ error: "Ошибка регистрации" });
    }
});

app.get('/api/files', async (req, res) => {
    console.log('nice')
    const token = req?.headers?.authorization.split(' ')[1]
    if (!token) {
        return res.status(403).json({ error: "Неверный токен." })
    }
    try {
        jwt.verify(token, process.env.TOKEN_SECRET.toString(), (err, decoded) => {
            if (err) {console.error(err)}
                if (decoded?.isConfirmed) {
                    let fs = require('fs');
                    let fileContent = fs.readFileSync('./newData.json', 'utf8');
                    res.json({ fileContent });
                } else {
                    let fs = require('fs');
                    let fileContent = fs.readFileSync('./newData.json', 'utf8');
                    res.json({ fileContent });
                }
        })


    } catch (e) {
        console.log(e)
        return res.status(403).json({ error: "Неверный токен. Авторизуйтесь снова." }).sendStatus(403)
    }


})

app.post('/api/update', (req, res) => {
    const {username, organization, phone, email, newEmail, password, newPassword} = req.body
    const token = req?.headers?.authorization.split(' ')[1]
    if (!token) {
        return res.status(403).json({ error: "Неверный токен." })
    }
    jwt.verify(token, process.env.TOKEN_SECRET.toString(), (err, decoded) => {
        if (err) {console.error(err)}
        if (decoded) {
            db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
                if (!row) {
                    res.status(401).json({ error: "Неправильные почта или пароль" });
                }
                // Проверка пароля
                bcrypt.compare(password, row.password, (err, isPasswordValid) => {
                    if (!isPasswordValid) {
                        console.log('!isPasswordValid')
                        res.status(401).json({ error: "Неправильные почта или пароль" });
                    } else {
                        if (newPassword === '') {
                            db.run('UPDATE users SET fullName = ?, company = ?, phone = ?, email = ?  WHERE email = ?', [username, organization, phone, newEmail, email], (err) => {
                                if (err) {
                                    console.error(err);
                                    res.status(500).json({ message: 'Internal server error' });
                                }

                                db.get("SELECT * FROM users WHERE email = ?", [newEmail], (err, row) => {
                                        if(row.isConfirmed === 1) {
                                            const token = generateTokenConfirmed(row)
                                            res.status(200).json({ token });
                                        } else {
                                            const token = generateToken(row);
                                            res.status(200).json({ token });
                                        }
                                    });
                            });
                        } else {
                            db.run('UPDATE users SET fullName = ?, company = ?, phone = ?, email = ?, password = ?  WHERE email = ?', [username, organization, phone, newEmail, newPassword, email], (err) => {
                                if (err) {
                                    console.error(err);
                                    res.status(500).json({ message: 'Internal server error' });
                                }

                                res.json({ message: 'Record updated successfully' });
                            });
                        }
                    }
                });
            });
        } else {
            res.status(403).json({ error: "Неверный токен. Авторизуйтесь снова." }).sendStatus(403)
        }
    })
});

app.post('/api/addpoint', async (req, res) => {
    console.log(req)
    const { name, email, inn, phone, site, ocved, main, address, region, direction, coordinates } = req.body;
    console.log(req)
    db.run('INSERT INTO points (name, inn, email, phone, main, address, site, ocved, region, direction, coordinates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, inn, email, phone, main, address, site, ocved, region, direction, coordinates], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).send('Заявка успешно оформлена');
    });
});


app.post('/api/logout', async (req, res) => {
    const {refreshToken} = req.cookies;

    db.run('DELETE FROM tokens WHERE refreshToken = ?', [refreshToken], function (err, row) {
        
    } )

    res.clearCookie('refreshToken')
    res.status(200).send('Успех')
})

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        // Поиск пользователя по почте
        db.get("SELECT * FROM users WHERE email = ?", [username], (err, row) => {
            if (!row) {
                return res.status(401).json({ error: "Неправильные почта или пароль" });
            }
            // Проверка пароля
            bcrypt.compare(password, row.password, async (err, isPasswordValid) => {
                if (!isPasswordValid) {
                    console.log('!isPasswordValid')
                    return res.status(401).json({ error: "Неправильные почта или пароль" });
                }

                let id = row.id;
                let email = row.email;
                let isConfirmed = row.isConfirmed;
                let phone = row.phone;
                let fullName = row.fullName;
                let company = row.company;
                const tokens = tokenService.generateTokens({id, email, isConfirmed, phone, fullName, company});
                await tokenService.saveToken(id, tokens.refreshToken);
                res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
                res.json({...tokens, user: {id, email, isConfirmed, phone, fullName, company}})


            });
        });
    } catch (error) {
        console.error("Ошибка авторизации", error);
        res.status(500).json({ error: "Ошибка авторизации" });
    }
});


function generateToken(user) {
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '86400s' });
}

function generateTokenConfirmed(user) {
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '7200s' });
}


app.listen(8000, () => {
    console.log("Сервер запущен на порту 8000");
});
