import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProductList from "../../components/ProductList/ProductList";
import ProductForm from "../../components/ProductForm/ProductForm";
import "./admin.css";

function Admin() {
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const { logout, getAuthHeader, user } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = () => {
    fetch("http://localhost:3000/api/v1/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (productId) => {
    if (!window.confirm('本当にこの商品を削除しますか？')) {
      return;
    }

    fetch(`http://localhost:3000/api/v1/products/${productId}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeader(),
      },
    }).then((response) => {
      if (response.ok) {
        fetchProducts();
      } else {
        alert("商品の削除に失敗しました。");
      }
    });
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
  };

  const handleUpdate = (submissionData, productId) => {
    fetch(`http://localhost:3000/api/v1/products/${productId}`, {
      method: "PATCH",
      headers: {
        ...getAuthHeader(),
      },
      body: submissionData,
    }).then(() => {
      setProductToEdit(null);
      fetchProducts();
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">管理者用ページ (Admin)</h1>
        <div className="admin-user-info">
          {user && <span>ようこそ、{user.email}</span>}
          <button onClick={handleLogout} className="logout-btn">
            ログアウト
          </button>
        </div>
      </div>
      <div className="admin-card">
        <ProductForm
          onProductCreated={fetchProducts}
          productToEdit={productToEdit}
          onProductUpdated={handleUpdate}
        />
        <hr />
        <ProductList
          products={products}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
      <Link className="admin-link" to="/">ホームページに戻る</Link>
    </div>
  );
}

export default Admin;
