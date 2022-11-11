// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Storage } from "@google-cloud/storage";
import { createReadStream } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { format } from "util";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
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

    let filename = req.query.file?.toString()!;

    // console.log

    const blob = bucket.file(filename);
    let stream = createReadStream(filename);

    stream
      .pipe(
        bucket.file(filename).createWriteStream({
          resumable: false,
          gzip: true,
        })
      )
      .on("error", (err: any) => console.log(err)) // reject on error
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
      });
  } catch (error) {
    console.log(error);
  }
}
