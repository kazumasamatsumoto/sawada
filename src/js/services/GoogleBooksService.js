class GoogleBooksService {
  constructor() {
    this.baseUrl = "https://www.googleapis.com/books/v1/volumes";
  }

  async searchBooksByGenre(genre, maxResults = 5) {
    try {
      const query = encodeURIComponent(`subject:${genre}`);
      const response = await fetch(
        `${this.baseUrl}?q=${query}&maxResults=${maxResults}&langRestrict=ja&orderBy=relevance`
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      return data.items.map((item) => ({
        title: item.volumeInfo.title,
        author: (item.volumeInfo.authors || []).join(", "),
        genre: genre,
        reason: `${genre}の分野で高い評価を受けている本です。${
          item.volumeInfo.description
            ? item.volumeInfo.description.slice(0, 100) + "..."
            : ""
        }`,
        id: item.id,
      }));
    } catch (error) {
      console.error("Error fetching books from Google Books API:", error);
      return [];
    }
  }
}

export default GoogleBooksService;
