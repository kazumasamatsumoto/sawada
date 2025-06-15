import BookInfoService from "./services/BookInfoService.js";
import StorageService from "./services/StorageService.js";
import BookRecommendationService from "./services/BookRecommendationService.js";
import Book from "./models/Book.js";
import { mockBooks } from "../mock/data.js";

// This file is the entry point of the JavaScript application. It initializes the app, sets up event listeners, and manages the overall application flow.

document.addEventListener("DOMContentLoaded", async () => {
  const bookInfoService = new BookInfoService();
  const storageService = new StorageService();

  // ホームページの場合、本のリストを表示
  const bookListElement = document.getElementById("book-list");
  if (bookListElement) {
    // ローカルストレージから本のデータを取得
    const books = storageService.loadBooks();

    // 本がない場合は初期データを使用
    if (books.length === 0 && mockBooks) {
      storageService.saveBooks(mockBooks);
    }

    // 再度データを取得（初期データが保存された可能性があるため）
    const displayBooks = storageService.loadBooks();

    // 本のリストを表示する
    displayBooks.forEach((book) => {
      const bookCard = document.createElement("div");
      bookCard.className = "book-card";
      bookCard.style.cursor = "pointer";
      bookCard.innerHTML = `
                <h3>${book.title}</h3>
                <p class="author">著者: ${book.author}</p>
                <p class="genre">ジャンル: ${book.genre}</p>
                <div class="rating">評価: ${"★".repeat(
                  book.rating
                )}${"☆".repeat(5 - book.rating)}</div>
            `;
      // クリックイベントを追加
      bookCard.addEventListener("click", () => {
        // 本のIDをURLパラメータとして詳細ページに遷移
        window.location.href = `book-detail.html?id=${book.id}`;
      });
      bookListElement.appendChild(bookCard);
    });
  }

  // 本の登録フォームの処理
  const form = document.getElementById("bookForm");
  const fetchButton = document.getElementById("fetchBookInfo");
  const isbnInput = document.getElementById("isbn");

  if (fetchButton) {
    fetchButton.addEventListener("click", async () => {
      const isbn = isbnInput.value.trim();
      if (!isbn) {
        alert("ISBNを入力してください");
        return;
      }

      try {
        fetchButton.disabled = true;
        fetchButton.textContent = "取得中...";

        const bookInfo = await bookInfoService.fetchBookInfoByISBN(isbn);

        // フォームに情報を自動入力
        document.getElementById("title").value = bookInfo.title;
        document.getElementById("author").value = bookInfo.author;
        document.getElementById("publisher").value = bookInfo.publisher;
        document.getElementById("genre").value = bookInfo.genre;
      } catch (error) {
        alert(error.message);
      } finally {
        fetchButton.disabled = false;
        fetchButton.textContent = "情報を取得";
      }
    });
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const bookData = {
        id: Date.now().toString(),
        isbn: formData.get("isbn"),
        title: formData.get("title"),
        author: formData.get("author"),
        publisher: formData.get("publisher"),
        genre: formData.get("genre"),
        rating: parseInt(formData.get("rating")),
        readDate: formData.get("readDate"),
        notes: formData.get("notes"),
      };

      try {
        const book = new Book(
          bookData.id,
          bookData.title,
          bookData.author,
          bookData.publisher,
          bookData.genre,
          bookData.isbn,
          bookData.readDate,
          bookData.rating,
          bookData.notes
        );

        storageService.addBook(book);
        alert("本が正常に登録されました");
        window.location.href = "home.html";
      } catch (error) {
        alert("本の登録に失敗しました: " + error.message);
      }
    });
  }

  // リコメンド本ページの処理
  const recommendationsListElement = document.getElementById("recommendations");
  const refreshButton = document.getElementById("refresh-recommendations");
  const showButton = document.getElementById("show-recommendations");

  if (recommendationsListElement) {
    const recommendationService = new BookRecommendationService();

    const displayRecommendations = () => {
      const recommendations = recommendationService.getLastRecommendations();
      recommendationsListElement.innerHTML = "";

      if (recommendations.length === 0) {
        recommendationsListElement.innerHTML =
          '<p class="no-recommendations">リコメンドされた本がありません。「更新する」を押して本を取得してください。</p>';
        return;
      }

      recommendations.forEach((book) => {
        const bookElement = document.createElement("li");
        bookElement.className = "recommendation-item";
        bookElement.innerHTML = `
                    <div class="book-card">
                        <h3>${book.title}</h3>
                        <p class="author">著者: ${book.author}</p>
                        <p class="genre">ジャンル: ${book.genre}</p>
                        <p class="reason">おすすめ理由: ${
                          book.reason || "同じジャンルの本を読んでいるため"
                        }</p>
                    </div>
                `;
        recommendationsListElement.appendChild(bookElement);
      });
    };

    const updateRecommendations = async () => {
      try {
        refreshButton.disabled = true;
        refreshButton.textContent = "更新中...";

        const recommendations =
          await recommendationService.generateRecommendations();
        displayRecommendations();
      } catch (error) {
        console.error("Error updating recommendations:", error);
        alert("リコメンデーションの更新中にエラーが発生しました");
      } finally {
        refreshButton.disabled = false;
        refreshButton.textContent = "更新する";
      }
    };

    if (refreshButton) {
      refreshButton.addEventListener("click", updateRecommendations);
    }

    if (showButton) {
      showButton.addEventListener("click", displayRecommendations);
    }

    // 初期表示
    displayRecommendations();
  }
});
