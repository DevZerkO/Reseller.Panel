document.addEventListener('DOMContentLoaded', () => {
    // --- Global Data Store (Simulated Backend) ---
    // IMPORTANT: In a real application, this data would be stored securely in a database
    // and accessed via a server-side API, not directly in client-side localStorage.
    // This setup is for demonstration within the Canvas environment only.
    let dataStore = {
        users: [],
        products: []
    };

    const ADMIN_USERNAME = 'sylixadmin';
    // In a real application, the admin password would be securely hashed and stored
    // in a backend database, and authentication would be handled server-side.
    // For this client-side demo, 'sylixadmin' with any password will grant admin access.

    // --- DOM Elements ---
    const loginContainer = document.getElementById('login-container');
    const mainPanel = document.getElementById('main-panel');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loggedInUsernameDisplay = document.getElementById('logged-in-username');
    const userRoleDisplay = document.getElementById('user-role');
    const contentArea = document.getElementById('content-area');

    const navLinks = document.querySelectorAll('.nav-link');

    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const messageCloseBtn = document.getElementById('message-close-btn');

    // --- Utility Functions ---

    // Function to display custom messages
    const showMessage = (message) => {
        messageText.textContent = message;
        messageBox.classList.remove('hidden');
    };

    // Function to hide custom message box
    messageCloseBtn.addEventListener('click', () => {
        messageBox.classList.add('hidden');
    });

    // Functions to load and save data from/to Local Storage
    // This is for persistence in Canvas, but is NOT secure for sensitive data in production.
    const loadDataFromLocalStorage = () => {
        const storedUsers = localStorage.getItem('users');
        const storedProducts = localStorage.getItem('products');
        if (storedUsers) {
            dataStore.users = JSON.parse(storedUsers);
        }
        if (storedProducts) {
            dataStore.products = JSON.parse(storedProducts);
        }
    };

    const saveDataToLocalStorage = () => {
        localStorage.setItem('users', JSON.stringify(dataStore.users));
        localStorage.setItem('products', JSON.stringify(dataStore.products));
    };

    // Remember Me Logic (only for username/email)
    const rememberedEmailKey = 'rememberedEmail';

    const saveRememberedEmail = (email) => {
        localStorage.setItem(rememberedEmailKey, email);
    };

    const getRememberedEmail = () => {
        return localStorage.getItem(rememberedEmailKey);
    };

    // --- Page Rendering Functions ---

    const renderDashboardPage = () => {
        contentArea.innerHTML = `
            <div class="content-page">
                <h1 class="text-3xl font-bold text-white mb-6">Dashboard</h1>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 flex-shrink-0">
                    <!-- Discount Card -->
                    <div class="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
                        <p class="text-gray-400 text-sm">Discount</p>
                        <p class="text-white text-3xl font-bold">50 %</p>
                    </div>
                    <!-- Account Type Card -->
                    <div class="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
                        <p class="text-gray-400 text-sm">Account Type</p>
                        <p class="text-white text-3xl font-bold" id="dashboard-account-type-display">User</p>
                    </div>
                    <!-- Your Wallet Card -->
                    <div class="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
                        <p class="text-gray-400 text-sm">Your Wallet</p>
                        <p class="text-white text-3xl font-bold" id="dashboard-wallet-balance">$0.00</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                    <!-- Graph Placeholder (left, takes 2/3 width on large screens) -->
                    <div class="bg-gray-700 p-6 rounded-lg shadow-md col-span-1 lg:col-span-2 flex flex-col flex-grow">
                        <div class="flex justify-between items-center mb-4">
                            <p class="text-gray-400 text-sm">Last 24 Hours</p>
                            <p class="text-white text-lg font-bold">$0.00</p>
                        </div>
                        <div class="flex-1 flex items-center justify-center bg-gray-800 rounded-md">
                            <p class="text-gray-500">Graph Area</p>
                        </div>
                        <div class="flex justify-between text-xs text-gray-400 mt-2">
                            <span>00:00</span>
                            <span>02:00</span>
                            <span>04:00</span>
                            <span>06:00</span>
                            <span>08:00</span>
                            <span>10:00</span>
                            <span>12:00</span>
                            <span>14:00</span>
                            <span>16:00</span>
                            <span>18:00</span>
                            <span>20:00</span>
                            <span>22:00</span>
                        </div>
                    </div>
                    <!-- Recent Orders Placeholder (right, takes 1/3 width on large screens) -->
                    <div class="bg-gray-700 p-6 rounded-lg shadow-md col-span-1 lg:col-span-1 flex flex-col flex-grow">
                        <h3 class="text-xl font-bold text-white mb-4">Recent Orders</h3>
                        <div id="dashboard-recent-orders" class="flex-1 overflow-y-auto">
                            <!-- Recent orders will be dynamically loaded here -->
                            <p class="text-gray-400">No recent orders.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        // Update dynamic content after rendering HTML
        const dashboardAccountTypeDisplay = document.getElementById('dashboard-account-type-display');
        const dashboardWalletBalance = document.getElementById('dashboard-wallet-balance');
        const dashboardRecentOrders = document.getElementById('dashboard-recent-orders');

        const loggedInUserEmail = localStorage.getItem('loggedInUser');
        const currentUser = dataStore.users.find(user => user.email === loggedInUserEmail);

        if (currentUser) {
            dashboardAccountTypeDisplay.textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
            dashboardWalletBalance.textContent = `$${currentUser.balance.toFixed(2)}`;

            dashboardRecentOrders.innerHTML = '';
            if (currentUser.orders && currentUser.orders.length > 0) {
                const recentOrders = [...currentUser.orders].sort((a, b) => new Date(b.date) - new Date(a.date));
                recentOrders.forEach(order => {
                    const orderDiv = document.createElement('div');
                    orderDiv.classList.add('bg-gray-800', 'p-3', 'rounded-md', 'mb-2', 'last:mb-0');
                    orderDiv.innerHTML = `
                        <p class="text-white font-semibold">${order.product} (x${order.quantity})</p>
                        <p class="text-gray-400 text-sm">Amount: $${order.cost.toFixed(2)}</p>
                        <p class="text-gray-400 text-xs">Date: ${order.date}</p>
                    `;
                    dashboardRecentOrders.appendChild(orderDiv);
                });
            } else {
                dashboardRecentOrders.innerHTML = '<p class="text-gray-400">No recent orders.</p>';
            }
        }
    };

    const renderBuyKeysPage = () => {
        contentArea.innerHTML = `
            <div class="content-page">
                <h1 class="text-3xl font-bold text-white mb-6">Buy Keys</h1>
                <div class="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col h-full">
                    <p class="text-gray-400 text-lg mb-4">Your current balance: <span id="current-balance" class="font-bold text-white">$0.00</span></p>
                    <div class="mb-4">
                        <label for="product-select" class="block text-gray-400 text-sm font-medium mb-2">Select Product</label>
                        <select id="product-select" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600">
                            <!-- Products will be loaded here dynamically -->
                        </select>
                    </div>
                    <div class="mb-4">
                        <label for="quantity-input" class="block text-gray-400 text-sm font-medium mb-2">Quantity</label>
                        <input type="number" id="quantity-input" value="1" min="1" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600">
                    </div>
                    <button id="buy-key-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md mt-auto">Buy Key(s)</button>
                </div>
            </div>
        `;

        const productSelect = document.getElementById('product-select');
        const quantityInput = document.getElementById('quantity-input');
        const buyKeyBtn = document.getElementById('buy-key-btn');
        const currentBalanceDisplay = document.getElementById('current-balance');

        productSelect.innerHTML = '<option value="">Select a product</option>';
        dataStore.products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.name;
            option.textContent = `${product.name} (Stock: ${product.stock}, Price: $${product.price.toFixed(2)})`;
            productSelect.appendChild(option);
        });

        const loggedInUserEmail = localStorage.getItem('loggedInUser');
        const currentUser = dataStore.users.find(user => user.email === loggedInUserEmail);
        if (currentUser) {
            currentBalanceDisplay.textContent = `$${currentUser.balance.toFixed(2)}`;
        }

        buyKeyBtn.addEventListener('click', () => {
            const selectedProductName = productSelect.value;
            const quantity = parseInt(quantityInput.value);

            if (!selectedProductName) {
                showMessage('Please select a product.');
                return;
            }
            if (isNaN(quantity) || quantity <= 0) {
                showMessage('Please enter a valid quantity.');
                return;
            }

            const selectedProduct = dataStore.products.find(p => p.name === selectedProductName);

            if (!selectedProduct) {
                showMessage('Selected product not found.');
                return;
            }
            if (selectedProduct.stock < quantity) {
                showMessage(`Not enough stock for ${selectedProduct.name}. Available: ${selectedProduct.stock}`);
                return;
            }

            const totalCost = selectedProduct.price * quantity;
            const currentUserIndex = dataStore.users.findIndex(user => user.email === loggedInUserEmail);
            const currentUserData = dataStore.users[currentUserIndex];

            if (currentUserData.balance < totalCost) {
                showMessage(`Insufficient balance. You need $${totalCost.toFixed(2)} but have $${currentUserData.balance.toFixed(2)}.`);
                return;
            }

            // Deduct balance
            currentUserData.balance -= totalCost;

            // Update product stock
            selectedProduct.stock -= quantity;
            saveDataToLocalStorage(); // Save updated dataStore

            // Add order to user's orders
            const order = {
                id: Date.now().toString().slice(-6),
                product: selectedProductName,
                quantity: quantity,
                cost: totalCost,
                date: new Date().toLocaleString(),
                status: 'Completed'
            };
            currentUserData.orders.push(order);
            saveDataToLocalStorage(); // Save updated dataStore

            showMessage(`Successfully purchased ${quantity} of ${selectedProductName} for $${totalCost.toFixed(2)}.`);
            renderBuyKeysPage(); // Re-render to update balance and product list
        });
    };

    const renderAddFundsPage = () => {
        contentArea.innerHTML = `
            <div class="content-page">
                <h1 class="text-3xl font-bold text-white mb-6">Add Funds</h1>
                <div class="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col h-full">
                    <p class="text-gray-400 text-lg mb-4">Your current balance: <span id="add-funds-current-balance" class="font-bold text-white">$0.00</span></p>
                    <div class="mb-4">
                        <label for="amount-input" class="block text-gray-400 text-sm font-medium mb-2">Amount to Add ($)</label>
                        <input type="number" id="amount-input" value="10.00" min="1.00" step="0.01" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600">
                    </div>
                    <button id="initiate-payment-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md mt-auto">Initiate Payment</button>

                    <div id="add-funds-confirmation-area" class="mt-4 hidden flex flex-col items-center">
                        <p class="text-yellow-400 text-md mb-4 text-center">Please proceed to payment to add funds.</p>
                        <button id="proceed-to-stripe-btn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">Proceed to Stripe</button>
                    </div>
                </div>
            </div>
        `;

        const amountInput = document.getElementById('amount-input');
        const initiatePaymentBtn = document.getElementById('initiate-payment-btn');
        const addFundsCurrentBalanceDisplay = document.getElementById('add-funds-current-balance');
        const addFundsConfirmationArea = document.getElementById('add-funds-confirmation-area');
        const proceedToStripeBtn = document.getElementById('proceed-to-stripe-btn');

        const loggedInUserEmail = localStorage.getItem('loggedInUser');
        const currentUser = dataStore.users.find(user => user.email === loggedInUserEmail);
        if (currentUser) {
            addFundsCurrentBalanceDisplay.textContent = `$${currentUser.balance.toFixed(2)}`;
        }

        // Temporary storage for amount and user details for the second step
        let amountToProcess = 0;
        let userForFunds = null;

        initiatePaymentBtn.addEventListener('click', () => {
            const amount = parseFloat(amountInput.value);

            if (isNaN(amount) || amount <= 0) {
                showMessage('Please enter a valid amount greater than zero.');
                return;
            }

            if (!currentUser) {
                showMessage('User not found. Please log in again.');
                return;
            }

            // Store values for the next step
            amountToProcess = amount;
            userForFunds = currentUser;

            // Show the confirmation message and the "Proceed to Stripe" button
            addFundsConfirmationArea.classList.remove('hidden');
            initiatePaymentBtn.disabled = true; // Disable the initial button
            amountInput.disabled = true; // Disable amount input
        });

        proceedToStripeBtn.addEventListener('click', async () => {
            if (!userForFunds || amountToProcess === 0) {
                showMessage('No amount specified for adding funds. Please enter an amount first.');
                // Reset UI if no amount is set
                addFundsConfirmationArea.classList.add('hidden');
                initiatePaymentBtn.disabled = false;
                amountInput.disabled = false;
                return;
            }

            showMessage(`Initiating payment for $${amountToProcess.toFixed(2)}...`);

            try {
                // IMPORTANT: Replace 'https://your-actual-backend-url.com' with your deployed backend URL.
                // This endpoint will create a Stripe Checkout Session and return its URL.
                const response = await fetch('https://your-actual-backend-url.com/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // You might send an authorization token here if your backend requires it
                        // 'Authorization': `Bearer ${localStorage.getItem('userAuthToken')}`
                    },
                    body: JSON.stringify({
                        userEmail: userForFunds.email,
                        amount: amountToProcess,
                        // Add success and cancel URLs for Stripe Checkout redirect
                        successUrl: window.location.origin + '/?payment=success', // Redirect back to your app with success param
                        cancelUrl: window.location.origin + '/?payment=cancelled' // Redirect back to your app with cancel param
                    })
                });

                const result = await response.json();

                if (response.ok && result.checkoutUrl) {
                    // Redirect user to Stripe Checkout page
                    window.location.href = result.checkoutUrl;
                } else {
                    showMessage(`Error initiating payment: ${result.error || 'Unknown error'}`);
                    // Reset UI on error
                    addFundsConfirmationArea.classList.add('hidden');
                    initiatePaymentBtn.disabled = false;
                    amountInput.disabled = false;
                }
            } catch (error) {
                console.error('Network or server error:', error);
                showMessage('Could not connect to payment service. Please try again later.');
                // Reset UI on network error
                addFundsConfirmationArea.classList.add('hidden');
                initiatePaymentBtn.disabled = false;
                amountInput.disabled = false;
            }
        });
    };

    const renderManageOrdersPage = () => {
        contentArea.innerHTML = `
            <div class="content-page">
                <h1 class="text-3xl font-bold text-white mb-6">Manage Orders</h1>
                <div class="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col h-full">
                    <div class="overflow-x-auto flex-1">
                        <table class="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                            <thead>
                                <tr>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tl-lg">Order ID</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Product</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Quantity</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tr-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody id="orders-table-body" class="divide-y divide-gray-700">
                                <!-- Order rows will be inserted here by JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        const ordersTableBody = document.getElementById('orders-table-body');
        const loggedInUserEmail = localStorage.getItem('loggedInUser');
        const currentUser = dataStore.users.find(user => user.email === loggedInUserEmail);

        if (currentUser && currentUser.orders && currentUser.orders.length > 0) {
            const sortedOrders = [...currentUser.orders].sort((a, b) => new Date(b.date) - new Date(a.date));
            sortedOrders.forEach(order => {
                const row = ordersTableBody.insertRow();
                row.classList.add('text-gray-300', 'hover:bg-gray-700');
                row.innerHTML = `
                    <td class="py-2 px-4 text-xs">${order.id}</td>
                    <td class="py-2 px-4">${order.product}</td>
                    <td class="py-2 px-4">${order.quantity}</td>
                    <td class="py-2 px-4 text-xs">${order.date}</td>
                    <td class="py-2 px-4">${order.status}</td>
                `;
            });
        } else {
            const row = ordersTableBody.insertRow();
            row.innerHTML = `<td colspan="5" class="py-4 px-4 text-center text-gray-500">No orders yet.</td>`;
        }
    };

    const renderManageKeysPage = () => {
        contentArea.innerHTML = `
            <div class="content-page">
                <h1 class="text-3xl font-bold text-white mb-6">Manage Keys</h1>
                <div class="bg-gray-700 p-6 rounded-lg shadow-md flex items-center justify-center">
                    <p class="text-gray-400 text-lg">Manage Keys content goes here.</p>
                </div>
            </div>
        `;
    };

    const renderSettingsPage = () => {
        contentArea.innerHTML = `
            <div class="content-page">
                <h1 class="text-3xl font-bold text-white mb-6">Settings</h1>
                <div class="bg-gray-700 p-6 rounded-lg shadow-md flex items-center justify-center">
                    <p class="text-gray-400 text-lg">Settings content goes here.</p>
                </div>
            </div>
        `;
    };

    const renderProductsPage = () => {
        contentArea.innerHTML = `
            <div class="content-page">
                <h1 class="text-3xl font-bold text-white mb-6">Products</h1>
                <div class="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col">
                    <div class="flex mb-4 space-x-4">
                        <input type="text" id="product-name-input" placeholder="Product Name" class="flex-1 p-2 rounded-md bg-gray-800 text-white border border-gray-600">
                        <input type="number" id="product-stock-input" placeholder="Stock" class="w-24 p-2 rounded-md bg-gray-800 text-white border border-gray-600">
                        <input type="number" id="product-price-input" placeholder="Price" step="0.01" class="w-24 p-2 rounded-md bg-gray-800 text-white border border-gray-600">
                        <button id="add-product-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">Add Product</button>
                    </div>
                    <div class="overflow-x-auto flex-1">
                        <table class="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                            <thead>
                                <tr>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tl-lg">Product Name</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Stock</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Price</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="products-table-body" class="divide-y divide-gray-700">
                                <!-- Product rows will be inserted here by JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        const productNameInput = document.getElementById('product-name-input');
        const productStockInput = document.getElementById('product-stock-input');
        const productPriceInput = document.getElementById('product-price-input');
        const addProductBtn = document.getElementById('add-product-btn');
        const productsTableBody = document.getElementById('products-table-body');

        const renderTable = () => {
            productsTableBody.innerHTML = '';
            dataStore.products.forEach((product, index) => {
                const row = productsTableBody.insertRow();
                row.classList.add('text-gray-300', 'hover:bg-gray-700');
                row.innerHTML = `
                    <td class="py-2 px-4">${product.name}</td>
                    <td class="py-2 px-4">
                        <input type="number" class="product-stock-edit-input w-20 p-1 rounded-md bg-gray-800 text-white border border-gray-600" value="${product.stock}" data-index="${index}">
                    </td>
                    <td class="py-2 px-4">$${product.price.toFixed(2)}</td>
                    <td class="py-2 px-4 flex space-x-2">
                        <button class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1 px-2 rounded-md update-product-stock-btn" data-index="${index}">Update Stock</button>
                        <button class="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded-md delete-product-btn" data-index="${index}">Remove</button>
                    </td>
                `;
            });

            document.querySelectorAll('.update-product-stock-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const index = event.target.dataset.index;
                    const stockInput = document.querySelector(`.product-stock-edit-input[data-index="${index}"]`);
                    const newStock = parseInt(stockInput.value);

                    if (isNaN(newStock) || newStock < 0) {
                        showMessage('Please enter a valid non-negative stock value.');
                        return;
                    }

                    dataStore.products[index].stock = newStock;
                    saveDataToLocalStorage();
                    showMessage(`Stock for ${dataStore.products[index].name} updated to ${newStock}.`);
                    renderTable(); // Re-render to show updated stock
                });
            });

            document.querySelectorAll('.delete-product-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const index = event.target.dataset.index;
                    dataStore.products.splice(index, 1);
                    saveDataToLocalStorage();
                    renderTable();
                });
            });
        };

        addProductBtn.addEventListener('click', () => {
            const name = productNameInput.value.trim();
            const stock = parseInt(productStockInput.value.trim());
            const price = parseFloat(productPriceInput.value.trim());

            if (!name || isNaN(stock) || stock < 0 || isNaN(price) || price < 0) {
                showMessage('Please enter a valid product name, non-negative stock, and a valid price.');
                return;
            }

            dataStore.products.push({ name, stock, price });
            saveDataToLocalStorage();
            renderTable();
            productNameInput.value = '';
            productStockInput.value = '';
            productPriceInput.value = '';
        });
        renderTable(); // Initial render for products table
    };

    const renderResellersPage = () => {
        contentArea.innerHTML = `
            <div class="content-page">
                <h1 class="text-3xl font-bold text-white mb-6">Manage Users</h1>
                <div class="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col">
                    <div class="overflow-x-auto flex-1">
                        <table class="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                            <thead>
                                <tr>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tl-lg">Email/Username</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Role</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Balance</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="users-table-body" class="divide-y divide-gray-700">
                                <!-- User rows will be inserted here by JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        const usersTableBody = document.getElementById('users-table-body');

        const renderTable = () => {
            usersTableBody.innerHTML = '';
            dataStore.users.forEach((user, index) => {
                // Do not allow admin to remove themselves or edit their own balance in this UI
                if (user.email === ADMIN_USERNAME && localStorage.getItem('loggedInUserRole') === 'admin') {
                    return;
                }

                const row = usersTableBody.insertRow();
                row.classList.add('text-gray-300', 'hover:bg-gray-700');
                row.innerHTML = `
                    <td class="py-2 px-4">${user.email}</td>
                    <td class="py-2 px-4">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                    <td class="py-2 px-4">
                        <input type="number" class="balance-input w-24 p-1 rounded-md bg-gray-800 text-white border border-gray-600" value="${user.balance.toFixed(2)}" data-email="${user.email}">
                    </td>
                    <td class="py-2 px-4 flex space-x-2">
                        <button class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1 px-2 rounded-md update-balance-btn" data-email="${user.email}">Update</button>
                        <button class="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded-md delete-user-btn" data-email="${user.email}">Remove</button>
                    </td>
                `;
            });

            document.querySelectorAll('.update-balance-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const emailToUpdate = event.target.dataset.email;
                    const balanceInput = document.querySelector(`.balance-input[data-email="${emailToUpdate}"]`);
                    const newBalance = parseFloat(balanceInput.value);

                    if (isNaN(newBalance) || newBalance < 0) {
                        showMessage('Please enter a valid non-negative balance.');
                        return;
                    }

                    const userIndex = dataStore.users.findIndex(user => user.email === emailToUpdate);
                    if (userIndex !== -1) {
                        dataStore.users[userIndex].balance = newBalance;
                        saveDataToLocalStorage();
                        showMessage(`Balance for ${emailToUpdate} updated to $${newBalance.toFixed(2)}.`);
                        renderTable(); // Re-render to show updated balance
                    }
                });
            });

            document.querySelectorAll('.delete-user-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const emailToDelete = event.target.dataset.email;
                    dataStore.users = dataStore.users.filter(user => user.email !== emailToDelete);
                    saveDataToLocalStorage();
                    showMessage(`User ${emailToDelete} removed.`);
                    renderTable();
                });
            });
        };
        renderTable(); // Initial render for users table
    };

    // --- Main Application Flow ---

    // Function to show a specific page and update active link
    const navigateToPage = (pageId, role) => {
        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to the current nav link
        const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Clear content area before rendering new page
        contentArea.innerHTML = '';

        // Render content based on pageId and role
        switch (pageId) {
            case 'dashboard':
                renderDashboardPage();
                break;
            case 'buy-keys':
                renderBuyKeysPage();
                break;
            case 'add-funds': // New page case
                renderAddFundsPage();
                break;
            case 'manage-orders':
                renderManageOrdersPage();
                break;
            case 'manage-keys':
                renderManageKeysPage();
                break;
            case 'settings':
                renderSettingsPage();
                break;
            case 'products':
                if (role === 'admin') renderProductsPage();
                else showMessage('Access Denied: You do not have permission to view this page.');
                break;
            case 'resellers': // Now handles 'Manage Users'
                if (role === 'admin') renderResellersPage();
                else showMessage('Access Denied: You do not have permission to view this page.');
                break;
            default:
                renderDashboardPage(); // Default to dashboard if page not found
        }
    };

    // Function to show the main panel and hide login
    const showPanel = (username, role) => {
        loginContainer.classList.add('hidden');
        mainPanel.classList.remove('hidden');
        mainPanel.classList.add('flex');
        loggedInUsernameDisplay.textContent = username;
        userRoleDisplay.textContent = role.charAt(0).toUpperCase() + role.slice(1);

        // Update sidebar navigation visibility based on role
        navLinks.forEach(link => {
            const linkRole = link.dataset.role;
            // Admins see all links; resellers see only reseller-specific or general links
            if (role === 'admin' || linkRole === role || linkRole === undefined) {
                link.classList.remove('hidden');
            } else {
                link.classList.add('hidden');
            }
            // Update "Resellers" link text to "Manage Users" if admin
            if (link.dataset.page === 'resellers' && role === 'admin') {
                link.innerHTML = `
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2m3-10h4m-4 4h4m-9-4h.01M7 16h.01"></path></svg>
                    Manage Users
                `;
            }
        });

        // Set initial page based on role
        if (role === 'admin') {
            navigateToPage('resellers', role); // Admin default to Manage Users
        } else {
            navigateToPage('dashboard', role); // Reseller default to dashboard
        }
    };

    // Function to show the login page and hide main panel
    const showLogin = () => {
        mainPanel.classList.add('hidden');
        mainPanel.classList.remove('flex');
        loginContainer.classList.remove('hidden');
        loginPasswordInput.value = ''; // Clear password on logout for security
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('loggedInUserRole');
        // The email field will be populated by the initialization logic
    };

    // --- Event Listeners ---

    registerBtn.addEventListener('click', () => {
        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();

        if (!email || !password) {
            showMessage('Please enter both email/username and password.');
            return;
        }

        if (dataStore.users.some(user => user.email === email)) {
            showMessage('User with this email/username already exists. Please login or use a different email.');
            return;
        }

        dataStore.users.push({ email, password, role: 'reseller', balance: 0, orders: [] });
        saveDataToLocalStorage(); // Save users after registration
        showMessage('Registration successful! You can now log in.');
        loginEmailInput.value = '';
        loginPasswordInput.value = '';
    });

    loginBtn.addEventListener('click', () => {
        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();

        if (!email || !password) {
            showMessage('Please enter both email/username and password.');
            return;
        }

        // Admin login (simplified for client-side demo)
        if (email === ADMIN_USERNAME) { // Any password works for admin in this demo
            localStorage.setItem('loggedInUser', email);
            localStorage.setItem('loggedInUserRole', 'admin');
            saveRememberedEmail(email);
            // Add admin user to dataStore if not already there, for consistent saving
            if (!dataStore.users.some(user => user.email === ADMIN_USERNAME && user.role === 'admin')) {
                dataStore.users.push({ email: ADMIN_USERNAME, password: 'any_password_for_demo', role: 'admin', balance: 0, orders: [] });
            }
            saveDataToLocalStorage(); // Save dataStore after admin login
            showMessage('Admin login successful!');
            showPanel(email, 'admin');
            return;
        }

        // Regular user login
        const foundUser = dataStore.users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            localStorage.setItem('loggedInUser', email);
            localStorage.setItem('loggedInUserRole', foundUser.role);
            saveRememberedEmail(email);
            saveDataToLocalStorage(); // Save dataStore after regular user login
            showMessage('Login successful!');
            showPanel(email, foundUser.role);
        } else {
            showMessage('Invalid email/username or password.');
        }
    });

    logoutBtn.addEventListener('click', () => {
        showMessage('You have been logged out.');
        showLogin();
    });

    // Add click event listeners to main panel navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const pageId = link.dataset.page;
            const currentUserRole = localStorage.getItem('loggedInUserRole');
            navigateToPage(pageId, currentUserRole);
        });
    });

    // --- Initialization ---

    // Load data from local storage into the dataStore
    loadDataFromLocalStorage();

    // Populate login email field immediately on load if remembered
    const rememberedEmailOnLoad = getRememberedEmail();
    if (rememberedEmailOnLoad) {
        loginEmailInput.value = rememberedEmailOnLoad;
    }

    // Check if a user is already logged in from a previous session
    const loggedInUser = localStorage.getItem('loggedInUser');
    const loggedInUserRole = localStorage.getItem('loggedInUserRole');

    if (loggedInUser && loggedInUserRole) {
        // Find the user in the loaded dataStore to ensure consistency
        const userExists = dataStore.users.some(user => user.email === loggedInUser);
        if (userExists || loggedInUser === ADMIN_USERNAME) { // Admin always "exists" for demo purposes
            showPanel(loggedInUser, loggedInUserRole);
        } else {
            // If loggedInUser is in localStorage but not in dataStore,
            // it means the data was lost or corrupted. Force re-login.
            showMessage('Session data not found. Please log in again.');
            showLogin();
        }
    } else {
        showLogin();
    }
});
