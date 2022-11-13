import stream from "stream";
import { format } from "util";
import config from "../config";
import dataUrlToFile from "../helper/dataUrlToFile";
import { bucket } from "../helper/gcloud";

const createFileStream = (file: any) =>
  new Promise(async (resolve, reject) => {
    const blob = bucket.file(file.fileName);
    let buffer = await dataUrlToFile(file);

    var bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);
    bufferStream
      .pipe(
        bucket.file(file.fileName).createWriteStream({
          resumable: false,
          gzip: true,
          metadata: {
            contentType: file.mimeType,
            metadata: {
              custom: "metadata",
            },
          },
        })
      )
      .on("error", (err) => {
        reject(err);
        console.log(err);
      })
      .on("finish", async () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );

        try {
          await bucket.file(file.fileName).makePublic();
        } catch {
          console.log(
            `Uploaded the file successfully: ${file.fileName}, but public access is denied!`
          );
        }
        console.log(publicUrl);
        resolve({ url: publicUrl, name: file.fileName });
      });
  });

const uploadFile = async (args, req) => {
  try {
    let file = args.input;
    const data = await createFileStream(file);
    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

export default {
  uploadFile,
};
