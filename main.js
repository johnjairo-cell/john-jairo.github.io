document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault();



    const $ROW = document.getElementById('row');
    const $FORM_NUEVO_P = document.getElementById('form_producto_nuevo');
    const $FORM_EDIT_P = document.getElementById('from_edit_producto');
    const $BTN_ELIMINAR = document.getElementById('btn_eliminar');
    let currentItemID = null;
    let clickTimer = null;

    // Leer ítems al cargar la página
    readItems();

    // Función para crear un ítem
    async function createItem(nombre, precio) {
        const response = await fetch('http://localhost:3000/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, precio })
        });

        if (response.ok) {
            const newItem = await response.json();
            displayItem(newItem);
        } else {
            console.error('Error al crear el ítem');
        }
    }

    // Función para leer ítems
    async function readItems() {
        const response = await fetch('http://localhost:3000/productos');

        if (response.ok) {
            const items = await response.json();
            displayItems(items);
        } else {
            console.error('Error al leer los ítems');
        }
    }

    // Función para actualizar un ítem
    async function updateItem(id, nombre, precio) {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, precio })
        });

        if (response.ok) {
            const updatedItem = await response.json();
            updateItemDisplay(updatedItem);
        } else {
            console.error('Error al actualizar el ítem');
        }
    }

    // Función para eliminar un ítem
    async function deleteItem(id) {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            removeItemDisplay(id);
        } else {
            console.error('Error al eliminar el ítem');
        }
    }

    // Función para mostrar todos los ítems
    function displayItems(items) {
        // itemsContainer.innerHTML = ''; // Limpiar contenedor

        items.forEach(item => {
            const card = createItemCard(item);
            $ROW.appendChild(card);
        });
    }

    // Función para crear una tarjeta para un ítem
    function createItemCard(item) {
        const card = document.createElement('div');
        card.className = 'col';
        card.dataset.id = item.id;

        card.innerHTML = `
            <div class="card text-center">
            <h6 class="card-header">${item.nombre}</h6>
            <div class="card-body">
                <h5 class="card-title">${item.id}</h5>
            </div>
            <h5 class="card-footer">${item.precio}</h5>
        </div>
        `;

        // Evento de click prolongado para mostrar el modal de editar/eliminar
        card.addEventListener('mousedown', (e) => {
            e.preventDefault();

            clickTimer = setTimeout(() => {
                currentItemID = item.id;
                document.getElementById('edit_id').value = item.id;
                document.getElementById('editItemNombre').value = item.nombre;
                document.getElementById('editItemPrecio').value = item.precio;
                $('#modalProductosE').modal('show');
            }, 700);
        });

        card.addEventListener('mouseup', (e) => {
            e.preventDefault();

            clearTimeout(clickTimer);
        });

        card.addEventListener('mouseleave', (e) => {
            e.preventDefault();

            clearTimeout(clickTimer);
        });

        return card;
    }

    // Función para mostrar un nuevo ítem
    function displayItem(item) {
        const card = createItemCard(item);
        $ROW.appendChild(card);
    }

    // Función para actualizar la tarjeta de un ítem
    function updateItemDisplay(item) {
        const card = document.querySelector(`.card[data-id='${item.id}']`);
        if (card) {
            card.querySelector('.card-title').textContent = item.nombre;
            card.querySelector('.card-text').textContent = `Precio: $${item.precio}`;
        }
    }

    // Función para eliminar la tarjeta de un ítem
    function removeItemDisplay(id) {
        const card = document.querySelector(`.card[data-id='${id}']`);
        if (card) {
            card.remove();
        }
    }

    // Evento de submit del formulario para crear ítem
    $FORM_NUEVO_P.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombre = document.getElementById('nombre_producto').value;
        const precio = document.getElementById('precio_producto').value;

        await createItem(nombre, precio);

        // $('#createModal').modal('hide');
        $FORM_NUEVO_P.reset();
    });

    // Evento de submit del formulario para editar ítem
    $FORM_EDIT_P.addEventListener('submit', async (event) => {
        event.preventDefault();

        const id = document.getElementById('edit_id').value;
        const nombre = document.getElementById('editItemNombre').value;
        const precio = document.getElementById('editItemPrecio').value;

        await updateItem(id, nombre, precio);

        $('#modalProductosE').modal('hide');
    });

    // Evento de click para eliminar ítem
    $BTN_ELIMINAR.addEventListener('click', async (e) => {
        e.preventDefault();
        if (currentItemID) {
            await deleteItem(currentItemID);
            $('#modalProductosE').modal('hide');
        }
    });


    
    const checkbox = document.getElementById("checkbox");
    const body = document.body;
    
    if (localStorage.getItem('theme') === 'dark') {
        body.setAttribute('data-bs-theme', 'dark');
    }
    checkbox.addEventListener("click", () => {
        if (body.hasAttribute('data-bs-theme')) {
            body.removeAttribute('data-bs-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-bs-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    })
});




