document.addEventListener('DOMContentLoaded', function() {
    let loginForm = document.querySelector("#loginForm");
    
    if (localStorage.getItem('isLoggedIn') === 'true') {
       
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let email = document.querySelector("#email").value.trim();
        let password = document.querySelector("#password").value;
        
        if (!email || !password) {
            showToast("Please enter both email and password", true);
            return;
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            showToast("Please enter a valid email address", true);
            return;
        }
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'index.html';
        } else {
            showToast('Invalid email or password', true);
        }
    });
    
    function showToast(text, isError = false) {
        Toastify({
            text: text,
            duration: 2000,
            gravity: "top",
            position: "right",
            style: {
                background: isError 
                    ? "linear-gradient(to right, #ff5f6d, #ffc371)" 
                    : "linear-gradient(to right, #00b09b, #96c93d)",
            },
        }).showToast();
    }
});