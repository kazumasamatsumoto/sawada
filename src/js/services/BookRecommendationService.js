class BookRecommendationService {
  constructor() {
    this.baseUrl = "https://www.googleapis.com/books/v1/volumes";
    this.lastRecommendations = [];
  }

  async generateRecommendations() {
    try {
      const storageService = await import("./StorageService.js");
      const storage = new storageService.default();
      const books = storage.loadBooks();

      const recommendations = await this.getRecommendations(books);
      this.lastRecommendations = recommendations;
      return recommendations;
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return [];
    }
  }

  getLastRecommendations() {
    return this.lastRecommendations || [];
  }

  async getRecommendations(books) {
    try {
      // ユーザーの主要ジャンルを特定
      const genreCounts = books.reduce((acc, book) => {
        acc[book.genre] = (acc[book.genre] || 0) + 1;
        return acc;
      }, {});

      const popularGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([genre]) => genre);

      // 各ジャンルの本を検索して結果を統合
      const recommendations = [];
      for (const genre of popularGenres) {
        const genreBooks = await this.searchBooksByGenre(
          genre,
          Math.ceil(5 / popularGenres.length)
        );
        recommendations.push(
          ...genreBooks.map((book) => ({
            ...book,
            reason:
              `あなたが${genre}の本を${genreCounts[genre]}冊読んでいるため、` +
              book.reason,
          }))
        );
      }

      return recommendations.slice(0, 5);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      return this.getFallbackRecommendations(books);
    }
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
        reason: item.volumeInfo.description
          ? item.volumeInfo.description.slice(0, 100) + "..."
          : "この分野で高い評価を受けている本です。",
        id: item.id,
      }));
    } catch (error) {
      console.error("Error fetching books from Google Books API:", error);
      return [];
    }
  }

  getFallbackRecommendations(books) {
    // APIが失敗した場合のフォールバック: ジャンルベースの基本的な推薦
    const genreCounts = books.reduce((acc, book) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre, count]) => ({
        title: `${genre}の本`,
        author: "著名な作家",
        genre: genre,
        reason: `あなたが${genre}の本を${count}冊読んでいるため、おすすめの1冊です`,
        id: Math.random().toString(36).substr(2, 9),
      }));
  }
}

export default BookRecommendationService;
