export default class Note {
  constructor(
    title,
    description,
    dueDate,
    importance,
    completed,
    id = undefined
  ) {
    this._id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.completed = completed;
    this.importance = importance;
    this.days = Math.ceil(
      (Date.parse(this.dueDate) - Date.now()) / (1000 * 3600 * 24)
    );
    this.daysText = () => {
      if (this.days === 0) {
        return "today";
      }

      if (this.days === -1) {
        return "a day ago";
      }

      if (this.days === 1) {
        return "in a day";
      }

      if (this.days < 0) {
        return `${Math.abs(this.days)} days ago`;
      }

      return `in ${this.days} days`;
    };
  }
}
