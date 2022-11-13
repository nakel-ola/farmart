import { Storage } from "@google-cloud/storage";
import {
  createReadStream,
  createWriteStream,
  existsSync,
  unlinkSync,
} from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";
import stream from "stream";
import { format } from "util";
import dataUrlToFile from "../../helper/dataUrlToFile";

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

const bucket = storage.bucket(process.env.BUCKET_NAME!);

const createFile = async (file: any, filepath: string) =>
  new Promise(async (resolve, reject) => {
    const buffer = await dataUrlToFile(file);
    const stream = createWriteStream(filepath);
    stream.write(buffer);
    stream.on("finish", () => resolve("successfully"));
    stream.on("error", (err) => reject(err));
    stream.end();
  });

const uploadFile = (filepath: string, filename: string) =>
  new Promise((resolve, reject) => {
    const blob = bucket.file(filename);
    let stream = createReadStream(filepath);

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

const createFileStream = (file: any) =>
  new Promise((resolve, reject) => {
    const blob = bucket.file(file.fileName);

    var bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(file.dataUrl, "base64"));
    bufferStream
      .pipe(
        blob.createWriteStream({
          metadata: {
            contentType: file.mimeType,
            metadata: {
              custom: "metadata",
            },
          },
          public: true,
          validation: "md5",
        })
      )
      .on("error",(err) => {
        reject(err)
        console.log(err)
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({
      data: null,
      error: "Method Not Allowed",
    });
    return;
  }
  // Just after the "Method Not Allowed" code
  try {
    let file = req.body.file;

    // const filepath = join(
    //   process.env.ROOT_DIR || process.cwd(),
    //   `/public/uploads/${file.fileName}`
    // );

    const data = await createFileStream(file);

    // if (!existsSync(filepath)) {
    //   const data = await createFile(file, filepath);
    //   console.log(data);
    // }

    // const data = await uploadFile(filepath, file.fileName);

    // if (data) {
    //   unlinkSync(filepath);
    // }

    res.status(200).json(data);
  } catch (e: any) {
    console.error(e);
    res
      .status(500)
      .json({ error: e.message, path: process.env.ROOT_DIR || process.cwd() });
  }
}
