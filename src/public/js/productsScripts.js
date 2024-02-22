document.addEventListener('DOMContentLoaded', async function () {
    const cartId = window.cartId;

    const addToCartBtns = document.querySelectorAll('.addToCartBtn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            addToCart(cartId, productId);
        });
    });

    const goToCartBtn = document.getElementById('goToCartBtn');
    if (goToCartBtn) {
        goToCartBtn.addEventListener('click', function () {
            window.location.href = `/carts/${cartId}`;
        });
    }

    async function addToCart(cartId, productId) {
        try {
            const productInfoResponse = await fetch(`/api/products/${productId}`);
            const productInfo = await productInfoResponse.json();

            if (productInfo.stock === 0) {
                alert('Product out of stock.');
                return;
            }

            const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (response.ok) {
                alert('Product added to Cart');
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error adding Product to Cart:', error);
            alert('Error adding Product to Cart');
        }
    }
});