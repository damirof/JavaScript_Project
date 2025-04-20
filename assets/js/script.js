document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.getElementById('productsContainer');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const cartCount = document.querySelector('.cart-count');
    
    let products = [];
    let filteredProducts = [];

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function showToast(message) {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
        }).showToast();
    }

    function renderProducts() {
        productsContainer.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = '<p class="text-center py-5">No products found</p>';
            return;
        }

        filteredProducts.forEach(product => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card h-100 product-card">
                    ${product.discount ? `<span class="badge bg-danger position-absolute top-0 end-0 m-2">${product.discount}% OFF</span>` : ''}
                    <img src="assets/images/${product.images[0]}" class="card-img-top product-image" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="fw-bold">$${product.price.toFixed(2)}</span>
                                ${product.originalPrice ? `<small class="text-muted text-decoration-line-through ms-2">$${product.originalPrice.toFixed(2)}</small>` : ''}
                            </div>
                            <button class="btn btn-dark add-to-cart" data-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
            productsContainer.appendChild(col);
        });

        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
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
            });
        });
    }

    function handleSearch() {
        const term = searchInput.value.toLowerCase();
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(term) || 
            product.description.toLowerCase().includes(term)
        );
        renderProducts();
    }

    function handleSort() {
        const value = sortSelect.value;
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
    }

    async function loadProducts() {
        try {
            const response = await fetch('http://localhost:3001/products');
            products = await response.json();
            filteredProducts = [...products];
            renderProducts();
            updateCartCount();
        } catch (error) {
            console.error('Error loading products:', error);
            productsContainer.innerHTML = '<p class="text-danger text-center py-5">Failed to load products. Please try again later.</p>';
        }
    }

    searchInput.addEventListener('input', handleSearch);
    sortSelect.addEventListener('change', handleSort);
    
    loadProducts();
});