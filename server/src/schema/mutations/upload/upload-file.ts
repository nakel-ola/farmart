import { Storage } from "@google-cloud/storage";
import type { FileUpload } from "graphql-upload-minimal";
import path from "path";
import { format } from "util";
import config from "../../../config";

const serviceKey = path.join(__dirname, config.storage_credentials_path!);

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: config.storage_project_id,
});


const bucket = storage.bucket(config.storage_bucket_name!);

interface Args {
  file: Promise<FileUpload>;
}
const uploadFile = async (_: any, args: Args) => {
  const { file } = args;
  const newFile = await file;
  const url = await upload(newFile);

  return { url };
};

export const upload = async (args: FileUpload) =>
  new Promise<string>((resolve, reject) => {
    const { filename, createReadStream } = args;
    const blob = bucket.file(filename);
    let stream = createReadStream();

    stream
      .pipe(
        bucket
          .file(filename)
          .createWriteStream({ gzip: true, resumable: false })
      )
      .on("error", (err: any) => {
        reject(err);
      })
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
        resolve(publicUrl);
      });
  });
export default uploadFile;
