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
        console.log('Loading data from localStorage...');
        const storedUsers = localStorage.getItem('users');
        const storedProducts = localStorage.getItem('products');
        if (storedUsers) {
            dataStore.users = JSON.parse(storedUsers);
            console.log('Users loaded:', dataStore.users);
        } else {
            dataStore.users = [];
            console.log('No users found in localStorage, initializing empty array.');
        }
        if (storedProducts) {
            dataStore.products = JSON.parse(storedProducts);
            console.log('Products loaded:', dataStore.products);
        } else {
            dataStore.products = [];
            console.log('No products found in localStorage, initializing empty array.');
        }
    };

    const saveDataToLocalStorage = () => {
        console.log('Saving data to localStorage...');
        localStorage.setItem('users', JSON.stringify(dataStore.users));
        localStorage.setItem('products', JSON.stringify(dataStore.products));
        console.log('Data saved. Current users in dataStore:', dataStore.users);
        console.log('Current products in dataStore:', dataStore.products);
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
                    <div class="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
                        <p class="text-gray-400 text-sm">Discount</p>
                        <p class="text-white text-3xl font-bold">50 %</p>
                    </div>
                    <div class="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
                        <p class="text-gray-400 text-sm">Account Type</p>
                        <p class="text-white text-3xl font-bold" id="dashboard-account-type-display">User</p>
                    </div>
                    <div class="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
                        <p class="text-gray-400 text-sm">Your Wallet</p>
                        <p class="text-white text-3xl font-bold" id="dashboard-wallet-balance">$0.00</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
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
                    <div class="bg-gray-700 p-6 rounded-lg shadow-md col-span-1 lg:col-span-1 flex flex-col flex-grow">
                        <h3 class="text-xl font-bold text-white mb-4">Recent Orders</h3>
                        <div id="dashboard-recent-orders" class="flex-1 overflow-y-auto">
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
                        ${order.key ? `<p class="text-gray-300 text-xs mt-1">Key: <span class="font-mono break-all">${order.key}</span></p>` : ''}
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
                        <label class="block text-gray-400 text-sm font-medium mb-2">Select Product</label>
                        <p class="text-gray-500 text-sm mb-2">Click a product card below to select it.</p>
                        <div id="product-cards-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-64 mb-4 p-2 rounded-md bg-gray-800 border border-gray-600">
                            <!-- Product cards will be dynamically loaded here -->
                            <p class="text-gray-500 text-center col-span-full">No products available.</p>
                        </div>
                    </div>

                    <div class="mb-4" id="key-duration-selection-container" style="display: none;">
                        <label for="key-duration-select" class="block text-gray-400 text-sm font-medium mb-2">Select Key Duration</label>
                        <select id="key-duration-select" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600">
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

        const productCardsContainer = document.getElementById('product-cards-container');
        const keyDurationSelect = document.getElementById('key-duration-select');
        const keyDurationSelectionContainer = document.getElementById('key-duration-selection-container');
        const quantityInput = document.getElementById('quantity-input');
        const buyKeyBtn = document.getElementById('buy-key-btn');
        const currentBalanceDisplay = document.getElementById('current-balance');

        let selectedProduct = null; // To store the currently selected product object

        const loggedInUserEmail = localStorage.getItem('loggedInUser');
        let currentUser = dataStore.users.find(user => user.email === loggedInUserEmail); // Get a mutable reference
        if (currentUser) {
            currentBalanceDisplay.textContent = `$${currentUser.balance.toFixed(2)}`;
        }

        // Function to render product cards
        const renderProductCards = () => {
            console.log('Rendering product cards. Products in dataStore:', dataStore.products);
            productCardsContainer.innerHTML = ''; // Clear existing cards
            if (dataStore.products.length === 0) {
                productCardsContainer.innerHTML = '<p class="text-gray-500 text-center col-span-full">No products available.</p>';
                return;
            }

            dataStore.products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add(
                    'product-card',
                    'bg-gray-700',
                    'p-4',
                    'rounded-lg',
                    'shadow-md',
                    'cursor-pointer',
                    'hover:ring-2',
                    'hover:ring-indigo-500',
                    'transition-all',
                    'duration-200',
                    'flex',
                    'items-center',
                    'space-x-3'
                );
                productCard.dataset.productName = product.name; // Store product name for selection

                // Checkmark/Exclamation icon based on stock
                const iconSvg = product.stock > 0
                    ? `<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
                    : `<svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;

                productCard.innerHTML = `
                    ${iconSvg}
                    <span class="text-white font-semibold text-lg">${product.name}</span>
                    <span class="text-gray-400 text-sm ml-auto">Stock: ${product.stock}</span>
                `;

                productCardsContainer.appendChild(productCard);
            });

            // Add click listeners to newly rendered product cards
            document.querySelectorAll('.product-card').forEach(card => {
                card.addEventListener('click', () => {
                    console.log('Product card clicked:', card.dataset.productName);
                    // Remove 'selected' class from all cards
                    document.querySelectorAll('.product-card').forEach(c => {
                        c.classList.remove('ring-indigo-500', 'ring-4'); // Remove ring from previously selected
                        c.classList.add('hover:ring-2'); // Re-add hover ring
                    });

                    // Add 'selected' class to the clicked card
                    card.classList.add('ring-indigo-500', 'ring-4');
                    card.classList.remove('hover:ring-2'); // Remove hover ring when selected

                    const productName = card.dataset.productName;
                    selectedProduct = dataStore.products.find(p => p.name === productName);
                    console.log('Selected product set to:', selectedProduct);
                    updateKeyDurationOptions(); // Update duration dropdown based on selection
                });
            });
        };

        // Function to update key duration options based on selected product
        const updateKeyDurationOptions = () => {
            console.log('updateKeyDurationOptions called. Current selectedProduct:', selectedProduct);
            keyDurationSelect.innerHTML = '<option value="">Select key duration</option>';
            keyDurationSelectionContainer.style.display = 'none'; // Hide by default

            if (selectedProduct && selectedProduct.keyLinks) {
                console.log('selectedProduct.keyLinks:', selectedProduct.keyLinks); // NEW LOG
                console.log('selectedProduct.keyPrices:', selectedProduct.keyPrices); // NEW LOG

                const hasApiLinks = Object.keys(selectedProduct.keyLinks).some(key => selectedProduct.keyLinks[key]);
                console.log('Selected product has keyLinks. hasApiLinks:', hasApiLinks);
                if (hasApiLinks) {
                    keyDurationSelectionContainer.style.display = 'block'; // Show if API links exist
                    for (const durationKey in selectedProduct.keyLinks) {
                        if (selectedProduct.keyLinks[durationKey]) { // Only add if API link exists
                            const option = document.createElement('option');
                            option.value = durationKey;
                            // Ensure keyPrices[durationKey] exists before accessing
                            const price = selectedProduct.keyPrices && selectedProduct.keyPrices[durationKey] !== undefined
                                ? selectedProduct.keyPrices[durationKey].toFixed(2)
                                : 'N/A'; // Fallback if price is missing
                            option.textContent = `${durationKey.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())} ($${price})`;
                            keyDurationSelect.appendChild(option);
                            console.log('Added duration option:', option.textContent);
                        }
                    }
                } else {
                    console.log('No valid API links found for selected product, keeping duration dropdown hidden.');
                }
            } else {
                console.log('No product selected or selected product has no keyLinks, keeping duration dropdown hidden.');
            }
        };

        // Initial render of product cards
        renderProductCards();
        // No initial call to updateKeyDurationOptions here for selectedProduct, as selectedProduct is null.
        // It will be called on product card click. This is the intended behavior.

        buyKeyBtn.addEventListener('click', async () => { // Made async to use await
            if (!selectedProduct) {
                showMessage('Please select a product.');
                return;
            }
            const selectedKeyDuration = keyDurationSelect.value;
            const quantity = parseInt(quantityInput.value);

            if (Object.keys(selectedProduct.keyLinks).length > 0 && !selectedKeyDuration) {
                showMessage('Please select a key duration.');
                return;
            }
            if (isNaN(quantity) || quantity <= 0) {
                showMessage('Please enter a valid quantity.');
                return;
            }

            if (selectedProduct.stock < quantity) {
                showMessage(`Not enough stock for ${selectedProduct.name}. Available: ${selectedProduct.stock}`);
                return;
            }

            let totalCost = 0;
            let productDisplayName = selectedProduct.name;
            let apiLinkToUse = '';

            if (selectedKeyDuration && selectedProduct.keyPrices && selectedProduct.keyPrices[selectedKeyDuration]) {
                totalCost = selectedProduct.keyPrices[selectedKeyDuration] * quantity;
                productDisplayName += ` (${selectedKeyDuration.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())})`;
                apiLinkToUse = selectedProduct.keyLinks[selectedKeyDuration];
            } else {
                // For products without specific key durations, use the main product price
                totalCost = selectedProduct.price * quantity;
                // If there are no key links, there's no API link to use for key generation
                // The key generation will default to the placeholder
            }

            console.log('--- Purchase Attempt ---');
            console.log('User balance BEFORE deduction:', currentUser.balance);
            console.log('Total cost:', totalCost);

            if (currentUser.balance < totalCost) {
                showMessage(`Insufficient balance. You need $${totalCost.toFixed(2)} but have $${currentUser.balance.toFixed(2)}.`);
                return;
            }

            // Deduct balance immediately
            currentUser.balance -= totalCost;
            console.log('User balance AFTER deduction:', currentUser.balance);
            saveDataToLocalStorage(); // Save updated user data

            // Re-fetch currentUser from dataStore after saving to ensure it's up-to-date
            currentUser = dataStore.users.find(user => user.email === loggedInUserEmail);
            if (currentUser) {
                currentBalanceDisplay.textContent = `$${currentUser.balance.toFixed(2)}`; // Update balance display
                document.getElementById('dashboard-wallet-balance') && (document.getElementById('dashboard-wallet-balance').textContent = `$${currentUser.balance.toFixed(2)}`);
            }

            showMessage('Processing your order...');
            buyKeyBtn.disabled = true; // Disable button during processing

            // --- START Cloudflare Worker Integration ---
            // IMPORTANT: Replaced with your actual Worker URL.
            const CLOUDFLARE_WORKER_URL = 'https://still-bush-5b4e.infiniteggpaypal.workers.dev/'; // Your deployed Worker URL

            try {
                const response = await fetch(CLOUDFLARE_WORKER_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        productName: selectedProduct.name,
                        duration: selectedKeyDuration
                    })
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    // Handle errors returned by the Worker
                    console.error('Error from Cloudflare Worker:', result.error || 'Unknown error');
                    showMessage(`Purchase failed: ${result.error || 'An unknown error occurred.'}`);

                    // Refund balance if key generation failed after deduction
                    currentUser.balance += totalCost;
                    saveDataToLocalStorage();
                    currentBalanceDisplay.textContent = `$${currentUser.balance.toFixed(2)}`;
                    document.getElementById('dashboard-wallet-balance') && (document.getElementById('dashboard-wallet-balance').textContent = `$${currentUser.balance.toFixed(2)}`);
                    return;
                }

                const realKey = result.key; // Get the real key from the Worker's response

                // Update product stock (still client-side for this demo, but ideally also backend)
                selectedProduct.stock -= quantity;

                // Add order to user's orders with the REAL generated key
                const order = {
                    id: Date.now().toString().slice(-6),
                    product: productDisplayName,
                    quantity: quantity,
                    cost: totalCost,
                    date: new Date().toLocaleString(),
                    status: 'Completed',
                    key: realKey // Store the real key
                };
                currentUser.orders.push(order);
                saveDataToLocalStorage(); // Save updated dataStore

                showMessage(`Successfully purchased ${quantity} of ${order.product} for $${totalCost.toFixed(2)}! Your key: ${realKey}`);

            } catch (error) {
                console.error('Network or unexpected error calling Cloudflare Worker:', error);
                showMessage(`Purchase failed: Network error or unexpected response.`);
                // Refund balance for network errors too
                currentUser.balance += totalCost;
                saveDataToLocalStorage();
                currentBalanceDisplay.textContent = `$${currentUser.balance.toFixed(2)}`;
                document.getElementById('dashboard-wallet-balance') && (document.getElementById('dashboard-wallet-balance').textContent = `$${currentUser.balance.toFixed(2)}`);
            } finally {
                buyKeyBtn.disabled = false; // Re-enable button
            }
            // --- END Cloudflare Worker Integration ---
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

            // Show the confirmation message and the "Proceed to Stripe" button
            addFundsConfirmationArea.classList.remove('hidden');
            initiatePaymentBtn.disabled = true; // Disable the initial button
            amountInput.disabled = true; // Disable amount input
        });

        proceedToStripeBtn.addEventListener('click', () => {
            // Redirect to the specific Stripe payment link
            window.location.href = 'https://buy.stripe.com/14AbJ283scPr52b85Kebu01';
            // Note: The amount entered in the input field on this page will NOT
            // be passed to the Stripe link, as this is a fixed payment link.
            // Any balance update would need to be handled by a Stripe webhook
            // on your backend after the user completes payment on Stripe's site.
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
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Key</th>
                                </tr>
                            </thead>
                            <tbody id="orders-table-body" class="divide-y divide-gray-700">
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
                    <td class="py-2 px-4 text-xs font-mono break-all">${order.key || 'N/A'}</td>
                `;
            });
        } else {
            const row = ordersTableBody.insertRow();
            row.innerHTML = `<td colspan="6" class="py-4 px-4 text-center text-gray-500">No orders yet.</td>`;
        }
    };

    const renderManageKeysPage = () => {
        contentArea.innerHTML = `
            <div class="content-page">
                <h1 class="text-3xl font-bold text-white mb-6">Manage Keys</h1>
                <div class="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col h-full">
                    <div class="overflow-x-auto flex-1">
                        <table class="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                            <thead>
                                <tr>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tl-lg">Product</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Key</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tr-lg">Purchased Date</th>
                                </tr>
                            </thead>
                            <tbody id="manage-keys-table-body" class="divide-y divide-gray-700">
                                <!-- Keys will be inserted here by JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        const manageKeysTableBody = document.getElementById('manage-keys-table-body');
        const loggedInUserEmail = localStorage.getItem('loggedInUser');
        const currentUser = dataStore.users.find(user => user.email === loggedInUserEmail);

        manageKeysTableBody.innerHTML = ''; // Clear existing content

        if (currentUser && currentUser.orders && currentUser.orders.length > 0) {
            // Filter orders that have a key and sort them by date
            const keys = currentUser.orders.filter(order => order.key).sort((a, b) => new Date(b.date) - new Date(a.date));

            if (keys.length > 0) {
                keys.forEach(order => {
                    const row = manageKeysTableBody.insertRow();
                    row.classList.add('text-gray-300', 'hover:bg-gray-700');
                    row.innerHTML = `
                        <td class="py-2 px-4">${order.product}</td>
                        <td class="py-2 px-4 text-xs font-mono break-all">${order.key}</td>
                        <td class="py-2 px-4 text-xs">${order.date}</td>
                    `;
                });
            } else {
                const row = manageKeysTableBody.insertRow();
                row.innerHTML = `<td colspan="3" class="py-4 px-4 text-center text-gray-500">No keys purchased yet.</td>`;
            }
        } else {
            const row = manageKeysTableBody.insertRow();
            row.innerHTML = `<td colspan="3" class="py-4 px-4 text-center text-gray-500">No keys purchased yet.</td>`;
        }
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
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label for="product-name-input" class="block text-gray-400 text-sm font-medium mb-2">Product Name</label>
                            <input type="text" id="product-name-input" placeholder="Product Name" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600">
                        </div>
                        <div>
                            <label for="product-stock-input" class="block text-gray-400 text-sm font-medium mb-2">Stock</label>
                            <input type="number" id="product-stock-input" placeholder="Stock" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600">
                        </div>
                        <div>
                            <label for="product-price-input" class="block text-gray-400 text-sm font-medium mb-2">Base Price (per unit)</label>
                            <input type="number" id="product-price-input" placeholder="Base Price" step="0.01" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600">
                        </div>
                        <div class="col-span-2">
                            <label class="block text-gray-400 text-sm font-medium mb-2">API Links (Optional)</label>
                            <input type="text" id="product-api-link-1-day" placeholder="1 Day Key API Link" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 mb-2">
                            <input type="text" id="product-api-link-7-day" placeholder="7 Day Key API Link" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 mb-2">
                            <input type="text" id="product-api-link-30-day" placeholder="30 Day Key API Link" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600">
                        </div>
                        <div class="col-span-2">
                            <label class="block text-gray-400 text-sm font-medium mb-2">Key Prices (Optional)</label>
                            <input type="number" id="product-price-1-day" placeholder="1 Day Price" step="0.01" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 mb-2">
                            <input type="number" id="product-price-7-day" placeholder="7 Day Price" step="0.01" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 mb-2">
                            <input type="number" id="product-price-30-day" placeholder="30 Day Price" step="0.01" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600">
                        </div>
                    </div>
                    <button id="add-product-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md mt-4">Add Product</button>

                    <div class="overflow-x-auto flex-1 mt-6">
                        <table class="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                            <thead>
                                <tr>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tl-lg">Product Name</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Stock</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Base Price</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">1 Day Price</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">7 Day Price</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">30 Day Price</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">1 Day API</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">7 Day API</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">30 Day API</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="products-table-body" class="divide-y divide-gray-700">
                                </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        const productNameInput = document.getElementById('product-name-input');
        const productStockInput = document.getElementById('product-stock-input');
        const productPriceInput = document.getElementById('product-price-input');
        const productApiLink1DayInput = document.getElementById('product-api-link-1-day');
        const productApiLink7DayInput = document.getElementById('product-api-link-7-day');
        const productApiLink30DayInput = document.getElementById('product-api-link-30-day');
        // New price inputs
        const productPrice1DayInput = document.getElementById('product-price-1-day');
        const productPrice7DayInput = document.getElementById('product-price-7-day');
        const productPrice30DayInput = document.getElementById('product-price-30-day');

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
                    <td class="py-2 px-4">$${product.keyPrices?.['1_day']?.toFixed(2) || 'N/A'}</td>
                    <td class="py-2 px-4">$${product.keyPrices?.['7_day']?.toFixed(2) || 'N/A'}</td>
                    <td class="py-2 px-4">$${product.keyPrices?.['30_day']?.toFixed(2) || 'N/A'}</td>
                    <td class="py-2 px-4 text-xs break-all">${product.keyLinks?.['1_day'] || 'N/A'}</td>
                    <td class="py-2 px-4 text-xs break-all">${product.keyLinks?.['7_day'] || 'N/A'}</td>
                    <td class="py-2 px-4 text-xs break-all">${product.keyLinks?.['30_day'] || 'N/A'}</td>
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
            const keyLinks = {
                '1_day': productApiLink1DayInput.value.trim(),
                '7_day': productApiLink7DayInput.value.trim(),
                '30_day': productApiLink30DayInput.value.trim()
            };
            const keyPrices = {
                '1_day': parseFloat(productPrice1DayInput.value.trim()) || 0, // Capture 1 Day Price
                '7_day': parseFloat(productPrice7DayInput.value.trim()) || 0, // Capture 7 Day Price
                '30_day': parseFloat(productPrice30DayInput.value.trim()) || 0 // Capture 30 Day Price
            };


            if (!name || isNaN(stock) || stock < 0 || isNaN(price) || price < 0) {
                showMessage('Please enter a valid product name, non-negative stock, and a valid base price.');
                return;
            }

            // Validate duration prices only if API links are provided
            if (Object.values(keyLinks).some(link => link.length > 0)) {
                if (
                    (keyLinks['1_day'] && (isNaN(keyPrices['1_day']) || keyPrices['1_day'] < 0)) ||
                    (keyLinks['7_day'] && (isNaN(keyPrices['7_day']) || keyPrices['7_day'] < 0)) ||
                    (keyLinks['30_day'] && (isNaN(keyPrices['30_day']) || keyPrices['30_day'] < 0))
                ) {
                    showMessage('Please enter valid non-negative prices for all provided key durations.');
                    return;
                }
            }


            dataStore.products.push({ name, stock, price, keyLinks, keyPrices }); // Store keyLinks and keyPrices objects
            saveDataToLocalStorage();
            renderTable();
            productNameInput.value = '';
            productStockInput.value = '';
            productPriceInput.value = '';
            productApiLink1DayInput.value = '';
            productApiLink7DayInput.value = '';
            productApiLink30DayInput.value = '';
            productPrice1DayInput.value = ''; // Clear new price inputs
            productPrice7DayInput.value = '';
            productPrice30DayInput.value = '';
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
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="users-table-body" class="divide-y divide-gray-700">
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
        console.log("showPanel called. Showing main panel."); // Debug log
        loginContainer.classList.add('hidden'); // Hide login container
        loginContainer.classList.remove('flex'); // Ensure flex is removed
        mainPanel.classList.remove('hidden'); // Show main panel
        mainPanel.classList.add('flex'); // Ensure main panel is flex for layout

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
        console.log("showLogin called. Showing login container."); // Debug log
        mainPanel.classList.add('hidden'); // Hide main panel
        mainPanel.classList.remove('flex'); // Ensure flex is removed
        loginContainer.classList.remove('hidden'); // Show login container
        loginContainer.classList.add('flex'); // Ensure login container is flex for centering

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

    // Initialize some default products if dataStore.products is empty
    if (dataStore.products.length === 0) {
        console.log('Initializing default products as dataStore.products is empty.');
        dataStore.products.push(
            {
                name: 'Zero Day',
                stock: 1000, // A high stock as keys are generated via API
                price: 0, // Price will be determined by key duration
                keyLinks: {
                    '1_day': 'https://desync.mysrv.us/api/seller/keys/zeroday/1/3c7eb3b4de899d279d23d1b2cc546cb96561fec740678f697e52bf5eef21a8a9',
                    '7_day': 'https://desync.mysrv.us/api/seller/keys/zeroday/7/3c7eb3b4de899d279d23d1b2cc546cb96561fec740678f697e52bf5eef21a8a9',
                    '30_day': 'https://desync.mysrv.us/api/seller/keys/zeroday/30/3c7eb3b4de899d279d23d1b2cc546cb96561fec740678f697e52bf5eef21a8a9'
                },
                keyPrices: { // New: Store prices per key duration
                    '1_day': 3.50,
                    '7_day': 13.00,
                    '30_day': 25.50
                }
            },
            {
                name: 'Example Product (No API Keys)',
                stock: 10,
                price: 10.00,
                keyLinks: {}, // Empty object for products without API keys
                keyPrices: {}
            }
        );
        saveDataToLocalStorage();
    } else {
        console.log('Products already exist in localStorage, skipping default initialization.');
    }


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
        // Ensure only the login container is visible on initial load if no user is logged in
        showLogin();
    }
});
