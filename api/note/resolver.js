import moment from "moment";
import Note from "./note.js";

const noteResolver = {
  Query: {
    notes: async (obj, args) => {
      const searchOptions = { completed: false };
      const sortOptions = {};

      if (args.search !== "") {
        searchOptions.title = new RegExp(args.search, "i");
      }

      if (args.field !== null) {
        sortOptions[args.field] = Number(args.sort);
      }

      if (args.completed) {
        delete searchOptions.completed;
      }

      return (await Note.find(searchOptions).sort(sortOptions)) || [];
    },
    note: async (obj, args) => (await Note.findById(args.id)) || new Note(),
  },
  Mutation: {
    addNote: async (obj, args) => {
      const note = new Note({
        title: args.input.title,
        description: args.input.description,
        dueDate: moment(args.input.dueDate).format(),
        importance: args.input.importance,
        completed: args.input.completed,
      });

      await note.save();
    },
    modifyNote: async (obj, args) => {
      const updateNote = {
        title: args.input.title,
        description: args.input.description,
        dueDate: args.input.dueDate,
        importance: args.input.importance,
        completed: args.input.completed,
      };
      await Note.findOneAndUpdate({ _id: args.input._id }, updateNote, {
        new: true,
      });
    },
    deleteNote: async (obj, args) => Note.deleteOne({ _id: args.id }),
  },
};

export default noteResolver;
