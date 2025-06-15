class CollaborativeFilteringService {
  constructor() {
    // モックユーザーデータ（実際のアプリケーションではデータベースから取得）
    this.userReadingHistory = [
      {
        userId: "1",
        books: [
          { title: "1Q84", genre: "小説" },
          { title: "海辺のカフカ", genre: "小説" },
        ],
      },
      {
        userId: "2",
        books: [
          { title: "1Q84", genre: "小説" },
          { title: "ノルウェイの森", genre: "小説" },
        ],
      },
    ];
  }

  findSimilarUsers(userBooks) {
    // ユーザーの読書履歴との類似度を計算
    return this.userReadingHistory
      .map((user) => {
        const commonBooks = user.books.filter((book) =>
          userBooks.some(
            (userBook) =>
              userBook.title === book.title || userBook.genre === book.genre
          )
        );
        return {
          userId: user.userId,
          similarity:
            commonBooks.length / Math.max(user.books.length, userBooks.length),
        };
      })
      .filter((user) => user.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity);
  }

  getRecommendationsForGenre(genre, userBooks) {
    // 類似ユーザーを見つける
    const similarUsers = this.findSimilarUsers(userBooks);

    // 類似ユーザーが読んでいる本を収集
    const recommendations = new Set();
    similarUsers.forEach((similarUser) => {
      const user = this.userReadingHistory.find(
        (u) => u.userId === similarUser.userId
      );
      user.books.forEach((book) => {
        if (
          book.genre === genre &&
          !userBooks.some((userBook) => userBook.title === book.title)
        ) {
          recommendations.add(book);
        }
      });
    });

    return Array.from(recommendations).map((book) => ({
      ...book,
      reason: `同じような読書傾向を持つユーザーが高く評価している${genre}の本です`,
      id: Math.random().toString(36).substr(2, 9),
    }));
  }
}

export default CollaborativeFilteringService;
