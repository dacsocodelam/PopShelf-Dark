import React from "react";
import { Link } from "react-router-dom";
import "./ProductList.css";

// Helper function: map product name to default image
const getDefaultImage = (productName) => {
  const imageMap = {
    'Mirai Note': '/images/tải xuống.png',
    '未来ノート (Mirai Note)': '/images/tải xuống.png',
    'The Great Gatsby': '/images/The Great Gatsby.jpg',
    'Inception': '/images/Inception.jpg',
    'The Legend of Zelda: Breath of the Wild': '/images/The Legend of Zelda - Breath of the Wild.jpg',
    'Atomic Habits': '/images/Atomic Habits.jpg',
    'Interstellar': '/images/Interstellar.jpg',
  };
  
  // Try to find exact match or partial match
  for (const [key, value] of Object.entries(imageMap)) {
    if (productName?.includes(key) || key.includes(productName)) {
      return value;
    }
  }
  
  // Default fallback
  return '/images/logo.png';
};

function ProductList({ products, onDelete, onEdit }) {
  return (
    <div className="product-list">
      <h2 className="product-list-title">製品一覧</h2>

      {products && products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => {
            const imageUrl = product.cover_photo_url || getDefaultImage(product.name);
            
            return (
              <div className="product-card" key={product.id}>
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getDefaultImage(product.name);
                  }}
                />

                <div className="product-card-info">
                  <Link to={`/products/${product.id}`} className="product-title">
                    {product.name}
                  </Link>
                  <span className="product-price">
                    {product.price ? product.price.toLocaleString() + " 円" : "-"}
                  </span>

                  {(onEdit || onDelete) && (
                    <div className="product-actions">
                      {onEdit && (
                        <button className="product-btn" onClick={() => onEdit(product)}>
                          編集
                        </button>
                      )}
                      {onDelete && (
                        <button className="product-btn" onClick={() => onDelete(product.id)}>
                          削除
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">商品が見つかりません。</div>
      )}
    </div>
  );
}

export default ProductList;