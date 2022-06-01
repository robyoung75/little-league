import sharp from "sharp";

// resizes the image before upload, save server space
export const sharpImgResize = async (multerReqFile) => {
  // console.log({ sharpImgResize_multerReqFile: multerReqFile });
  try {
    if (!multerReqFile) return;

    const imgUploadResponse = await sharp(multerReqFile.buffer)
      .webp({ quality: 20 })
      .toBuffer();

    return imgUploadResponse;
  } catch (error) {
    console.log({ sharpImgResize: error });
  }
};
