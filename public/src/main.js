import { fetchData, container, API } from "./products.js";
let shoppingCart = {};

let mail = document.getElementById('email');
let deskMenu = document.getElementById('menu-desktop');

let iconHamburguer = document.getElementById('hamburguer');
let mobileMenu = document.getElementById('menu-hamburguer');

let shoppingCard = document.getElementById('cart');
let detailProduct = document.querySelector('.shopping-details');
let arrowMenu = document.getElementById('arrow');
let orderContainer = document.getElementById('order');
let pago = document.querySelector('.order');
let items = document.getElementById('count');
let btnAddShopping = document.querySelector('.add-to-cart-button');
let pagarProductos = document.getElementById('pagar-productos');

let descriptionProduct = document.getElementById('description-product');
let imgProduct = document.getElementById('description-product-img');
let closeDetailProduct = document.getElementById('close');

function pagar(){
    window.location.href = "http://localhost:3000/compra.html";
}
function textEmail() {
    //si esta abierto el detalle de productos, mandarlo a cerrar para que no afecte la vista
    if (!detailProduct.classList.contains('inactive')) {
        detailProduct.classList.toggle('inactive');
    }
    // Si detalle de la card esta abierto, cerrarlo y abrir menu de email
    if (!closeDetailProduct.classList.contains('inactive')) {
        descriptionProduct.classList.add('inactive');
    }

    deskMenu.classList.toggle('inactive');
}
function cardIconShopping() {
    //si esta abierto el menu de email, mandarlo a cerrar para que no afecte la vista del aside
    if (!deskMenu.classList.contains('inactive')) {
        deskMenu.classList.toggle('inactive');
    }
    // Si detalle del prodcuto esta activo, cerrarlo y abrir las compras realizadas
    if (!closeDetailProduct.classList.contains('inactive')) {
        descriptionProduct.classList.add('inactive');
    }
    // si icono hamburguesa esta activo, cerrarlo y abrir las compras realizadas
    if (iconHamburguer.classList.contains('is-active')) {
        iconHamburguer.classList.remove('is-active');
        mobileMenu.classList.toggle('inactive');
    }
    detailProduct.classList.toggle('inactive');
}
function btnClose() {
    // si el menu de email esta abierto cerrarlo y abrir el detalle de la card
    if (!deskMenu.classList.contains('inactive')) {
        deskMenu.classList.toggle('inactive');
    }
    // si las compras realizadas estan abiertas, cerrarlo y abrir detalle de la card
    if (!detailProduct.classList.contains('inactive')) {
        detailProduct.classList.toggle('inactive');
    }

    descriptionProduct.classList.toggle('inactive');
}
function hamburguer() {
    iconHamburguer.classList.toggle('is-active');
    mobileMenu.classList.toggle('inactive');
}
function arrowClose() {
    detailProduct.classList.toggle('inactive');
}

mail.addEventListener('click', textEmail);
arrowMenu.addEventListener('click', arrowClose);
iconHamburguer.addEventListener('click', hamburguer);
shoppingCard.addEventListener('click', cardIconShopping);
closeDetailProduct.addEventListener('click', btnClose);
btnAddShopping.addEventListener('click', e => getItemsAside(e)); //comprar item desde aside
pagarProductos.addEventListener('click', e => pagar());//ir a la pagina para pagar los productos

