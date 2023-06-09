import noteService from "../services/note-service.js";

import Note from "../services/note.js";
import CONSTANTS from "../utils/constants.js";
import MarkupGenerator from "../utils/markup-generator.js";

const notesContainer = document.querySelector("#notes-container");
const noteDialog = document.querySelector("#note-dialog");

let searchFilter = "";
let showCompleted = false;
const sortNote = { field: "dueDate", sort: 1 };

const createButton = document.querySelector("#button-create");
const completedInput = document.querySelector("#filter-completed");
const searchInput = document.querySelector("#search");

const getNoteIdFromContainer = (element) =>
  element.closest(".note").dataset.noteId;

async function renderNotes() {
  const { data } = await noteService.fetchNotes(
    searchFilter,
    sortNote,
    showCompleted
  );

  notesContainer.innerHTML = MarkupGenerator.generateNotes(
    data.notes.map(
      (m) =>
        new Note(
          m.title,
          m.description,
          m.dueDate,
          m.importance,
          m.completed,
          m._id
        )
    )
  );
}

const deleteNote = async (clickedElem) => {
  const noteId = getNoteIdFromContainer(clickedElem);

  await noteService.removeNote(noteId).then(() => {
    clickedElem.closest(".note").remove();
    socket.emit("message", noteId);
  });
};

async function toggleFinishState(element) {
  const response = await noteService.findNote(getNoteIdFromContainer(element));
  const { note } = response.data;

  await noteService.modifyNote({
    ...note,
    completed: element.textContent === CONSTANTS.COMPLETE,
  });
  socket.emit("message", note._id);
}

// form inputs
const noteIdInput = noteDialog.querySelector("#note-id");
const title = noteDialog.querySelector("h1");
const formTitle = noteDialog.querySelector("#title");
const formDescription = noteDialog.querySelector("#description");
const formDueDate = noteDialog.querySelector("#duedate");
const submitButton = noteDialog.querySelector("#submit-button");
const formImportance = noteDialog.querySelector("#importance");
const formCompleted = noteDialog.querySelector("#completed");

const handleEdit = async (noteId) => {
  if (noteId) {
    const {
      data: { note },
    } = await noteService.findNote(noteId);
    noteIdInput.value = note._id;
    formTitle.value = note.title;
    formDescription.value = note.description;
    formDueDate.value = moment(note.dueDate).format(CONSTANTS.DATE_FORMAT);
    submitButton.textContent = CONSTANTS.UPDATE;
    title.textContent = CONSTANTS.UPDATE_NOTE;
    formImportance.valueAsNumber = note.importance;
  } else {
    document.getElementsByName("star3").checked = true;
    formDueDate.value = moment().format(CONSTANTS.DATE_FORMAT);
    formCompleted.checked = false;
  }
};

async function saveNote() {
  const newNote = new Note(
    formTitle.value,
    formDescription.value,
    moment(formDueDate.value).format(),
    formImportance.valueAsNumber,
    false
  );

  await noteService.addNote(newNote);
}

const updateNote = async (id) => {
  const note = new Note(
    formTitle.value,
    formDescription.value,
    moment(formDueDate.value).format(),
    formImportance.valueAsNumber,
    false,
    id
  );

  await noteService.modifyNote(note);
};

async function handleManipulateNoteEvent(event) {
  const clickedElement = event.target;

  switch (clickedElement.id) {
    case "delete-button":
      if (clickedElement.textContent === CONSTANTS.DELETE) {
        clickedElement.textContent = CONSTANTS.CONFIRM;
        clickedElement.style.background = getComputedStyle(
          document.body
        ).getPropertyValue("--warn-color");
      } else {
        await deleteNote(clickedElement);
      }
      break;
    case "edit-button":
      handleEdit(getNoteIdFromContainer(clickedElement));
      noteDialog.showModal();
      break;
    case "complete-button":
      await toggleFinishState(clickedElement);
      break;
    default:
      break;
  }
}

async function handleFormSubmitEvent() {
  if (noteIdInput.value) {
    await updateNote(noteIdInput.value);
  } else {
    await saveNote();
  }
  await renderNotes();
  socket.emit("message", noteIdInput.value);
  noteDialog.close();
}

async function initEventHandlers() {
  notesContainer?.addEventListener("click", async (event) => {
    await handleManipulateNoteEvent(event);
  });

  noteDialog.addEventListener("close", async () => {
    if (noteDialog.returnValue === "cancel") {
      return;
    }
    await handleFormSubmitEvent();
  });

  createButton.addEventListener("click", () => {
    title.textContent = CONSTANTS.CREATE_NOTE;
    submitButton.textContent = CONSTANTS.CREATE;
    noteIdInput.value = null;
    formTitle.value = null;
    formDescription.value = null;
    formDueDate.value = moment().format(CONSTANTS.DATE_FORMAT);
    formImportance.valueAsNumber = CONSTANTS.DEFAULT_IMPORTANCE;

    noteDialog.showModal();
  });

  const sortButtons = document.querySelectorAll(".btn.sort");
  sortButtons.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const clickedButton = event.target;
      sortNote.field = event.target.dataset.field;
      sortNote.sort *= -1;

      sortButtons.forEach((element) => {
        const resetButton = element;
        resetButton.textContent = resetButton.name;
      });

      clickedButton.textContent += sortNote.sort === -1 ? " ▼" : " ▲";

      await renderNotes();
    });
  });

  searchInput.addEventListener("keyup", async (event) => {
    const stringLength = event.target.value.length;
    if (stringLength === 0 || stringLength > 2) {
      searchFilter = event.target.value;
      await renderNotes();
    }
  });

  completedInput.addEventListener("click", async (event) => {
    showCompleted = event.target.checked;
    await renderNotes();
  });
}

async function init() {
  // for sake of simplicity we reload all data
  socket.on("message", () => {
    renderNotes();
  });
  await initEventHandlers();
  await renderNotes();
}

init();
