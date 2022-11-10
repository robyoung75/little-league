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
const createCloudinaryStream = (
  imgFileBuffer,
  adminUserObject,
  imgTagsArray
) => {
  // console.log("imgFileBuffer >>>>> ", imgFileBuffer);
  console.log({ adminUserObject });
  if (!imgFileBuffer) return;

  return new Promise((resolve, reject) => {
    // the last item in the tags array with be the file folder location name in cloudinary
    let fileFolderName = imgTagsArray[imgTagsArray.length - 1];

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${adminUserObject.teamUserName}/${fileFolderName}`,
        tags: imgTagsArray,
        public_id: `${adminUserObject.teamUserName}_name_${
          adminUserObject.lastName
            ? adminUserObject.lastName
            : adminUserObject.teamName
        }_${
          adminUserObject.firstName
            ? adminUserObject.firstName
            : adminUserObject.teamUserName
        }_${fileFolderName}`,
      },
      (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        // console.log({ result_cloudinary_stream_upload: result });
        resolve(result);
      }
    );

    bufferToStream(imgFileBuffer.img).pipe(stream);
  });
};

const createCloudinaryStreamMultiple = (imgFileBufferArray, imgTagsArray) => {

  console.log("createCloudinaryStreamMultiple >>>>> imgTagsArray", imgTagsArray)
  console.log("createCloudinaryStreamMultiple >>>>> imgFileBufferArray", imgFileBufferArray)
  // the last item in the tags array with be the file folder location name in cloudinary
  let fileFolderName = imgTagsArray[imgTagsArray.length - 1];

  let res_promises = imgFileBufferArray.map(
    (img) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `${img.teamUserName}/${fileFolderName}`,
            tags: imgTagsArray,
            // public_id set the end of the public domain
            // example: https://res.cloudinary.com/dyxsxutlm/image/upload/v1661706901/cottonwoodcolts/players/cottonwoodcolts_17_young_defense.webp
            public_id: `${img.teamUserName}_fName_${img.firstName}_lName_${img.lastName}_title_${img.imageTitle}`,
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        );
        console.log(img);
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
  adminUserObject,
  imgTagsArray
) => {
  const result = await createCloudinaryStream(
    imgFileBuffer,
    adminUserObject,
    imgTagsArray
  );

  // console.log("imageUploadResult", result);

  return result;
};

export const async_cloudinaryStreamImgs = async (
  imgFileBufferArray,
  imgTagsArray
) => {
  console.log("async_cloudinaryStreamImgs >>>>> imgFileBufferArray", imgFileBufferArray)
  console.log("async_cloudinaryStreamImgs >>>>> imgTagsArray", imgTagsArray)
  let results = await createCloudinaryStreamMultiple(
    imgFileBufferArray,
    imgTagsArray
  );
  // console.log("async_cloudinaryStreamImgs_results", results);
  return results;
};

// DELETE AN IMAGE BY PUBLIC ID
export const async_cloudinaryDeleteImg = async (publicId) => {
  try {


    const result = await cloudinary.uploader.destroy(publicId);
    console.log({deleteImg: result});

    return result;
  } catch (error) {
    console.log({ async_cloudinaryDeleteImg: error });
  }
};

// DELETE MULTIPLE IMAGES BY PUBLIC ID
export const async_cloudinaryDeleteMultipleImages = async (publicIdArr) => {
  
  const result = await cloudinary.api.delete_resources(publicIdArr);
  console.log({deleteMultipleImage: result})
  return result;
};