// VER PRODUCTOS DE API
fetchData(`${API}`)
    .then(response => response.json())
    .then(productos => {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < productos.length; i++) {
            const productCard = document.createElement('DIV');
            productCard.classList.add('product-card');
            productCard.setAttribute('id', productos[i].id);

            const imgCard = document.createElement('IMG'); //CREANDO ETIQUETA IMG
            imgCard.setAttribute('src', productos[i].images[0]); //AGREGANDO EL SOURCE

            const productInfo = document.createElement('DIV'); //CREANDO ETIQUETA DIV
            productInfo.classList.add('product-info'); //AGREGAR UNA CLASE AL DIV

            productCard.append(imgCard, productInfo); // INSERTANDO EN DIV PADRE LOS ELEMENTOS QUE LLEVARA DENTRO DE EL

            const divText = document.createElement('DIV');
            productInfo.append(divText);

            const precio = document.createElement('P');
            precio.textContent = productos[i].price; //AGREGANDO CONTENIDO DENTRO DE LA ETIQUETA

            const nombre = document.createElement('P');
            nombre.textContent = productos[i].title;  //AGREGANDO CONTENIDO DENTRO DE LA ETIQUETA

            divText.append(precio, nombre);

            const figure = document.createElement('FIGURE');
            const icon = document.createElement('IMG');
            icon.setAttribute('src', 'imgs/icons/bt_add_to_cart.svg');
            icon.setAttribute('value', productos[i].id);

            // HACER CLICK EN UNA IMG DE CARDS
            imgCard.addEventListener('click', e => {
                showAsideDescription(e, productInfo, productCard, productos);
            });

            figure.append(icon);
            productInfo.append(figure);

            fragment.append(productCard);
            icon.addEventListener('click', e => agregarCompra(e));
        }

        container.append(fragment); //AGREGANDO TODOS LOS CARDS DENTRO DE UN CONTENEDOR

    })
    .catch(error => console.error(error)) // EN CASO DE ALGUN ERROR
    .finally(() => console.log('Finalizado')) //AL FINALIZAR SIN IMPORTAR SI HAY O NO ERROR

function showAsideDescription(e, productInfo, productCard, productos) {
    if (descriptionProduct.classList.contains('inactive')) {
        descriptionProduct.classList.toggle('inactive');
    }
    // COPIAR IMG DE CARD EN ASIDE
    imgProduct.setAttribute('src', e.target.src);

    // COPIAR LOS ELEMENTOS DE UN CARD AL ASIDE
    descriptionProduct.children[2].children[0].textContent = productInfo.children[0].children[0].textContent;
    descriptionProduct.children[2].children[1].textContent = productInfo.children[0].children[1].textContent;
    descriptionProduct.children[2].children[2].textContent = productos[productCard.getAttribute('id')].description;//traer la descripcion del producto
    descriptionProduct.children[2].children[3].setAttribute('value', productos[productCard.getAttribute('id')].id);//colocar id en el boton de compra del aside
}


function agregarCompra(e) {//seleccionar valores
    let id = e.target.getAttribute('value');
    let setCard = e.target.parentElement.parentElement.parentElement;
    addShopping(setCard, id);
}

function getItemsAside(e){//realiza misma accion que agregarCompra()
    const containerAside = e.target.parentElement.parentElement;
    console.log(containerAside);
    let id = containerAside.children[2].children[3].getAttribute('value');
    addShoppingAside(containerAside,id);
}

function addShoppingAside(data,id){//accion para comprar item desde aside
    const buy = {
        id: id,
        img: data.children[1].getAttribute('src'),
        price: data.children[2].children[0].textContent,
        title: data.children[2].children[1].textContent,
        quantity: 1,
    };

    if (shoppingCart.hasOwnProperty(buy.id)) {
        // console.log(shoppingCart[id].quantity);
        buy.quantity = shoppingCart[buy.id].quantity + 1;
    }
    addCountShopping();
    // Copiando objeto dentro del id (indexado) con spreed operator
    shoppingCart[buy.id] = { ...buy };
    showShopping(); //pintar compras en la orden
}

function addShopping(data, id) {
  const buy = {
    id: id,
    img: data.children[0].getAttribute('src'),
    price: data.children[1].children[0].children[0].textContent,
    title: data.children[1].children[0].children[1].textContent,
    quantity: 1,
  };

  if (shoppingCart.hasOwnProperty(buy.id)) {
    buy.quantity = shoppingCart[buy.id].quantity + 1;
    shoppingCart[buy.id].quantity = buy.quantity; // Actualizar la cantidad en shoppingCart
  } else {
    shoppingCart[buy.id] = { ...buy };
  }

  addCountShopping();
  showShopping();

  let guardarCompras = sessionStorage.getItem('misCompras');
  let productosComprados = [];
  if (guardarCompras) {
    productosComprados = JSON.parse(guardarCompras);
    const index = productosComprados.findIndex((product) => product.id === buy.id);
    if (index !== -1) {
      productosComprados[index].quantity = buy.quantity; // Actualizar la cantidad en productosComprados
    } else {
      productosComprados.push(buy);
    }
  } else {
    productosComprados.push(buy);
  }

  sessionStorage.setItem('misCompras', JSON.stringify(productosComprados));
}

