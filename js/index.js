// Importing static product list
import { products } from "./data.js";

// Getting html elements that will be manipulated
const productContainer = document.querySelector(".product-container");
const basketContainer = document.querySelector(".basket-container");
const modalContainer = document.querySelector(".modal-body")
let totalPrice = document.querySelector(".total-price");

// Rendering products in the main page
products.forEach((product) => {
  const { id, name, price, imgName } = product;
  let productCard = generateProductCard(id, name, price, imgName);
  productContainer.innerHTML += productCard;
});

let counter = parseInt(localStorage.getItem("counter")) || 0;
// Get all "product add" buttons and assign the functionality of adding them to the basket
// This code works only once per page load
document.querySelectorAll(".add-to-basket-btn").forEach((btn) => {
  btn.onclick = (e) => {
    let id = e.target.getAttribute("data-id");
    let basket = JSON.parse(localStorage.getItem("basket"));

    counter++;
    localStorage.setItem("counter", counter);
    if (basket == null) {
      localStorage.setItem("basket", JSON.stringify([{ id, count: 1 }]));

    } else {
      let existingItemIndex = basket.findIndex((x) => x.id == id);

      if (existingItemIndex !== -1) {
        basket[existingItemIndex].count++;

      } else {
        basket.push({ id, count: 1 });
      }

      localStorage.setItem("basket", JSON.stringify(basket));
    }


    renderBasketSection();
  };
});


// Rendering basket items once the page starts (code below works 1 time per page load)
renderBasketSection();

// Helper function for generating product card
function generateProductCard(id, name, price, imgName) {
  let productCard = `
  <div class="col card-container">
    <div class="card" style="width: 18rem">
            <img
              src="./images/${imgName}"
              class="card-img-top"
              alt="${name}"
            />
            <div class="card-body">
              <h5 class="card-title">${name}</h5>
              <p class="card-text">Price: <span class="price">${price.toFixed(
    2
  )}$</span></p>
              <button data-id=${id} class="add-to-basket-btn  btn btn-primary">Add to card</button>
            </div>
          </div>
        </div>
        </div>
    `;
  return productCard;
}

// Helper function for rendering basket section
function renderBasketSection() {
  document.querySelector("#counter").innerHTML = `Cart(${counter})`;
  // Get basket array from local storage if it exists, else - return from the function
  let basket = JSON.parse(localStorage.getItem("basket"));
  if (basket == null) {
    totalPrice.innerHTML = 0;
    return;
  }

  // Reset the content of basket container, so that duplicate basket items are avoided
  modalContainer.innerHTML = "";

  let total = 0;

  // Iterate through items in the basket that came from local storage and append them to basket container
  basket.forEach((x) => {
    // Find real product based on id that is stored in local storage
    let foundProduct = products.find((p) => p.id == x.id);
    if (foundProduct == null) return;
    // Calculate products total price
    total = parseFloat((total + x.count * foundProduct.price).toFixed(2));

    let basketItem = `<div class="basket-item">
    <div class="name">${foundProduct.name}</div>
    <div class="price">(${(foundProduct.price).toFixed(1)})</div>

    <div class="input-container">
     <button class="btn btn-secondary increase-btn" data-id=${x.id} onclick="increaseCount(${x.id})">+</button>
    
     <input type="number" class="count-input" id="countInput_${x.id}" value="${x.count}" min="0">
    
     <button class="btn btn-secondary decrease-btn" data-id=${x.id}  onclick="decreaseCount(${x.id})">-</button>
     </div>

     <button class="btn btn-danger delete-btn" data-id=${x.id}>X</button>
     
     <div class="total">${total}</div>
     `;

    // Append basket item to basket container
    modalContainer.innerHTML += basketItem;
  });

  // Append calculated basket value to total
  totalPrice.innerHTML = total;

  // Take all "increase" buttons of basket items and assign the functionality
  document.querySelectorAll(".increase-btn").forEach((btn) => {
    btn.onclick = (e) => {
      console.log("a");
      let id = e.target.getAttribute("data-id");
      let basket = JSON.parse(localStorage.getItem("basket"));
      let foundBasketItem = basket.find((x) => x.id == id);
      foundBasketItem.count++;
      localStorage.setItem("basket", JSON.stringify(basket));
      counter += 1;
      localStorage.setItem("counter", counter);
      renderBasketSection();
    };
  });

  // Take all "decrease" buttons of basket items and assign the functionality
  document.querySelectorAll(".decrease-btn").forEach((btn) => {
    btn.onclick = (e) => {
      let id = e.target.getAttribute("data-id");
      let basket = JSON.parse(localStorage.getItem("basket"));
      let foundBasketItem = basket.find((x) => x.id == id);
      if (foundBasketItem.count == 1) {

        let removedItem = basket.find((x) => x.id == id);

        counter -= removedItem.count;

        basket = basket.filter((x) => x.id != id);

        localStorage.setItem("basket", JSON.stringify(basket));
        localStorage.setItem("counter", counter);

        renderBasketSection();
        return;
      };
      foundBasketItem.count--;
      localStorage.setItem("basket", JSON.stringify(basket));
      counter -= 1;
      localStorage.setItem("counter", counter);
      renderBasketSection();
    };
  });

  // Take all "delete" buttons of basket items and assign the functionality
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.onclick = (e) => {
      let id = e.target.getAttribute("data-id");
      let basket = JSON.parse(localStorage.getItem("basket"));

      let removedItem = basket.find((x) => x.id == id);

      counter -= removedItem.count;

      basket = basket.filter((x) => x.id != id);

      localStorage.setItem("basket", JSON.stringify(basket));
      localStorage.setItem("counter", counter);

      renderBasketSection();
    };
  });

}

document.querySelector(".btn.btn-danger").addEventListener("click", () => {
  counter = 0;
  localStorage.setItem("counter", counter);
  localStorage.removeItem("basket");
  document.querySelector(".modal-body").innerHTML = "";
  renderBasketSection();
});
