import axios from "axios";
import {resolve} from "path";
import {createWriteStream, WriteStream} from "fs";

export default class Uploader {
    private destinationPath: string

    constructor(destinationPath: string) {
        this.destinationPath = destinationPath;
    }

    async upload(url: string, name: string, type: string) {
        try {
            const response = await axios({
                url,
                method: 'get',
                responseType: 'stream',
            });

            const path: string = resolve(this.destinationPath, `${name}.${type}`);

            return new Promise(resolve => {
                const stream: WriteStream = createWriteStream(path);
                response.data.pipe(stream);
                stream.on('finish', () => resolve(path));
            });
        } catch (err: any) {
            console.log('Error on uploading ogg file from telegram', err.message);
        }
    }
}