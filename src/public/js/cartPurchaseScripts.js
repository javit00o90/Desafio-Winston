const purchaseButton = document.getElementById('purchaseBtn');
if (purchaseButton) {
    purchaseButton.addEventListener('click', async function () {
        const cartId = this.getAttribute('data-cart-id');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        };

        try {
            const response = await fetch(`/api/carts/${cartId}/purchase`, requestOptions);

            if (!response.ok) {
                throw new Error('Error fetching purchase');
            } else {
                const htmlContent = await response.text();
                document.open();
                document.write(htmlContent);
                document.close();
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    });
}

const clearCart = document.getElementById('clearCartBtn');
if (clearCart) {
    clearCart.addEventListener('click', async function () {
        
    const cartId = this.getAttribute('data-cart-id');
        try {
            const response = await fetch(`/api/carts/${cartId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                window.location.reload();
            } else {
                console.error('Error clearing cart:', response.statusText);
            }
        } catch (error) {
            console.error('Error clearing cart:', error.message);
        }
    });
}