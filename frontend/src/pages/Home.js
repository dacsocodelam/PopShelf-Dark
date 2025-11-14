import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProductList from "../components/ProductList/ProductList";
import "./home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Modified function to accept a search keyword
  const fetchProducts = (keyword = "") => {
    setIsSearching(!!keyword);
    setIsLoading(true);
    let url = "http://localhost:3000/api/v1/products";
    if (keyword) {
      url += `?keyword=${keyword}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
        setIsSearching(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
        setIsSearching(false);
      });
  };

  // Initial fetch when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handler for the search button click
  const handleSearch = () => {
    fetchProducts(searchTerm);
  };

  // Handler for Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handler for logout
  const handleLogout = () => {
    logout();
    alert("ログアウトしました");
  };

  return (
    <div className="home-container">
      {/* Header (match html-frontend/index.html) */}
      <header className="main-header">
        <div className="header-content">
          <img
            src="/images/logo.png"
            alt="PopShelf Logo"
            className="logo"
            style={{ height: 48, verticalAlign: 'middle' }}
            onError={(e) => { e.target.onerror = null; e.target.src = '/images/logo.png'; }}
          />
          <span className="shop-title">PopShelf</span>
          <nav className="main-nav">
            <a href="/" className="nav-link active">ホーム</a>
            {isAuthenticated() ? (
              <>
                <a href="/admin" className="nav-link">管理</a>
                <button onClick={handleLogout} className="nav-link nav-link-button">ログアウト</button>
              </>
            ) : (
              <a href="/login" className="nav-link">ログイン</a>
            )}
          </nav>
        </div>
      </header>

      {/* Intro section (static content from html-frontend/index.html) */}
      <section className="intro-section">
        <h1 className="intro-title">PopShelfへようこそ！</h1>
        <p className="intro-desc">注目の商品、本、映画、ゲームなどを発見しましょう。検索、詳細表示、商品管理も簡単です。PopShelfで現代的なショッピング体験を始めましょう！</p>
      </section>

      <div className="home-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="製品を検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button" disabled={isSearching}>
            {isSearching ? (
              <span className="search-loading">🔍</span>
            ) : (
              "検索"
            )}
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">読み込み中...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="no-results">
            <span className="no-results-icon">📦</span>
            <p className="no-results-text">商品が見つかりませんでした</p>
            {searchTerm && (
              <button onClick={() => { setSearchTerm(""); fetchProducts(); }} className="reset-search">
                すべての商品を表示
              </button>
            )}
          </div>
        ) : (
          <ProductList products={products} />
        )}
      </div>      {/* Footer 31-33 trỏ handleSearch*/}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-info">
            <strong>PopShelf</strong> &copy; 2025<br />
            住所: 奥出雲横田<br />
            メール: <a href="mailto:vnd22darkhorse@popshelf.com">vnd22darkhorse@popshelf.com</a>
          </div>
          <div className="footer-credit">
            Designed by vongocDARK
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;