document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector("#loginForm");
    
    if (localStorage.getItem('isLoggedIn') === 'true') {
        redirectToDashboard();
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        
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