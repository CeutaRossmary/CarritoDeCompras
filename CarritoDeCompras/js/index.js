const cuentaCarritoElement = document.getElementById("cuenta-carrito");
const contenedorTarjetas = document.getElementById("productos-container");
const contenedorTotales = document.getElementById("productos-totales");
const ListaProductos = productos;
const ListaCarrito = [];

// Función para actualizar el conteo del carrito
function actualizarConteoCarrito() {
  const totalCantidad = ListaCarrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );
  cuentaCarritoElement.textContent = totalCantidad;
}

// Función para agregar productos al carrito
function agregarAlCarrito(id, nombre, precio, img, cantidad) {
  let productoEncontrado = false;
  for (let i = 0; i < ListaCarrito.length; i++) {
    if (ListaCarrito[i].id === id) {
      ListaCarrito[i].cantidad += cantidad;
      crearTarjetasProductosCarrito();
      productoEncontrado = true;
      break;
    }
  }
  if (!productoEncontrado) {
    ListaCarrito.push({ id, nombre, precio, img, cantidad });
  }

  //crearTarjetasProductosCarrito();
  actualizarConteoCarrito();
}

function descontarAlCarrito(id, nombre, precio, img, cantidad) {
  let productoEncontrado = false;

  for (let i = 0; i < ListaCarrito.length; i++) {
    if (ListaCarrito[i].id === id) {
      ListaCarrito[i].cantidad -= cantidad;

      // Eliminar producto si la cantidad es cero o menor
      if (ListaCarrito[i].cantidad <= 0) {
        ListaCarrito.splice(i, 1);
        break;
      }
      productoEncontrado = true;
      break;
    }
  }

  // Actualiza la vista del carrito y el conteo después del bucle
  crearTarjetasProductosCarrito();
  actualizarConteoCarrito();
}

// Función para crear tarjetas de productos en el inicio
function crearTarjetasProductosInicio() {
  contenedorTarjetas.innerHTML = "";
  ListaProductos.forEach((producto) => {
    const nuevoProducto = document.createElement("div");
    nuevoProducto.classList.add("tarjeta-producto");
    nuevoProducto.innerHTML = `

<div class="card shadow p-3 mb-5 bg-body rounded" style="width: 18rem;">
<img class="card-img-top" src="${producto.img}" alt="${producto.nombre}">
<h5>${producto.nombre}</h5>
<p class="card-text precio">$ ${new Intl.NumberFormat().format(
      producto.precio
    )}</p>
<button class="btn btn-primary">Agregar al carrito</button>

</div>`;
    contenedorTarjetas.appendChild(nuevoProducto);
    nuevoProducto
      .querySelector("button")
      .addEventListener("click", () =>
        agregarAlCarrito(
          producto.id,
          producto.nombre,
          producto.precio,
          producto.img,
          1
        )
      );
  });
}
crearTarjetasProductosInicio();

// Función para crear las tarjetas del carrito
function crearTarjetasProductosCarrito() {
  contenedorTarjetas.innerHTML = "";
  let contenido = "<h4 class='text'>Tu compra</h4>";
  contenido += '<table class="table table-hover  w-75 tarjeta-compras">';
  contenido += "<tbody class='align-baseline fw-medium productos-totales'>";
  let totalCarrito = 0;
  let cantidadProducto = 0;
  ListaCarrito.forEach((producto, i) => {
    const importe = producto.precio * producto.cantidad;
    totalCarrito += importe; // Acumulamos el total
    cantidadProducto += producto.cantidad;
 
    contenido += "<tr>";
    contenido += `<td><img src="${producto.img}" style="width: 150px; height: 150px;"></td>`;
    contenido += `<td>${producto.nombre}</td>`;
    contenido += `<td>$${new Intl.NumberFormat().format(producto.precio)}</td>`;
    contenido += `<td><i class="bi bi-dash-square" onclick="descontarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio}, '${producto.img}', 1)"> </i> ${producto.cantidad}<i class="bi bi-plus-square" onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio}, '${producto.img}', 1)"></i></td>`;
    contenido += `<td>$${new Intl.NumberFormat().format(importe)}</td>`;
    contenido += `<td><i id="btnEliminar${i}" class="bi bi-trash"></i></td>`;
    contenido += "</tr>";
  });

  contenido += "</tbody>";
  contenido += "</table>";
  contenido += `<td><h4 class='text2'>Resumen de compras</h4></td>`;
  contenido += "<div class= totales ${cantidadProducto})>";
  contenido += '<table class="table table-borderless">';
  contenido += '<tbody class="align-baseline fw-medium">';
  contenido += "<tr>";
  contenido += `<td><strong>Total de productos </strong>(${cantidadProducto})</td>`;
  contenido += "</tr>";
  contenido += "<tr>";
  contenido += `<td class="p-5"><strong>Total de la compra:</strong></td><td>$${new Intl.NumberFormat().format(
    totalCarrito
  )}</td>`;
  contenido += "</tr>";
  contenido += `<td class="position-relative"><button type="button" class="btn btn-secondary position-absolute top-50 start-50 translate-middle">Continuar compra</button></td>`;
  contenido += "</body>";
  contenido += "</table>";

  contenido += "</div>";

  contenedorTarjetas.innerHTML = contenido;

  ListaCarrito.forEach((producto, i) => {
    document.getElementById(`btnEliminar${i}`).addEventListener("click", () => {
      eliminarDelCarrito(i);
    });
  });
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(index) {
  ListaCarrito.splice(index, 1);
  crearTarjetasProductosCarrito();
  actualizarConteoCarrito();
}
