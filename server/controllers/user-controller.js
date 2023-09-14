const userService = require("../service/user-service");

class UserController {
    async registration(req, res, next) {
        try {
            const {fullName, company, phone, email, password} = req.body;
            const userData = await userService.registration(fullName, company, phone, email, password);
            console.log(userData)
            // res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60* 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            return res.json(e)
        }
    }

    async login(req, res, next) {
        try {

        } catch (e) {
            
        }
    }

    async logout(req, res, next) {
        try {

        } catch (e) {
            
        }
    }

    async update(req, res, next) {
        try {

        } catch (e) {
            
        }
    }

    async refresh(req, res, next) {
        try {

        } catch (e) {
            
        }
    }

    async getUser(req, res, next) {
        try {
            
        } catch (e) {
            
        }
    }
}


module.exports = new UserController();