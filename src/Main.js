import Config from "./Config.js";

console.log(Config.IPC_KEY);
console.log(Config.TEMP_FOLDER);

import express from "express";
import { exec } from "child_process";
import path from "path";
import {Database} from "./Modules/Database/Connection.js";

const app = express();
const PORT = 3000;

app.get("/process/:id", async (req, res) => {
    const { id } = req.params;
    const { key } = req.query;

    if (key !== Config.IPC_KEY) {
        return res.status(403).send("invalid key");
    }

    var [data, eh] = await Database.db.execute("SELECT * FROM ItemVideos WHERE ItemID = ?", [id]);
    var item = data[0];
    console.log(item)

    const inputPath = path.resolve(Config.TEMP_FOLDER + `video_uploads/${item.ItemID}.mp4`);
    const outputPath = path.resolve(Config.TEMP_FOLDER + `video_uploads/process_${item.ItemID}.mp4`);

    exec(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 ${inputPath}`, (err, stdout) => {
        if (err) return res.status(500).send("error reading video");

        const [width, height] = stdout.trim().split(",").map(Number);

        let scale;
        if (width > height) {
            // width is larger, scale width to 1280
            scale = `1280:-2`;
        } else {
            // height is larger or equal, scale height to 1280
            scale = `-2:1280`;
        }

        // ffmpeg command to resize & convert to webm
        const ffmpegCmd = `ffmpeg -i ${inputPath} -vf scale=${scale} -c:v libx264 -crf 28 -preset veryfast -c:a aac -b:a 96k ${outputPath} -y`;


        exec(ffmpegCmd, (err2) => {
            console.log("gaming")
            if (err2) return res.status(500).send("error processing video at " + inputPath + "\n" + err2);
            return res.status(200).send("done");
        });
    });
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
