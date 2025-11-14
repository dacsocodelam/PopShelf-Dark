import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./ProductForm.css";

function ProductForm({ onProductCreated, productToEdit, onProductUpdated }) {
  const { getAuthHeader } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    author: "",
    release_year: "",
    price: "",
    genre: "",
    rating: "",
  });
  const [coverPhoto, setCoverPhoto] = useState(null); // State for the image file

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
      setCoverPhoto(null); // Reset file input when editing
    } else {
      setFormData({
        name: "",
        description: "",
        author: "",
        release_year: "",
        price: "",
        genre: "",
        rating: "",
      });
    }
  }, [productToEdit]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    setCoverPhoto(event.target.files[0]); // Handle file selection
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Use FormData to send both text and file data
    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      // Append product data in the format Rails expects: product[key]
      submissionData.append(`product[${key}]`, formData[key]);
    });
    if (coverPhoto) {
      submissionData.append("product[cover_photo]", coverPhoto);
    }

    if (productToEdit) {
      // Edit mode - pass FormData to the parent component
      onProductUpdated(submissionData, productToEdit.id);
    } else {
      // Create mode
      const authHeaders = getAuthHeader();
      fetch("http://localhost:3000/api/v1/products", {
        method: "POST",
        headers: {
          // Do NOT set Content-Type, the browser will set it for FormData
          ...authHeaders,
        },
        body: submissionData, // Send FormData directly
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("商品の作成に失敗しました");
          }
          return response.json();
        })
        .then(() => {
          onProductCreated();
          setFormData({
            name: "",
            description: "",
            author: "",
            release_year: "",
            price: "",
            genre: "",
            rating: "",
          });
          setCoverPhoto(null);
          alert("商品が正常に作成されました！");
        })
        .catch((err) => alert(err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h3>{productToEdit ? "商品を編集" : "新規商品を追加"}</h3>

      <div>
        <label>商品名:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="例: 君の名は"
        />
      </div>

      <div>
        <label>説明:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="商品の説明を入力してください"
        />
      </div>

      <div>
        <label>著者:</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleInputChange}
          placeholder="著者名"
        />
      </div>

      <div>
        <label>発売年:</label>
        <input
          type="number"
          name="release_year"
          value={formData.release_year}
          onChange={handleInputChange}
          placeholder="例: 2024"
        />
      </div>

      <div>
        <label>価格 (円):</label>
        <input
          type="number"
          step="0.01"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          required
          placeholder="価格を入力してください"
        />
      </div>

      <div>
        <label>ジャンル:</label>
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleInputChange}
          placeholder="ジャンル"
        />
      </div>

      <div>
        <label>評価 (1-5⭐):</label>
        <input
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleInputChange}
          placeholder="評価"
        />
      </div>

      <div>
        <label htmlFor="cover-photo-input" style={{ fontWeight: "600", color: "#3f2b96" }}>カバー写真:</label>
        <label className="custom-file-label" htmlFor="cover-photo-input">
          ファイルを選択
          <input
            id="cover-photo-input"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
        {coverPhoto && <span className="file-name">{coverPhoto.name}</span>}
      </div>

      <button type="submit">{productToEdit ? "更新" : "商品を追加"}</button>
    </form>
  );
}

export default ProductForm;
