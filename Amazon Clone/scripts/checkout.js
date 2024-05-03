import { products } from "../data/products.js";
import { cart, removeItemFromCart, saveInLocalStorage } from "../data/cart.js";
import { calculateCartQuantity } from "../data/cart.js";


let cartSummaryHTML = '';
cart.forEach((cartItem) => {
  let matchingItem;
  products.forEach((product) => {
    if(cartItem.productId === product.id) {
      matchingItem = product;
    }
  })

  cartSummaryHTML += `
  <div class="cart-item-container js-cart-item-container-${matchingItem.id}">
  <div class="delivery-date">
    Delivery date: Tuesday, June 21
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
          Quantity: <span class="quantity-label js-quantity-label">2</span>
        </span>
        <span class="update-quantity-link js-update-quantity-link link-primary" data-product-id="${matchingItem.id}">
          Update
        </span>

        <input type="number" class="input-update-quantity js-input-update-quantity"/>

        <span class="save-updated-quantity js-save-updated-quantity
        link-primary">Save</span>

        <span class="delete-quantity-link js-delete-link link-primary" data-product-id="${matchingItem.id}">
          Delete
        </span>
      </div>
    </div>

    <div class="delivery-options">
      <div class="delivery-options-title">
        Choose a delivery option:
      </div>
      <div class="delivery-option">
        <input type="radio" checked
          class="delivery-option-input"
          name="delivery-option-${matchingItem.id}">
        <div>
          <div class="delivery-option-date">
            Tuesday, June 21
          </div>
          <div class="delivery-option-price">
            FREE Shipping
          </div>
        </div>
      </div>
      <div class="delivery-option">
        <input type="radio"
          class="delivery-option-input"
          name="delivery-option-${matchingItem.id}">
        <div>
          <div class="delivery-option-date">
            Wednesday, June 15
          </div>
          <div class="delivery-option-price">
            $4.99 - Shipping
          </div>
        </div>
      </div>
      <div class="delivery-option">
        <input type="radio"
          class="delivery-option-input"
          name="delivery-option-${matchingItem.id}">
        <div>
          <div class="delivery-option-date">
            Monday, June 13
          </div>
          <div class="delivery-option-price">
            $9.99 - Shipping
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;
})
document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    removeItemFromCart(productId);
    document.querySelector(`.js-cart-item-container-${productId}`).remove();
    updateCartQuantity();
    saveInLocalStorage();
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

   const saveQuantity = container.querySelector('.js-save-updated-quantity');
   saveQuantity.addEventListener('click', () => {
    let quantity = document.querySelector('.js-quantity-label');
    const newQuantity = container.querySelector('.js-input-updated-quantity').value;
    quantity.innerHTML = newQuantity;
    container.classList.remove('is-editing-quantity');
   })
  })
})

