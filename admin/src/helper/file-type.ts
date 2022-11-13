import * as React from 'react';

const imageExt = [
  "jpeg",
  "jpg",
  "png",
  "gif",
  "svg",
  "ico",
  "apng",
  "avif",
  "bmp",
  "jpe",
  "jif",
  "jfif",
  "tiff",
  "tif",
  "webp",
  "xbm",
];
const videoExt = ["mp4", "WebM", "Ogg"];
const audioExt = ["aif", "cda", "mid", "midi", "mp3", "mpa", "ogg", "wav","wma","wpl"];
const compressedExt = ["7z", "arj", "deb", "pkg", "rar", "rpm", "tar.gz","z","zip"];
const discExt = ["bin", "dmg","iso","toast","vcd"];
const databaseExt = ["csv", "dat", "db", "dbf", "log","mdb","sav","tar","xml"];
const emailExt = ["email", "eml","emlx","msg","oft","ost","pst","vcf",""];
const executableExt = ["apk", "bat", "bin", "cgi", "pl","com","exe","gadget","jar","msi","py","wsf"];
const fontExt = ["fnt", "fon","otf","ttf"];


const fileType = (path: string) => {
    const ext = path.split('.').pop() ?? "";
    if(imageExt.includes(ext)) {return {type: "image", ext}}
    if(videoExt.includes(ext)) {return {type: "video", ext}}
    if(audioExt.includes(ext)) {return {type: "audio", ext}}
    if (compressedExt.includes(ext)) {return { type: "compressed", ext }};
    if (discExt.includes(ext)) {return { type: "disc", ext }};
    if (databaseExt.includes(ext)) {return { type: "database", ext }};
    if (emailExt.includes(ext)) {return { type: "email", ext }};
    if (executableExt.includes(ext)) {return { type: "executable", ext }};
    if (fontExt.includes(ext)) {
      return { type: "font", ext };
    };

    return { type: "unknown", ext };
}

export default fileType;