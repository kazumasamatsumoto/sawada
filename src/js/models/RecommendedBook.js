class RecommendedBook {
  constructor(id, title, author, publisher, genre, popularity) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.publisher = publisher;
    this.genre = genre;
    this.popularity = popularity;
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

  getPopularity() {
    return this.popularity;
  }

  setPopularity(popularity) {
    this.popularity = popularity;
  }
}

export default RecommendedBook;
