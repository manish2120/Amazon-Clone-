export let cart = JSON.parse(localStorage.getItem("cart"));

if (!cart) {
  cart = [];
}

export function saveInLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });

  const quantitySelector = document.querySelector(
    `.js-quantity-selector-${productId}`
  );
  let quantity = Number(quantitySelector.value);

  //if matching item exists
  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity: quantity,
    });
  }
  saveInLocalStorage();
}

export function removeItemFromCart(productId) {
  const newCart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      let quantity = document.querySelector(`.js-quantity-label-${productId}`);
      quantity.innerHTML = calculateCartQuantity();
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  saveInLocalStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity = newQuantity;

  saveInLocalStorage();
}