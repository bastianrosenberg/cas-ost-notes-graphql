import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  importance: {
    type: Number,
    required: true,
  },
  completed: {
    type: Boolean,
    required: false,
  },
});

const Note = mongoose.model("Note", noteSchema);
export default Note;
