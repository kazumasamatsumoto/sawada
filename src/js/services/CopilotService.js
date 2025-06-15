import { genreRecommendations } from "../../../mock/recommendations-db.js";

class CopilotService {
  constructor() {
    // ローカルでのリコメンデーション生成
    this.genreBasedRules = {
      小説: ["文学", "現代小説", "ミステリー"],
      技術書: ["プログラミング", "ソフトウェア開発", "コンピュータサイエンス"],
      ビジネス: ["経営", "自己啓発", "マネジメント"],
    };

    // 本のリコメンデーションデータベース
    this.recommendationsDB = genreRecommendations;
  }

  async getRecommendations(books) {
    try {
      // ジャンルベースの推薦ロジック
      const recommendations = this.generateLocalRecommendations(books);
      return recommendations;

      // デモ用のモックレコメンデーション（実際の環境では、ユーザーがCopilotの結果をアプリケーションに入力する）
      const mockRecommendations = [
        {
          title: "1Q84",
          author: "村上春樹",
          genre: "小説",
          reason:
            "「羊をめぐる冒険」と同じ著者で、同様の幻想的な世界観を持つ作品",
        },
        {
          title: "ノルウェイの森",
          author: "村上春樹",
          genre: "小説",
          reason: "現代文学の傑作で、繊細な心理描写が特徴",
        },
        {
          title: "斜陽",
          author: "太宰治",
          genre: "小説",
          reason: "「人間失格」の著者による、同様に人間の内面を描いた作品",
        },
        {
          title: "クリーンコード",
          author: "ロバート・C・マーティン",
          genre: "技術書",
          reason:
            "「リファクタリング」と同様、コードの品質向上について学べる本",
        },
        {
          title: "コーチングの基本",
          author: "伊藤守",
          genre: "ビジネス",
          reason:
            "「ゼロ秒思考」と同様、思考法とコミュニケーションについて学べる本",
        },
      ];

      return mockRecommendations.map((book) => ({
        ...book,
        id: Math.random().toString(36).substr(2, 9),
      }));
    } catch (error) {
      console.error("Error getting recommendations from Copilot:", error);
      throw error;
    }
  }

  createPrompt(books) {
    const bookList = books
      .map(
        (book) =>
          `タイトル: ${book.title}\n著者: ${book.author}\nジャンル: ${book.genre}\n`
      )
      .join("\n");

    return `以下の本のリストを参考に、似た本を5冊推薦してください。推薦する本には、タイトル、著者、ジャンル、おすすめ理由を含めてください。
       
既読の本リスト：
${bookList}
 
推薦する本のフォーマット：
{
    "recommendations": [
        {
            "title": "本のタイトル",
            "author": "著者名",
            "genre": "ジャンル",
            "reason": "おすすめ理由"
        }
    ]
}`;
  }

  parseRecommendations(response) {
    try {
      // Copilotの応答からJSON部分を抽出
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const data = JSON.parse(jsonMatch[0]);
      return data.recommendations.map((book) => ({
        ...book,
        id: Math.random().toString(36).substr(2, 9), // 一時的なID生成
      }));
    } catch (error) {
      console.error("Error parsing Copilot response:", error);
      return [];
    }
  }

  generateLocalRecommendations(books) {
    const recommendations = [];

    // ジャンルごとの本の出現頻度を計算
    const genreCounts = books.reduce((acc, book) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {});

    // よく読まれているジャンルに基づいて推薦
    const popularGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([genre]) => genre);

    // リコメンデーションの生成
    popularGenres.forEach((genre) => {
      const relatedGenres = this.genreBasedRules[genre] || [];
      // メインジャンルからランダムに1冊選択
      if (
        this.recommendationsDB[genre] &&
        this.recommendationsDB[genre].length > 0
      ) {
        const randomIndex = Math.floor(
          Math.random() * this.recommendationsDB[genre].length
        );
        const mainBook = this.recommendationsDB[genre][randomIndex];
        mainBook.reason =
          `あなたが${genre}の本を${genreCounts[genre]}冊読んでいるため、` +
          mainBook.reason;
        recommendations.push({
          ...mainBook,
          id: Math.random().toString(36).substr(2, 9),
        });
      }

      // 関連ジャンルからそれぞれ1冊ずつ選択
      relatedGenres.forEach((relatedGenre) => {
        if (
          this.recommendationsDB[relatedGenre] &&
          this.recommendationsDB[relatedGenre].length > 0
        ) {
          const randomIndex = Math.floor(
            Math.random() * this.recommendationsDB[relatedGenre].length
          );
          const relatedBook = this.recommendationsDB[relatedGenre][randomIndex];
          relatedBook.reason =
            `${genre}を読んでいる方におすすめの${relatedGenre}の本です。` +
            relatedBook.reason;
          recommendations.push({
            ...relatedBook,
            id: Math.random().toString(36).substr(2, 9),
          });
        }
      });
    });

    // 最大5冊まで返す
    return recommendations.slice(0, 5);
  }
}

export default CopilotService;
