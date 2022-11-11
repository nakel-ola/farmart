import { Storage } from "@google-cloud/storage";
import { createReadStream } from "fs";
import { format } from "util";

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  token: process.env.TOKEN,
  credentials: {
    client_id: process.env.CLIENT_ID,
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY,
    token_url: process.env.TOKEN_URL,
  },
});

type ImageUploadType = {
  url: string;
  name: string;
};

export const bucket = storage.bucket(process.env.BUCKET_NAME!);

export const ImageUplaod = ({
  filename,
}: {
  filename: string;
}): Promise<ImageUploadType> =>
  new Promise((resolve, reject) => {
    const blob = bucket.file(filename);
    let stream = createReadStream(filename);

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
export const deleteFile = async ({ fileName }: { fileName: string }) =>
  await bucket.file(fileName).delete();
