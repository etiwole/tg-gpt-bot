import {dirname, resolve} from "path";
import ffmpeg from "fluent-ffmpeg";
import installer from "@ffmpeg-installer/ffmpeg";

export default class Converter {
    constructor() {
        ffmpeg.setFfmpegPath(installer.path);
    }

    convert(input: string, output: string) {
        try {
            const outputPath = resolve(dirname(input), `${output}.mp3`);
            return new Promise((resolve, reject) => {
                ffmpeg(input)
                    .inputOption('-t 30')
                    .output(outputPath)
                    .on('end', () => resolve(outputPath))
                    .on('error', (err) => reject(err.message))
                    .run()
            })
        } catch (err) {
            console.log('Error on creating mp3 file');
        }
    }
}