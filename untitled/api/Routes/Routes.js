const express = require('express')
const Controller = require('../Controllers/Controller')
const { signup, login, userVideos, downloadVideo, cancelTask,createTask,clearHistory } = Controller
const userAuth = require('../Middlewares/userAuth')
const upload = require('../config/multerConfig');
const router = express.Router()


router.post('/signup', userAuth.saveUser, signup)
router.post('/login', login )
router.get('/user-videos', userVideos);
router.get('/download_video', downloadVideo);
router.post('/cancel_task/:taskId', cancelTask);
router.post('/create-task',upload.single('video'), createTask);
router.post('/clear-history', clearHistory);

module.exports = router