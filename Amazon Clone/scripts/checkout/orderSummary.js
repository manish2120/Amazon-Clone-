import { products } from "../../data/products.js";
import { cart, removeItemFromCart, updateQuantity, updateDeliveryOption } from "../../data/cart.js";
import { calculateCartQuantity } from "../../data/cart.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions} from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";


export function renderOrderSummary() {
let cartSummaryHTML = '';
cart.forEach((cartItem) => {
  let matchingItem;
  products.forEach((product) => {
    if(cartItem.productId === product.id) {
      matchingItem = product;
    }
  })

  const deliveryOptionId = cartItem.deliveryOptionId;
  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if(option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
  const dateString = deliveryDate.format('dddd, MMMM D');

  cartSummaryHTML += `
  <div class="cart-item-container js-cart-item-container-${matchingItem.id}">
  <div class="delivery-date">
    Delivery Date: ${dateString}
  </div>

  <div class="cart-item-details-grid">
    <img class="product-image"
      src="${matchingItem.image}">

    <div class="cart-item-details">
      <div class="product-name">
        ${matchingItem.name}
      </div>
      <div class="product-price">
        $${matchingItem.price}
      </div>
      <div class="product-quantity">
        <span>
          Quantity: <span class="quantity-label js-quantity-label-${matchingItem.id}">${cartItem.quantity}</span>
        </span>
        <span class="update-quantity-link js-update-quantity-link link-primary" data-product-id="${matchingItem.id}">
          Update
        </span>

        <input type="text" class="input-update-quantity js-input-update-quantity"/>

        <span class="save-updated-quantity js-save-updated-quantity
        link-primary" data-product-id="${matchingItem.id}">Save</span>

        <span class="delete-quantity-link js-delete-link link-primary" data-product-id="${matchingItem.id}">
          Delete
        </span>
      </div>
    </div>

    <div class="delivery-options">
      <div class="delivery-options-title">
        Choose a delivery option:
      </div>
      ${deliveryOptionsHTML(matchingItem, cartItem)}
      </div>
  </div>
</div>
`;
})

function deliveryOptionsHTML(matchingItem, cartItem) {
  let html = '';
  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += 
    `
    <div class="delivery-option js-delivery-option" data-product-id="${matchingItem.id}"
    data-delivery-option-id="${deliveryOption.id}">
      <input type="radio" ${isChecked ? 'checked' : ''}
        class="delivery-option-input"
        name="delivery-option-${matchingItem.id}"
        >
      <div>
        <div class="delivery-option-date">
          ${dateString}
        </div>
        <div class="delivery-option-price">
         ${priceString} Shipping
        </div>
      </div>
    </div>`;
  })

  return html;
}

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    removeItemFromCart(productId);
    document.querySelector(`.js-cart-item-container-${productId}`).remove();
    updateCartQuantity();
    })
})

 function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();
  document.querySelector('.js-return-to-home-link')
    .innerHTML = `${cartQuantity} items`;
}

updateCartQuantity();

document.querySelectorAll('.js-update-quantity-link').forEach((link) => {
  link.addEventListener('click', () => {
   const productId = link.dataset.productId;
   const container = document.querySelector(`.js-cart-item-container-${productId}`);
   container.classList.add('is-editing-quantity');

  })
})
  document.querySelectorAll('.js-save-updated-quantity')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      const quantityInput = container.querySelector(
        `.js-input-update-quantity`
      );

      const newQuantity = Number(quantityInput.value);
      
      if(newQuantity < 0 && newQuantity >= 1000) {
        alert('Quantity must be at least 0 and less than 1000');
        //early return
        return;
      }
      
      container.classList.remove('is-editing-quantity');
      
      const quantityLabel = document.querySelector(
        `.js-quantity-label-${productId}`
      );
      quantityLabel.innerHTML = newQuantity;
      updateQuantity(productId, newQuantity);
      updateCartQuantity();
    });
  });

document.querySelectorAll('.js-delivery-option').forEach((element) => {
  element.addEventListener('click', () => {
    const {productId, deliveryOptionId} = element.dataset;
    updateDeliveryOption(productId, deliveryOptionId);
    renderOrderSummary();
  })
})
}

renderOrderSummary();