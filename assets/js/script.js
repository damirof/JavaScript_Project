document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.querySelector('#productsContainer');
    const searchInput = document.querySelector('#searchInput');
    const sortSelect = document.querySelector('#sortSelect');
    const cartCount = document.querySelector('.cart-count');
    const toast = document.querySelector('#toast');

    let products = [];
    let filteredProducts = [];

    fetch('http://localhost:3001/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            filteredProducts = [...products];
            renderProducts();
            updateCartCount();
        });

    function renderProducts() {
    

            productsContainer.innerHTML = '';
            
            if (filteredProducts.length === 0) {
                productsContainer.innerHTML = '<p>No products found</p>';
                return;
            }
    
            filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
         
            const productBadgeNew = document.createElement('div');
            productBadgeNew.className = 'product-badge';
            productBadgeNew.textContent = 'New';
            productCard.appendChild(productBadgeNew);

            const productBadgeDiscount = document.createElement('div');
            productBadgeDiscount.className = 'product-badge';
            productBadgeDiscount.textContent = `${product.discount}%`;
            productCard.appendChild(productBadgeDiscount);

            const productImage = document.createElement('img');
            productImage.src = `assets/images/${product.images[0]}`;
            productCard.appendChild(productImage);

            const productName = document.createElement('h3');
            productName.textContent = product.name;
            productCard.appendChild(productName);

            const productDescription = document.createElement('p');
            productDescription.textContent = product.description;
            productCard.appendChild(productDescription);

            const productPrice = document.createElement('div');
            productPrice.className = 'product-price';
            productPrice.innerHTML = `
                $${product.price.toFixed(2)}
                <span class="original-price">From $${product.originalPrice.toFixed(2)}</span>
            `;
            productCard.appendChild(productPrice);

            const addToCartButton = document.createElement('button');
            addToCartButton.className = 'add-to-cart';
            addToCartButton.dataset.id = product.id;
            addToCartButton.textContent = 'Add to cart';
            productCard.appendChild(addToCartButton);

            productsContainer.appendChild(productCard);
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    function addToCart(e) {
        const productId = parseInt(e.target.dataset.id);
        const product = products.find(p => p.id === productId);

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showToast(`${product.name} added to cart`);
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = total;
    }

    function showToast(message) {
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
        renderProducts();
    });

    sortSelect.addEventListener('change', function() {
        const value = this.value;
        
        switch(value) {
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            default:
                filteredProducts = [...products];
        }
        
        renderProducts();
    });
});