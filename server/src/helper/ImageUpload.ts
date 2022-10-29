import fs from "fs";
import path from "path";
import type { FileUpload } from "graphql-upload-minimal"
import { nanoid } from ".";

type ImageUploadType = {
  url: string;
  name: string;
};

const ImageUplaod = ({
  filename,
  createReadStream,
}: FileUpload): Promise<ImageUploadType> =>
  new Promise((resolve, reject) => {
    let name = nanoid(5) + "-" + filename;

    let url = `http://localhost:4000/images/${name}`;

    let stream = createReadStream();
    stream
      .pipe(
        fs.createWriteStream(
          path.resolve(__dirname, `../../public/images/${name}`)
        )
      )
      .on("finish", () => resolve({ url, name }))
      .on("error", (e) => reject(e));
  });

export default ImageUplaod;
