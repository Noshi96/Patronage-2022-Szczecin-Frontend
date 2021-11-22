document.addEventListener('DOMContentLoaded', function() {
    get_all_pizzas();
});

function get_all_pizzas() {
    fetch('https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(pizza => {
                create_pizza_item(pizza);
            });
        });
}

function create_pizza_item(pizza) {

    const title = pizza.title;
    const price = pizza.price;
    const ingredients = pizza.ingredients;
    const image_url = pizza.image;

    let ingredients_string = "";
    ingredients.forEach(function(ingredient, index) {
        if (index != ingredients.length - 1) {
            ingredients_string += capitalize(ingredient) + ", ";
        } else {
            ingredients_string += capitalize(ingredient);
        }
    });

    const menu_item = document.createElement('div');
    menu_item.className = "menu-item";
    menu_item.innerHTML = `
    <img class="menu-item-image" src="${image_url}" alt="${title}">
    <div class="menu-item-text">
        <h3 class="menu-item-heading">
        <span class="menu-item-name">${title}</span>
        <span class="menu-item-price">${price} zł</span>
        </h3>
        <p class="menu-item-description">
        ${ingredients_string}
        </p>
        <button id="button-order" class="menu-item-button">Zamów</button>
        <div class="menu-item-separator"></div>
    </div>
  `;

    menu_item.querySelector('#button-order').addEventListener('click', () => {
        create_cart_item(title, price);
    });

    document.querySelector('#menu-group').append(menu_item);
}

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function create_cart_item(title, price) {

    let count = 1;
    let total_price_order = 0;
    const isPizzaExistInCart = !!document.getElementById(title.replaceAll(' ', '_'));

    if (isPizzaExistInCart) {
        const selector = `#${title.replaceAll(' ', '_')}`;

        count = parseFloat(document.querySelector(selector).querySelector('.cart-item-count').innerHTML);
        count++;
        document.querySelector(selector).querySelector('.cart-item-count').innerHTML = count;

        total_price_order = parseFloat(document.querySelector('.total-price-order').innerHTML) + parseFloat(price);
        document.querySelector('.total-price-order').innerHTML = total_price_order.toFixed(2) + " zł";

    } else {
        const cart_item = document.createElement('div');
        cart_item.className = "cart-item";
        cart_item.id = `${title.replaceAll(' ', '_')}`;
        cart_item.innerHTML = `
            <div class="cart-item-name">${title}</div>
            <div class="cart-item-price">${price}zł</div>
            <div class="cart-item-count">${count}</div>
            <button id="button-delete" class="cart-item-button">Usuń</button>
        `;

        cart_item.querySelector('#button-delete').addEventListener('click', () => {
            const selector = `#${title.replaceAll(' ', '_')}`;
            count = parseFloat(document.querySelector(selector).querySelector('.cart-item-count').innerHTML);

            subtract_from_the_total_price_order_and_delete_if_0(count, price, cart_item, selector);
        });

        add_to_the_total_price_order(price);

        document.querySelector('.cart-group').append(cart_item);
    }
}

function subtract_from_the_total_price_order_and_delete_if_0(count, price, cart_item, selector) {
    if (count === 1) {
        total_price_order = parseFloat(document.querySelector('.total-price-order').innerHTML) - parseFloat(price);
        set_text_for_total_price_order(total_price_order);

        cart_item.parentNode.removeChild(cart_item);

    } else {
        count--;
        document.querySelector(selector).querySelector('.cart-item-count').innerHTML = count;
        total_price_order = parseFloat(document.querySelector('.total-price-order').innerHTML) - parseFloat(price);
        set_text_for_total_price_order(total_price_order);
    }
}

function add_to_the_total_price_order(price) {
    let total_price_order = 0.00;
    if (document.querySelector('.total-price-order').innerHTML != "Głodny? Zamów naszą pizzę") {
        total_price_order = parseFloat(document.querySelector('.total-price-order').innerHTML) + parseFloat(price);
        document.querySelector('.total-price-order').innerHTML = total_price_order.toFixed(2) + " zł";
    } else {
        document.querySelector('.total-price-order').innerHTML = parseFloat(price).toFixed(2) + " zł";
    }
}

function set_text_for_total_price_order(total_price_order){
    if (total_price_order === 0.00) {
        document.querySelector('.total-price-order').innerHTML = "Głodny? Zamów naszą pizzę";
    } else {
        document.querySelector('.total-price-order').innerHTML = total_price_order.toFixed(2) + " zł";
    }
}