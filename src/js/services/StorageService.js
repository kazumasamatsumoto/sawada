class StorageService {
  saveBooks(books) {
    localStorage.setItem("books", JSON.stringify(books));
  }

  loadBooks() {
    const books = localStorage.getItem("books");
    return books ? JSON.parse(books) : [];
  }

  addBook(newBook) {
    const books = this.loadBooks();
    books.push(newBook);
    this.saveBooks(books);
  }

  clearBooks() {
    localStorage.removeItem("books");
  }
}

export default StorageService;
