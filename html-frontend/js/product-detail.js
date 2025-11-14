// Danh sách sản phẩm mẫu (id phải trùng với index.html)
const demoProducts = [
  {
    id: 1,
    name: "未来ノート (Mirai Note)",
  description: "毎日メモを取り、計画を立て、目標を追跡できるスマートノートです。",
    author: "田中 太郎 (Tanaka Tarou)",
    release_year: 2025,
    price: 1980,
  genre: "文房具 (ステーショナリー)",
    rating: "4.5 / 5",
    cover_photo_url: "images/mirai_note_cover.jpg"
  },
  {
    id: 2,
    name: "The Great Gatsby",
  description: "F・スコット・フィッツジェラルドによるアメリカンドリームについての古典的小説。",
    author: "F. Scott Fitzgerald",
    release_year: 1925,
    price: 1599,
  genre: "文学",
    rating: "4.7 / 5",
    cover_photo_url: "images/demo1.jpg"
  },
  {
    id: 3,
    name: "Inception",
  description: "夢の中の夢を描いたSF映画。",
    author: "Christopher Nolan",
    release_year: 2010,
    price: 1999,
  genre: "映画",
    rating: "4.8 / 5",
    cover_photo_url: "images/demo2.jpg"
  },
  {
    id: 4,
    name: "The Legend of Zelda: Breath of the Wild",
  description: "任天堂の有名なアクションアドベンチャーゲーム。",
    author: "Nintendo",
    release_year: 2017,
    price: 5999,
  genre: "ゲーム",
    rating: "4.9 / 5",
    cover_photo_url: "images/demo3.jpg"
  },
  {
    id: 5,
    name: "Atomic Habits",
  description: "良い習慣を作り、人生を変えるための本。",
    author: "James Clear",
    release_year: 2018,
    price: 1250,
  genre: "自己啓発",
    rating: "4.6 / 5",
    cover_photo_url: "images/demo4.jpg"
  },
  {
    id: 6,
    name: "Interstellar",
  description: "宇宙と時間旅行をテーマにしたSF映画。",
    author: "Christopher Nolan",
    release_year: 2014,
    price: 2100,
    genre: "Phim",
    rating: "4.8 / 5",
    cover_photo_url: "images/demo5.jpg"
  }
];


function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'), 10);
}

function showProductDetail(product) {
  document.getElementById('detailTitle').textContent = product.name;
  document.getElementById('detailName').textContent = product.name;
  document.getElementById('detailDesc').textContent = product.description;
  document.getElementById('detailAuthor').textContent = product.author;
  document.getElementById('detailYear').textContent = product.release_year;
  document.getElementById('detailPrice').textContent = product.price;
  document.getElementById('detailGenre').textContent = product.genre;
  document.getElementById('detailRating').textContent = product.rating;
  document.getElementById('detailCover').src = product.cover_photo_url;
  document.getElementById('detailCover').alt = product.name;
}

document.addEventListener('DOMContentLoaded', () => {
  const id = getProductIdFromUrl();
  const product = demoProducts.find(p => p.id === id) || demoProducts[0];
  showProductDetail(product);
});
