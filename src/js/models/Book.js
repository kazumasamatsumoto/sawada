class Book {
  constructor(
    id,
    title,
    author,
    publisher,
    genre,
    isbn,
    readDate,
    rating,
    notes
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.publisher = publisher;
    this.genre = genre;
    this.isbn = isbn;
    this.readDate = readDate;
    this.rating = rating;
    this.notes = notes;
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getTitle() {
    return this.title;
  }

  setTitle(title) {
    this.title = title;
  }

  getAuthor() {
    return this.author;
  }

  setAuthor(author) {
    this.author = author;
  }

  getPublisher() {
    return this.publisher;
  }

  setPublisher(publisher) {
    this.publisher = publisher;
  }

  getGenre() {
    return this.genre;
  }

  setGenre(genre) {
    this.genre = genre;
  }

  getIsbn() {
    return this.isbn;
  }

  setIsbn(isbn) {
    this.isbn = isbn;
  }

  getReadDate() {
    return this.readDate;
  }

  setReadDate(readDate) {
    this.readDate = readDate;
  }

  getRating() {
    return this.rating;
  }

  setRating(rating) {
    this.rating = rating;
  }

  getNotes() {
    return this.notes;
  }

  setNotes(notes) {
    this.notes = notes;
  }
}

export default Book;
