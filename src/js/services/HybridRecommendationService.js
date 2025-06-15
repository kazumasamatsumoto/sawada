import { genreRecommendations } from "../../../mock/recommendations-db.js";
import GoogleBooksService from "./GoogleBooksService.js";
import CollaborativeFilteringService from "./CollaborativeFilteringService.js";

class HybridRecommendationService {
  constructor() {
    this.googleBooksService = new GoogleBooksService();
    this.collaborativeService = new CollaborativeFilteringService();
    this.staticRecommendations = genreRecommendations;
  }

  async getRecommendationsForGenre(genre, userBooks, maxResults = 5) {
    try {
      // 1. 静的データベースからの推薦
      const staticRecs = this.staticRecommendations[genre] || [];

      // 2. 協調フィルタリングからの推薦
      const collaborativeRecs =
        this.collaborativeService.getRecommendationsForGenre(genre, userBooks);

      // 3. Google Books APIからの推薦
      const apiRecs = await this.googleBooksService.searchBooksByGenre(genre);

      // 推薦結果の統合とスコアリング
      const allRecommendations = [
        ...staticRecs.map((book) => ({ ...book, score: 3 })), // 静的データは信頼度が高い
        ...collaborativeRecs.map((book) => ({ ...book, score: 2 })), // ユーザーベースの推薦
        ...apiRecs.map((book) => ({ ...book, score: 1 })), // API結果は補完的
      ];

      // 重複の除去とスコアによるソート
      const uniqueRecommendations = Array.from(
        allRecommendations
          .reduce((map, book) => {
            if (
              !map.has(book.title) ||
              map.get(book.title).score < book.score
            ) {
              map.set(book.title, book);
            }
            return map;
          }, new Map())
          .values()
      );

      // スコアでソートして上位n件を返す
      return uniqueRecommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)
        .map((book) => ({
          title: book.title,
          author: book.author,
          genre: book.genre,
          reason: book.reason,
          id: Math.random().toString(36).substr(2, 9),
        }));
    } catch (error) {
      console.error("Error in hybrid recommendations:", error);
      // エラー時は静的データベースにフォールバック
      return this.staticRecommendations[genre] || [];
    }
  }

  async getRecommendations(userBooks, maxResults = 5) {
    // ユーザーの主要ジャンルを特定
    const genreCounts = userBooks.reduce((acc, book) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {});

    const popularGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([genre]) => genre);

    // 各ジャンルごとに推薦を取得して統合
    const recommendations = [];
    for (const genre of popularGenres) {
      const genreRecs = await this.getRecommendationsForGenre(
        genre,
        userBooks,
        Math.ceil(maxResults / popularGenres.length)
      );
      recommendations.push(...genreRecs);
    }

    return recommendations.slice(0, maxResults);
  }
}

export default HybridRecommendationService;
