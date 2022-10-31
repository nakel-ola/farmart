import { Storage } from "@google-cloud/storage";
import config from "../config";


const storage = new Storage({
  projectId: config.firebase_project_id,
  token: config.firebase_token,
  credentials: {
    private_key: config.firebase_private_key,
    client_email: config.firebase_client_email,
    client_id: config.firebase_client_id,
    token_url: config.firebase_token_url,
  },
});

export const bucket = storage.bucket("gs://farmart-8bdb8.appspot.com/");

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

    // res.status(200).send(fileInfos);
  } catch (err) {
    console.log(err);

    // res.status(500).send({
    //   message: "Unable to read list of files!",
    // });
  }
};