document.addEventListener('DOMContentLoaded', function() {
    let productsContainer = document.getElementById('productsContainer');
    let searchInput = document.getElementById('searchInput');
    let sortSelect = document.getElementById('sortSelect');
    let cartCount = document.querySelector('.cart-count');
    
    let products = [];
    let filteredProducts = [];

    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
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
            let col = document.createElement('div');
            col.className = 'col-md-4 mb-4';

            let card = document.createElement('div');
            card.className = 'card h-100 product-card';

            if (product.tag) {
                let tagBadge = document.createElement('span');
                tagBadge.className = 'badge bg-danger position-absolute top-0 end-0 m-2';
                tagBadge.textContent = product.tag;
                card.appendChild(tagBadge);
            }

            let img = document.createElement('img');
            img.className = 'card-img-top product-image';
            img.src = product.image;
            img.alt = product.name;
            card.appendChild(img);

            let cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            let title = document.createElement('h5');
            title.className = 'card-title';
            title.textContent = product.name;
            cardBody.appendChild(title);

            let description = document.createElement('p');
            description.className = 'card-text';
            description.textContent = product.description;
            cardBody.appendChild(description);

            let priceContainer = document.createElement('div');
        

            let priceDiv = document.createElement('div');
            let currentPrice = document.createElement('span');
            currentPrice.className = 'fw-bold';
            currentPrice.textContent = `$${product.price.toFixed(2)}`;
            priceDiv.appendChild(currentPrice);

            if (product.originalPrice) {
                let originalPrice = document.createElement('small');
                originalPrice.className = 'text-muted text-decoration-line-through ms-2';
                originalPrice.textContent = `$${product.originalPrice.toFixed(2)}`;
                priceDiv.appendChild(originalPrice);
            }

            priceContainer.appendChild(priceDiv);

            let addToCartBtn = document.createElement('button');
            addToCartBtn.className = 'btn btn-dark add-to-cart';
            addToCartBtn.textContent = 'Add to Cart';
            addToCartBtn.dataset.id = product.id;
            priceContainer.appendChild(addToCartBtn);

            cardBody.appendChild(priceContainer);
            card.appendChild(cardBody);
            col.appendChild(card);
            productsContainer.appendChild(col);

            addToCartBtn.addEventListener('click', function() {
                let productId = parseInt(this.dataset.id);
                let product = products.find(p => p.id === productId);
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                let existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: productId,
                        name: product.name,
                        price: product.price,
                        image: product.image,
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
        let term = searchInput.value.toLowerCase();
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(term) || 
            product.description.toLowerCase().includes(term)
        );
        renderProducts();
    }

    function handleSort() {
        let value = sortSelect.value;
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
            let response = await fetch('http://localhost:3001/products');
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