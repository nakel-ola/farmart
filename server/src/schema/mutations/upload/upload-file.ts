import { Storage } from "@google-cloud/storage";
import type { FileUpload } from "graphql-upload-minimal";
import path from "path";
import { format } from "util";
import config from "../../../config";

// const serviceKey = path.join(config.storage_credentials_path!);

const data = JSON.parse(config.storage_credentials!);

console.log(data);

const storage = new Storage({
  // keyFilename: serviceKey,
  projectId: config.storage_project_id,
  credentials: require(config.storage_credentials_path!),

  // credentials: {
  // client_email: data["client_email"],
  // client_id: data["client_id"],
  // private_key: data["private_key"],
  // token_url: data["token_url"],
  // type: "service_account",

  // private_key_id: "xxxx",

  // auth_uri: "https://accounts.google.com/o/oauth2/auth",
  // token_uri: "https://oauth2.googleapis.com/token",
  // auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  // client_x509_cert_url: "xxx",
  // },
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
        console.log(err);
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
