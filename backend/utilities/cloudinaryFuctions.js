import { Readable } from "stream";
import { cloudinary } from "./cloudinary.js";

import { sharpImgResize } from "./sharpFunctions.js";

// read the data from the buffer of the image that we'll pass as argument. And later the data will be returned as a buffer object.
const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};

// streams a single image upload. parameters are multer req.file, teamId and team username. The promise resolves to the cloudinary result object
const createCloudinaryStream = (imgFileBuffer, teamId, teamUserName) => {
  // console.log("imgFileBuffer >>>>> ", imgFileBuffer);

  if (!imgFileBuffer) return;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: teamUserName,
        tags: [teamId, teamUserName],
      },
      (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        console.log({ result_cloudinary_stream_upload: result });
        resolve(result);
      }
    );

    bufferToStream(imgFileBuffer).pipe(stream);
  });
};

const createCloudinaryStreamMultiple = (
  imgFileBuffer,
  teamId,
  teamUserName
) => {
  let res_promises = imgFileBuffer.map(
    (img) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: teamUserName,
            tags: [
              teamId,
              teamUserName,
              img.imageTitle,
              img.playerNumber,
              img.playerLastName,
              img.playerFirstName,
            ],
            public_id: `${teamUserName}_${img.playerNumber}_${img.playerLastName}_${img.imageTitle}`,
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        );
        bufferToStream(img.image).pipe(stream);
      })
  );

  let results = Promise.all(res_promises);
  return results;
};

// async function that will upload an image to cloudinary return the cloudinary upload result
// the result can be used to tie a picture and mongodb record together
// a url as an example
export const async_cloudinaryStreamImg = async (
  imgFileBuffer,
  teamId,
  teamUserName
) => {
  const result = await createCloudinaryStream(
    imgFileBuffer,
    teamId,
    teamUserName
  );
  console.log(result);

  return result;
};

export const async_cloudinaryStreamImgs = async (
  imgFileBufferArray,
  teamId,
  teamUserName
) => {
  let results = await createCloudinaryStreamMultiple(
    imgFileBufferArray,
    teamId,
    teamUserName
  );
  console.log("async_cloudinaryStreamImgs_results", results);
  return results;
};
