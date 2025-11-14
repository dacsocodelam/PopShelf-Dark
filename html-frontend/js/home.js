// API Base URL
const API_URL = 'http://127.0.0.1:3000/api/v1/products';

// Load products when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

// Load products from API
function loadProducts(keyword = '') {
    const container = document.getElementById('productContainer');
    container.innerHTML = '<div class="loading">読み込み中...</div>';

    let url = API_URL;
    if (keyword) {
        url += `?keyword=${encodeURIComponent(keyword)}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayProducts(data);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            container.innerHTML = '<div class="empty-state">製品の読み込みに失敗しました</div>';
        });
}

// Display products in the DOM
function displayProducts(products) {
    const container = document.getElementById('productContainer');
    if (!products || products.length === 0) {
        // Hiển thị sản phẩm mẫu nếu không có dữ liệu
        const demoProducts = [
            {
                id: 1,
                name: "The Great Gatsby",
                price: 15.99,
                cover_photo_url: "images/demo1.jpg"
            },
            {
                id: 2,
                name: "Inception",
                price: 19.99,
                cover_photo_url: "images/demo2.jpg"
            },
            {
                id: 3,
                name: "The Legend of Zelda: Breath of the Wild",
                price: 59.99,
                cover_photo_url: "images/demo3.jpg"
            }
        ];
        container.innerHTML = demoProducts.map(product => `
            <div class="product-item">
                <div class="product-info">
                    <img src="${product.cover_photo_url}" alt="${product.name}" class="product-image" />
                    <span class="product-title">${product.name}</span>
                </div>
                <span class="product-price">${product.price.toLocaleString()} 円</span>
            </div>
        `).join('');
        return;
    }
    container.innerHTML = products.map(product => `
        <div class="product-item">
            <div class="product-info">
                ${product.cover_photo_url ? 
                    `<img src="${product.cover_photo_url}" alt="${product.name}" class="product-image" />` 
                    : ''}
                <span class="product-title">${product.name}</span>
            </div>
            <span class="product-price">
                ${product.price ? product.price.toLocaleString() + ' 円' : '-'}
            </span>
        </div>
    `).join('');
}

// Search products
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const keyword = searchInput.value.trim();
    loadProducts(keyword);
}

// Allow search on Enter key
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
});
