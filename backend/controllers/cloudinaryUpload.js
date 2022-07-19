import { cloudinary } from "../utilities/cloudinary.js";
import sharp from "sharp";
import { Readable } from "stream";


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

const cloudinaryUpload_post = async (req, res) => {
  console.log(req.file.buffer);

  const data = await sharp(req.file.buffer).webp({ quality: 20 }).toBuffer();
 

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "DEV",
    },
    (error, result) => {
      if (error) res.send(error);
      // return res.json({ URL: result.secure_url });
    }
  );

  res.send(bufferToStream(data).pipe(stream));


};
export { cloudinaryUpload_post };












  //   try {
  //       const fileStr = req.file;
  //       const uploadResponse = await cloudinary.uploader.upload(fileStr, {
  //           upload_preset: 'dev_setups',
  //       });
  //       console.log(uploadResponse);
  //       res.json({ msg: 'yaya' });
  //   } catch (err) {
  //       console.error(err);
  //       res.status(500).json({ err: 'Something went wrong' });
  //   }