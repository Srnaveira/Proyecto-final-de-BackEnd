const socket = io();

// Escuchar el evento cuando se hace clic en el botón "Agregar"

document.addEventListener('DOMContentLoaded', () => {
    fetch('/user')
        .then(response => response.json())
        .then(user => {
            // Ahora tienes el objeto user disponible aquí
            const buttons = document.querySelectorAll('[id^="button_add_"]');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const productId = button.getAttribute('id').replace('button_add_', '');
                    const CartId = user.cartId;
                    const productInfo = {
                        _id: productId,
                        cartId: CartId
                    };
                    socket.emit('add_Product_cart', productInfo);
                });
            });
        })
        .catch(error => console.error('Error fetching user:', error));
});


socket.on('productAdded', (message) =>{
    console.log(message)
})