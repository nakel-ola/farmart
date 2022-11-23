import fs from "fs";
import type { FileUpload } from "graphql-upload-minimal";
import { format } from "util";
import { bucket } from "./gcloud";

export type ImageUploadType = {
  url: string;
  name: string;
};

const ImageUplaod = ({
  filename,
  createReadStream,
}: FileUpload): Promise<ImageUploadType> =>
  new Promise((resolve, reject) => {
    const blob = bucket.file(filename);
    let stream = createReadStream();

    stream
      .pipe(
        bucket.file(filename).createWriteStream({
          resumable: false,
          gzip: true,
        })
      )
      .on("error", (err: any) => {
        reject(err);
      }) // reject on error
      .on("finish", async () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );

        try {
          await bucket.file(filename).makePublic();
        } catch {
          console.log(
            `Uploaded the file successfully: ${filename}, but public access is denied!`
          );
        }
        resolve({ url: publicUrl, name: filename });
      });
  });
export default ImageUplaod;
