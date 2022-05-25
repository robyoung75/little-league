import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    image: {
        type: Image,
        name: String,
        description: String,
        img: {
            data: Buffer,
            contentType: String
        }
    }
})

export default mongoose.model('images', ImageSchema)