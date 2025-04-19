document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (localStorage.getItem('isLoggedIn') === 'true') {
        redirectToDashboard();
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            toastr.error('Please enter both email and password');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));
            redirectToDashboard();
        } else {
            toastr.error('Invalid email or password');
        }
    });
    
    function redirectToDashboard() {
        window.location.href = 'dashboard.html';
    }
});