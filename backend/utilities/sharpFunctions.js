import sharp from "sharp";

// resizes the image before upload, save server space
export const sharpImgResize = async (multerReqFile) => {
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
