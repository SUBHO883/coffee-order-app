const coffeeItems = [
{ id: 1, name: "Espresso", price: 250, image: "images/image.png" },
{ id: 2, name: "Cappuccino", price: 300, image: "Cappuccino.jpg" },
{ id: 3, name: "Honey Cinnamon Latte", price: 350, image: "images/honey-cinnamon-latte-featured-image.jpg" },
{ id: 4, name: "Americano", price: 300, image: "Americano.jpg" },
{ id: 5, name: "Mocha", price: 350, image: "images/Mocha.jpg" },
];

const grid = document.getElementById('coffee-grid');
const orderList = document.getElementById('order-list');
const totalPriceEl = document.getElementById('total-price');
const cartIcon = document.getElementById('cart-icon');
const clearOrderBtn = document.getElementById('clear-order');
const placeOrderBtn = document.getElementById('place-order');
const orderSummary = document.getElementById('order-summary');

let currentOrder = [];

function updateCartCount() {
cartIcon.setAttribute('data-count', currentOrder.length);
}

function renderCoffeeMenu() {
coffeeItems.forEach(coffee => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = coffee.image;
    img.alt = coffee.name;
    img.className = 'coffee-image';

    const name = document.createElement('h3');
    name.className = 'coffee-name';
    name.textContent = coffee.name;

    const price = document.createElement('p');
    price.className = 'coffee-price';
    price.textContent = `₹${coffee.price.toFixed(2)}`;

    const btn = document.createElement('button');
    btn.className = 'add-btn';
    btn.textContent = 'Add to Order';
    btn.onclick = () => {
    currentOrder.push(coffee);
    renderOrder();
    };

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(price);
    card.appendChild(btn);
    grid.appendChild(card);
});
}

function renderOrder() {
orderList.innerHTML = '';

if (currentOrder.length === 0) {
    orderList.innerHTML = '<li style="color: var(--color-text-secondary);">No items yet.</li>';
    totalPriceEl.textContent = '₹0.00';
    updateCartCount();
    return;
}

const counts = {};
currentOrder.forEach(item => {
    counts[item.id] = (counts[item.id] || 0) + 1;
});

for (const id in counts) {
    const item = coffeeItems.find(c => c.id === +id);

    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';

    const nameQty = document.createElement('span');
    nameQty.innerHTML = `<strong>${item.name}</strong> × ${counts[id]}`;

    const price = document.createElement('span');
    price.textContent = `₹${(item.price * counts[id]).toFixed(2)}`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'X';
    removeBtn.style.marginLeft = '10px';
    removeBtn.style.background = 'none';
    removeBtn.style.border = 'none';
    removeBtn.style.cursor = 'pointer';
    removeBtn.style.color = 'red';
    removeBtn.title = 'Remove this item';

    removeBtn.onclick = () => {
    const indexToRemove = currentOrder.findIndex(coffee => coffee.id === item.id);
    if (indexToRemove !== -1) {
        currentOrder.splice(indexToRemove, 1);
    }
    renderOrder();
    };

    const rightWrap = document.createElement('div');
    rightWrap.style.display = 'flex';
    rightWrap.style.alignItems = 'center';
    rightWrap.appendChild(price);
    rightWrap.appendChild(removeBtn);

    li.appendChild(nameQty);
    li.appendChild(rightWrap);

    orderList.appendChild(li);
}

const total = currentOrder.reduce((sum, item) => sum + item.price, 0);
totalPriceEl.textContent = `₹${total.toFixed(2)}`;
updateCartCount();
}

clearOrderBtn.onclick = () => {
currentOrder = [];
renderOrder();
};

cartIcon.addEventListener('click', () => {
orderSummary.classList.toggle('hidden');
});

placeOrderBtn.onclick = () => {
if (currentOrder.length === 0) {
    alert("⚠️ Please select at least one item before placing the order.");
    return;
}

document.getElementById("confirm-overlay").style.display = "flex";

document.getElementById("yes-proceed").onclick = () => {
    const total = currentOrder.reduce((sum, item) => sum + item.price, 0);
    localStorage.setItem("totalAmount", total.toFixed(2));
    localStorage.setItem("coffeeOrder", JSON.stringify(currentOrder));
    window.location.href = "payment.html";
};

document.getElementById("no-cancel").onclick = () => {
    document.getElementById("confirm-overlay").style.display = "none";
    currentOrder = [];
    renderOrder();
    alert("❌ Order cancelled. Please select items again.");
};
};

renderCoffeeMenu();
renderOrder();


