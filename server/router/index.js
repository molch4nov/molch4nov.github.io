const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const router = new Router();

router.post('/register', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/update', userController.update);
router.get('/getuser', userController.getUser);
router.get('/refresh', userController.refresh);

module.exports = router;