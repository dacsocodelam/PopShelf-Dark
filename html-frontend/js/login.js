// Handle login form submission
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Hide previous error
    errorMessage.style.display = 'none';

    // For demo purposes - just redirect to admin without real authentication
    // In production, this would make a real API call
    
    // Simulate API call
    fetch('http://127.0.0.1:3000/api/v1/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            email: email, 
            password: password 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Save token to localStorage
            localStorage.setItem('token', data.token);
            
            // Redirect to admin page
            window.location.href = 'admin.html';
        } else {
            // Show error message
            errorMessage.textContent = data.error || 'パスワードが違います。';
            errorMessage.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        
        // For demo - just set a fake token and redirect
        localStorage.setItem('token', 'demo-token-12345');
        alert('デモモード: ログインしました！');
        window.location.href = 'admin.html';
    });
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        // User already logged in, redirect to admin
        const redirectToAdmin = confirm('すでにログインしています。管理者ページに移動しますか？');
        if (redirectToAdmin) {
            window.location.href = 'admin.html';
        }
    }
});
