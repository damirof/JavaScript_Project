document.addEventListener('DOMContentLoaded', function() {
    let registerForm = document.querySelector('#registerForm');
    let passwordInput = document.querySelector('#password');
    let confirmPasswordInput = document.querySelector('#confirmPassword');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let fullName = document.querySelector('#fullName').value.trim();
        let email = document.querySelector('#email').value.trim();
        let password = passwordInput.value;
        let confirmPassword = confirmPasswordInput.value;
        let termsCheck = document.querySelector('#termsCheck').checked;

        if (!fullName || !email || !password || !confirmPassword) {
            showToast('Please fill in all fields', true);
            return;
        }
        
        if (password !== confirmPassword) {
            showToast('Passwords do not match', true);
            return;
        }
        
        if (password.length < 6) {
            showToast('Password must be at least 6 characters', true);
            return;
        }
        
        if (!termsCheck) {
            showToast('You must agree to the terms and conditions ', true);
            return;
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            showToast('Please enter a valid email address', true);
            return;
        }
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let userExists = users.some(user => user.email === email);
        
        if (userExists) {
            showToast('Email already registered', true);
            return;
        }
        
        let newUser = {
            id: Date.now(),
            name: fullName,
            email: email,
            password: password
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        showToast("Registration successful!");
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
    
    function showToast(text, isError = false) {
        Toastify({
            text: text,
            duration: 1500,
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