const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const { Op } = require("sequelize");



const User = db.users;
const Task = db.tasks;

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const data = {
            username,
            email,
            password: await bcrypt.hash(password, 10),
        };
        const user = await User.create(data);
        if (user) {
            let token = jwt.sign({ id: user.id }, process.env.secretKey, {
                expiresIn: 1 * 24 * 60 * 60 * 1000,
            });

            res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });

            return res.status(201).send(token);
        } else {
            return res.status(409).send("Details are not correct");
        }
    } catch (error) {
        console.log(error);
    }
};




const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            where: {
                username: username
            }
        });

        if (user) {
            const isSame = await bcrypt.compare(password, user.password);
            if (isSame) {
                let token = jwt.sign({ id: user.id }, process.env.secretKey, {
                    expiresIn: 1 * 24 * 60 * 60 * 1000,
                });

                res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });

                return res.status(201).send(token);
            } else {
                return res.status(401).send("Authentication failed");
            }
        } else {
            return res.status(401).send("Authentication failed");
        }
    } catch (error) {
        console.log(error);
    }
};

const userVideos = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.secretKey);

        const userId = decoded.id;
        const userTasks = await Task.findAll({where: {userId}});

        res.json(userTasks);
    } catch (error) {
        console.error("Помилка під час отримання списку відео користувача: ", error);
        res.status(500).json({error: 'Помилка на сервері'});
    }
};

const downloadVideo = async (req, res) => {
    const videoInfo = await Task.findOne({ where: { id: req.query.id } });

    if (videoInfo) {
        const videoPath = videoInfo.result;

        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="${videoInfo.title}"`);

        const fileStream = fs.createReadStream(videoPath);
        fileStream.pipe(res);
    } else {
        res.status(404).send('Відео не знайдено');
    }
};

const cancelTask = async (req, res) => {
    const taskId = req.params.taskId;

    try {
        const task = await Task.findByPk(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Завдання не знайдено.' });
        }
        task.status = 'Stop';
        await task.save();

        res.status(200).json({ message: 'Завдання відмінено успішно.' });
    } catch (error) {
        console.error("Помилка при відміні завдання:", error);
        res.status(500).json({ error: 'Помилка на сервері' });
    }
};

const createTask = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Відео не було завантажено.' });
        }

        const token = req.body.jwt;
        const decoded = jwt.verify(token, process.env.secretKey);

        const userId = decoded.id;
        const user = await User.findByPk(userId);
        const notStartedTasksCount = await Task.count({
            where: {
                userId: userId,
                status: {
                    [Op.in]: ['Not Started', 'In Progress'],
                },
            },
        });

        if (notStartedTasksCount >= user.limit) {
            return res.status(226).json({ message: 'Забагато запитів, почекайте трохи' });
        }

        const originalFileName = req.file.originalname;
        const uploadDirectory = path.join(__dirname, "../uploads");

        const uploadedFilePath = path.join(uploadDirectory, originalFileName);
        console.log(uploadedFilePath);
        let task = await Task.create({
            title: originalFileName,
            filePath: uploadedFilePath,
            resolution: req.body.resolution,
            userId: userId,
        });

        res.status(200).json({ message: 'Таска додана успішно' });
    } catch (error) {
        return res.status(401).json({ error: 'Недійсний JWT або помилка автентифікації.' + error });
    }
};


const clearHistory = async (req, res) => {
    try {
        const token = req.body.jwt;
        const decoded = jwt.verify(token, process.env.secretKey);
        const userId = decoded.id;

        await Task.destroy({ where: { userId } });

        res.status(200).json({ message: 'Історія успішно очищена' });
    } catch (error) {
        console.error('Помилка під час очищення історії: ', error);
        res.status(500).json({ error: 'Помилка на сервері' });
    }
};
module.exports = {
    signup,
    login,
    createTask,
    clearHistory,
    cancelTask,
    downloadVideo,
    userVideos
};