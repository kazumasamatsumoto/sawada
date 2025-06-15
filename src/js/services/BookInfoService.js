class BookInfoService {
  async fetchBookInfoByISBN(isbn) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
      );
      const data = await response.json();

      if (data.totalItems === 0) {
        throw new Error("本が見つかりませんでした");
      }

      const bookInfo = data.items[0].volumeInfo;
      return {
        title: bookInfo.title || "",
        author: (bookInfo.authors || []).join(", "),
        publisher: bookInfo.publisher || "",
        genre: (bookInfo.categories || []).join(", "),
      };
    } catch (error) {
      throw new Error("本の情報を取得できませんでした: " + error.message);
    }
  }
}

export default BookInfoService;
