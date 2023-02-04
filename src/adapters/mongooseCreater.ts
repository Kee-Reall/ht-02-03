import mongoose from "mongoose";
import {BlogSchema} from "../models/Schemas/blog";

mongoose.connect('mongodb://localhost/ht10')

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("We're connected to MongoDB!")
});

export const Blogs = db.model("Blogs",BlogSchema)