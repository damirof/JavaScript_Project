document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('#registerForm');
    const passwordInput = document.querySelector('#password');
    const confirmPasswordInput = document.querySelector('#confirmPassword');
    const termsCheck = document.querySelector('#termsCheck');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.querySelector('#fullName').value.trim();
        const email = document.querySelector('#email').value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        

        if (!fullName || !email || !password || !confirmPassword) {
            toastr.error('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            toastr.error('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            toastr.error('Password must be at least 6 characters');
            return;
        }
        
        if (!termsCheck.checked) {
            toastr.error('You must agree to the terms and conditions');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === email);
        
        if (userExists) {
            toastr.error('Email already registered');
            return;
        }
        
        const newUser = {
            id: Date.now(),
            name: fullName,
            email: email,
            password: password
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        toastr.success('Registration successful!');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
    
    confirmPasswordInput.addEventListener('input', function() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.style.borderColor = '#dc3545';
        } else {
            confirmPasswordInput.style.borderColor = '#ced4da';
        }
    });
});