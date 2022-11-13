import { Storage } from "@google-cloud/storage";
import type { FileUpload } from "graphql-upload-minimal";
import { format } from "util";
import config from "../config";

const storage = new Storage({
  projectId: config.firebase_project_id,
  token: config.firebase_token,
  credentials: {
    private_key: `${config.firebase_private_key}`,
    client_email: config.firebase_client_email,
    client_id: config.firebase_client_id,
    token_url: config.firebase_token_url,
  },
});

type ImageUploadType = {
  url: string;
  name: string;
};

export const bucket = storage.bucket(config.firebase_bucket_name);

export const getListFiles = async () => {
  try {
    const [files] = await bucket.getFiles();
    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file.name,
        url: file.metadata.mediaLink,
      });
    });

    console.log(fileInfos);

    return fileInfos;
  } catch (err) {
    console.log(err);
  }
};

export const ImageUplaod = ({
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
      .on("error", (err: any) => reject(err)) // reject on error
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
        console.log(publicUrl);
        resolve({ url: publicUrl, name: filename });
      });
  });
export const deleteFile = async ({ fileName }: { fileName: string }) => await bucket.file(fileName).delete();
