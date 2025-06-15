class RecommendationService {
  constructor(books, copilotService) {
    this.books = books; // Array of previously read books
    this.copilotService = copilotService;
    this.cachedRecommendations = null;
  }

  async generateRecommendations() {
    try {
      // Copilotを使用して推薦を取得
      const recommendations = await this.copilotService.getRecommendations(
        this.books
      );
      this.cachedRecommendations = recommendations;
      return recommendations;
    } catch (error) {
      console.error("Error generating recommendations:", error);

      // フォールバック: 同じジャンルの本を推薦
      const recommendations = [];
      const genres = this.books.map((book) => book.genre);
      const uniqueGenres = [...new Set(genres)];

      uniqueGenres.forEach((genre) => {
        const recommendedBooks = this.books.filter(
          (book) => book.genre === genre
        );
        recommendations.push(...recommendedBooks);
      });

      return recommendations;
    }
  }

  getLastRecommendations() {
    return this.cachedRecommendations || [];
  }
}

export default RecommendationService;
