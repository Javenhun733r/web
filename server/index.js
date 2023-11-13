const express = require('express');
const app1 = express();
const ffmpeg = require('fluent-ffmpeg');
const path = require("path");
const db = require("./Models");
const Task = db.tasks;
app1.use(express.json());

let timerInterval = 10000;
let isTaskProcessing1 = false;
let shouldStopProcessing1 = false;
app1.get('/', (req, res) => {
    res.send("Hello world");
});
const outputDirectory = "./uploads";
async function checkStatus(task) {
    try {

        const updatedTask = await Task.findByPk(task.id);


        if (updatedTask.status === 'Stop') {
            shouldStopProcessing1 = true;
            console.log('Processing stopped by user.');
        }
    } catch (err) {
        console.error(err);
    }
}

async function processTask(task) {
    try {
        task.status = 'In Progress';
        await task.save();

        const videoPath = task.filePath;
        const resolution = task.resolution;
        const outputPath = path.join(outputDirectory, resolution + Math.floor(Math.random() * 1000) + ".mp4");

        const ffmpegCommand = ffmpeg(videoPath)
            .output(outputPath)
            .videoCodec('libx264')
            .size(`${resolution}`);

        ffmpegCommand.on('error', (err) => {
            console.log(err);
            task.status = 'Error';
            task.save();
        });

        ffmpegCommand.on('progress', async (progress) => {
            console.log('conversionProgress', progress.percent);
            if (progress.percent>0) {
                task.progress = Math.floor(progress.percent);
            }
            await checkStatus(task);
            if (shouldStopProcessing1) {
                shouldStopProcessing1 = false;
                isTaskProcessing1 = false;
                ffmpegCommand.kill();
            }
            task.save();
        });

        ffmpegCommand.on('end', () => {
            console.log('Finished processing');
            task.progress = 100;
            task.status = 'Done';
            task.result = path.join(__dirname, outputPath);
            task.save();
            isTaskProcessing1 = false;
        });

        ffmpegCommand.run();
    } catch (err) {
        console.error(err);
    }
}


function executeTasks() {

    return Task.findOne({where: {status: 'Not Started'}}).then((task) => {
        if (task !== null ) {
            isTaskProcessing1 = true;
            processTask(task)
        }
        else
          isTaskProcessing1 = false;
    });
}
const cb = () => {
    if (!isTaskProcessing1) {
        isTaskProcessing1 = true;
        executeTasks().then(() => {
        }).catch((err) => {
            console.log(err)
        });
    }
}
setInterval(cb, timerInterval);


app1.listen(4000, () => {
    console.log("App is listening on Port", 4000);
});
