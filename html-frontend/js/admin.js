// API Base URL
const API_URL = 'http://127.0.0.1:3000/api/v1/products';

let editingProductId = null;

// Load products when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupFormSubmit();
});

// Load products from API
function loadProducts() {
    const container = document.getElementById('adminProductContainer');
    container.innerHTML = '<div class="loading">読み込み中...</div>';

    fetch(API_URL)
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
    const container = document.getElementById('adminProductContainer');
    
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="empty-state">製品が見つかりません</div>';
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
            <div class="product-right">
                <span class="product-price">
                    ${product.price ? product.price.toLocaleString() + ' 円' : '-'}
                </span>
                <div class="product-actions">
                    <button class="product-btn" onclick="editProduct(${product.id})">編集</button>
                    <button class="product-btn" onclick="deleteProduct(${product.id})">削除</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup form submit handler
function setupFormSubmit() {
    const form = document.getElementById('productForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        
        // Get form values
        const fields = ['name', 'description', 'author', 'release_year', 'price', 'genre', 'rating'];
        fields.forEach(field => {
            const value = document.getElementById(field).value;
            if (value) {
                formData.append(`product[${field}]`, value);
            }
        });

        // Add cover photo if selected
        const coverPhotoInput = document.getElementById('cover_photo');
        if (coverPhotoInput.files[0]) {
            formData.append('product[cover_photo]', coverPhotoInput.files[0]);
        }

        if (editingProductId) {
            updateProduct(formData);
        } else {
            createProduct(formData);
        }
    });
}

// Create new product
function createProduct(formData) {
    const token = localStorage.getItem('token') || 'fake-token'; // Use fake token for demo

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create product');
        }
        return response.json();
    })
    .then(() => {
        alert('製品を追加しました！');
        resetForm();
        loadProducts();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('製品の追加に失敗しました。ログインしていますか？');
    });
}

// Update existing product
function updateProduct(formData) {
    const token = localStorage.getItem('token') || 'fake-token';

    fetch(`${API_URL}/${editingProductId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update product');
        }
        return response.json();
    })
    .then(() => {
        alert('製品を更新しました！');
        resetForm();
        loadProducts();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('製品の更新に失敗しました');
    });
}

// Edit product
function editProduct(productId) {
    fetch(`${API_URL}/${productId}`)
        .then(response => response.json())
        .then(product => {
            // Fill form with product data
            document.getElementById('name').value = product.name || '';
            document.getElementById('description').value = product.description || '';
            document.getElementById('author').value = product.author || '';
            document.getElementById('release_year').value = product.release_year || '';
            document.getElementById('price').value = product.price || '';
            document.getElementById('genre').value = product.genre || '';
            document.getElementById('rating').value = product.rating || '';

            // Update form title and button
            document.getElementById('formTitle').textContent = '商品を編集';
            document.getElementById('submitButtonText').textContent = '更新';
            document.getElementById('cancelEditBtn').style.display = 'block';

            // Hiển thị thông báo edit và hiệu ứng
            document.getElementById('editNotice').style.display = 'block';
            document.getElementById('productForm').classList.add('edit-mode');

            editingProductId = productId;

            // Scroll to form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('製品の読み込みに失敗しました');
        });
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('本当にこの製品を削除しますか？')) {
        return;
    }

    const token = localStorage.getItem('token') || 'fake-token';

    fetch(`${API_URL}/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete product');
        }
        alert('製品を削除しました');
        loadProducts();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('製品の削除に失敗しました。ログインしていますか？');
    });
}

// Cancel edit mode
function cancelEdit() {
    resetForm();
}

// Reset form to create mode
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('formTitle').textContent = '新規商品を追加';
    document.getElementById('submitButtonText').textContent = '追加';
    document.getElementById('cancelEditBtn').style.display = 'none';
    document.getElementById('editNotice').style.display = 'none';
    document.getElementById('productForm').classList.remove('edit-mode');
    editingProductId = null;
}
