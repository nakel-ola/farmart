import { Storage } from "@google-cloud/storage";
import fs, { createWriteStream } from "fs";
import multer from "multer";
import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { format } from "util";
// import { ApiResponse } from '../../../models/ApiResponse';

export type SuccessfulResponse<T> = {
  data: T;
  error?: never;
  statusCode?: number;
};
export type UnsuccessfulResponse<E> = {
  data?: never;
  error: E;
  statusCode?: number;
};

export type ApiResponse<T, E = unknown> =
  | SuccessfulResponse<T>
  | UnsuccessfulResponse<E>;

interface NextConnectApiRequest extends NextApiRequest {
  files: Express.Multer.File[];
}
type ResponseData = ApiResponse<string[], string>;

const oneMegabyteInBytes = 1000000;
const outputFolderName = "/public/uploads";

const upload = multer({
  limits: { fileSize: oneMegabyteInBytes * 2 },
  // dest: outputFolderName,
  storage: multer.diskStorage({
    destination: (
      req: any,
      file: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void
    ) => {
      const stream = createWriteStream(`${outputFolderName}\\${file.filename}`);
      stream.write(JSON.stringify([]));
      stream.end();
      callback(null, outputFolderName);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  // fileFilter: (req, file, cb) => {
  //   const acceptFile: boolean = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
  //   cb(null, acceptFile);
  // },
});

const apiRoute = nextConnect({
  onError(
    error,
    req: NextConnectApiRequest,
    res: NextApiResponse<ResponseData>
  ) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
})
  .use(upload.single("theFiles"))
  .post((req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) => {
    const filenames = fs.readdirSync(outputFolderName);
    const images = filenames.map((name) => name);

    res.status(200).json({ data: images });
  });

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

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
    externalResolver: true,
  },
};
export default apiRoute;
