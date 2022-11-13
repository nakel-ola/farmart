import { Storage } from "@google-cloud/storage";
import {
  createReadStream,
  createWriteStream,
  existsSync,
  unlinkSync,
} from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";
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

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {

//   try {
//     const storage = new Storage({
//       projectId: process.env.PROJECT_ID,
//       token: process.env.TOKEN,
//       credentials: {
//         client_id: process.env.CLIENT_ID,
//         client_email: process.env.CLIENT_EMAIL,
//         private_key: process.env.PRIVATE_KEY,
//         token_url: process.env.TOKEN_URL,
//       },
//     });

//     const bucket = storage.bucket(process.env.BUCKET_NAME!);
//     const file = bucket.file(req.query.file?.toString()!);

//     const publicUrl = format(
//       `https://storage.googleapis.com/${bucket.name}/${file.name}`
//     );

//     const [response] = await file.makePublic();

//     console.log(response)
//     res.status(200).json({
//       url: publicUrl,
//       name: req.query.file
//     });
//   } catch (error) {
//     console.log(error)
//   }

// }

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

    const filepath = join(
      process.env.ROOT_DIR || process.cwd(),
      `/public/uploads/${file.fileName}`
    );

    if (!existsSync(filepath)) {
      const data = await createFile(file, filepath);
      console.log(data);
    }

    const data = await uploadFile(filepath, file.fileName);

    if (data) {
      unlinkSync(filepath);
    }

    res.status(200).json(data);
  } catch (e: any) {
    console.error(e);
    res
      .status(500)
      .json({ error: e.message, path: process.env.ROOT_DIR || process.cwd() });
  }
}
