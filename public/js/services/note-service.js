import HttpHelper from "../utils/http-helper.js";

class NoteService {
  constructor() {
    this.httpHelper = HttpHelper;
  }

  fetchNotes = async (search, sortNote, completed) => {
    const query = {
      query: `query {
              notes(
                search: "${search}" 
                field: "${sortNote.field}" 
                sort: ${sortNote.sort} 
                completed: ${completed}) {
                  _id
                  title
                  description
                  dueDate
                  importance
                  completed
              }
            }`,
    };

    return this.httpHelper.ajax(query);
  };

  findNote = async (id) => {
    const query = {
      query: `query {
                note(id: "${id}") {
                    _id
                    title
                    description
                    dueDate
                    importance
                    completed
                }
              }`,
    };

    return this.httpHelper.ajax(query);
  };

  addNote = async (note) => {
    const query = {
      query: `mutation {
                addNote(input: {
                        title: "${note.title}" 
                        description: "${note.description}" 
                        dueDate: "${note.dueDate}" 
                        importance: ${note.importance} 
                        completed: ${note.completed}})
                    {
                        _id
                    }
              }`,
    };

    socket.emit("modify");
    return this.httpHelper.ajax(query);
  };

  modifyNote = async (note) => {
    const query = {
      query: `mutation {
                  modifyNote(input: {
                          _id: "${note._id}"
                          title: "${note.title}" 
                          description: "${note.description}" 
                          dueDate: "${note.dueDate}" 
                          importance: ${note.importance} 
                          completed: ${note.completed}})
                      {
                          _id
                      }
                }`,
    };

    socket.emit("modify", note._id);
    return this.httpHelper.ajax(query);
  };

  removeNote = async (id) => {
    const query = {
      query: `mutation {
            deleteNote(id: "${id}")
                {
                    _id
                }
            }`,
    };

    socket.emit("delete", id);
    return this.httpHelper.ajax(query);
  };
}

const noteService = new NoteService();
export default noteService;
