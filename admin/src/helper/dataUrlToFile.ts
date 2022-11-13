import axios from "axios";

export interface FileData {
  dataUrl: string;
  fileName: string;
  mimeType: string;
}
const dataUrlToFile = async ({
  dataUrl,
  fileName,
  mimeType,
}: FileData): Promise<Buffer> => {
  const data = dataUrl.replace(/^data:image\/\w+;base64,/,"");
  const blob: Buffer = Buffer.from(data, "base64");
  return blob;
};

export default dataUrlToFile;