function showShopping() { //mostrar los item comprados
    orderContainer.innerHTML = `<button class="primary-button" id="pagar-productos">
          Checkout
        </button>`;
    const fragmentoShopping = document.createDocumentFragment();
    Object.values(shoppingCart).forEach(producto => {

        const compra = document.createElement('DIV');
        compra.classList.add('shopping-cart');

        const figure = document.createElement('FIGURE');
        const imgShop = document.createElement('IMG');
        imgShop.setAttribute('src', producto.img);
        figure.appendChild(imgShop); //insertando dentro de figure

        const quantity = document.createElement('P');
        quantity.textContent = producto.quantity;

        const title = document.createElement('P');
        title.textContent = producto.title;

        const price = document.createElement('P');
        price.textContent = producto.price * producto.quantity;

        const close = document.createElement('IMG'); //boton de eliminar una compra del carrito
        close.setAttribute('src', 'imgs//icons/icon_close.png');
        close.classList.add('deleteBuy');
        close.setAttribute('id', producto.id);//agregar id para buscarlo en el objeto(en caso de eliminar item)

        // BORRAR ITEM DEL CARRITO (EN EL CONTADOR DEL ICONO Y DEL TOTAL)
        close.addEventListener('click', e => deleteItem(e));


        compra.append(figure, title, price, close); //insertarndo dentro del contenedor padre
        fragmentoShopping.append(compra);

    });
    totalShopping();
    // Insertar los productos para comprar antes del boton y total de la compra
    orderContainer.append(fragmentoShopping, orderContainer.children[0]);
    //console.log(orderContainer)
    let pagarProductos = document.getElementById('pagar-productos');
    pagarProductos.addEventListener('click', e => pagar());
}

function deleteItem(e) {
  const eliminarItem = shoppingCart[e.target.getAttribute('id')];
  const compras = sessionStorage.getItem('misCompras');

  if (compras) {
    let products = JSON.parse(compras);
    let findProduct = products.findIndex((product) => product.id == eliminarItem.id);

    if (findProduct !== -1) {
      eliminarItem.quantity--; // Disminuir la cantidad del producto eliminado
      removeCountShopping();

      if (eliminarItem.quantity === 0) {
        delete shoppingCart[e.target.getAttribute('id')];
        products.splice(findProduct, 1); // Eliminar el producto del array products
      } else {
        products[findProduct].quantity = eliminarItem.quantity; // Actualizar la cantidad del producto en products
      }

      sessionStorage.setItem('misCompras', JSON.stringify(products)); // Actualizar sessionStorage
    }
  }

  showShopping();
  e.stopPropagation();
}

function removeCountShopping() {
    items.textContent = `${items.textContent - 1}`;//actualizar numero de items comprados en el carrito (icono)
}

// MOSTRAR EL NUMERO DE ELEMENTOS COMPRADOS (SE MUESTRA EN EL ICONO DEL CARRITO DE COMPRAS)
function addCountShopping() {
    const countItems = Object.values(shoppingCart).reduce((acumulador, { quantity }) => acumulador + quantity, 1);
    // console.log(countItems);
    items.textContent = countItems;
}

function totalShopping() {
    // Para obtener el total de producos comprados
    const payment = Object.values(shoppingCart).reduce((acumulador, { quantity, price }) => acumulador + (quantity * price), 0);
    orderContainer.innerHTML += `<div class="order">
                                    <p>
                                        <span>Total</span>
                                    </p>
                                    <p>$ ${payment}</p>
                                </div>`;
}