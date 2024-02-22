const socket = io();
socket.on("productos", (listaDeProductos) => {
    renderizarProductosAdmin(listaDeProductos);
    renderizarProductos(listaDeProductos);
});

async function renderizarProductos(productos) {
    const productosContainer = document.getElementById("productosContainer");

    if (productosContainer) {
        productosContainer.innerHTML = "";
        productos.forEach((producto) => {
            const productoDiv = document.createElement("div");

            productoDiv.innerHTML = `
            <div class="productCard">
            <h2>${producto.title}</h2>
            <p>${producto.description}</p>
            <p class="price">Precio: ${producto.price}</p>
            <p class="stock">Stock: ${producto.stock}</p>
            <p class="category">Category: ${producto.category}</p>
            </div>
          `;
            productosContainer.appendChild(productoDiv);
        });
    }
}

async function renderizarProductosAdmin(productos) {
    const productosContainer = document.getElementById("productosContainerAdmin");

    if (productosContainer) {
        productosContainer.innerHTML = "";
        productos.forEach((producto) => {
            const productoDiv = document.createElement("div");

            productoDiv.innerHTML = `
            <div class="productCard">
            <h2>${producto.title}</h2>
            <p>${producto.description}</p>
            <p class="price">Precio: ${producto.price}</p>
            <p class="stock">Stock: ${producto.stock}</p>
            <p class="category">Category: ${producto.category}</p>
            <button class="deleteBtn" data-product-id="${producto._id}">Delete</button>
            </div>
          `;
            productosContainer.appendChild(productoDiv);
        });

        const deleteButtons = document.querySelectorAll(".deleteBtn");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const productId = event.target.dataset.productId;
                deleteProduct(productId);
            });
        });
    }
}

async function deleteProduct(productId) {
    try {
        const response = await fetch(`/realtimeproducts/${productId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("Server Error:", errorDetails);
            return;
        }

        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error("Error sending the delete request:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("productForm");
    if (productForm) {
        productForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const price = parseFloat(document.getElementById("price").value);
            const stock = parseInt(document.getElementById("stock").value, 10);

            const thumbnailsString = document.getElementById("thumbnails").value;
            const thumbnailsArray = thumbnailsString
                .split(",")
                .map((thumbnail) => thumbnail.trim());

            const formData = {
                title: document.getElementById("title").value,
                description: document.getElementById("description").value,
                price: isNaN(price) ? 0 : price,
                code: document.getElementById("code").value,
                stock: isNaN(stock) ? 0 : stock,
                category: document.getElementById("category").value,
                thumbnails: thumbnailsArray,
            };

            console.log("FormData:", formData);

            try {
                const response = await fetch("/realtimeproducts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    const errorDetails = await response.json();
                    console.error("Server Error:", errorDetails);
                    return;
                }

                const result = await response.json();
                console.log(result.message);
            } catch (error) {
                console.error("Error sending the request:", error);
            }
        });
    }
});
