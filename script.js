document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded. Script is running.'); // New log

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
    // Correctly target the dynamic content container
    const dynamicContentContainer = document.getElementById('dynamic-content-container');

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
        dynamicContentContainer.innerHTML = `
            <div class="flex-1 flex flex-col min-h-0 h-full px-4 py-4"> <!-- Added px-4 and py-4 -->
                <h1 class="text-3xl font-bold text-white mb-4">Dashboard</h1> <!-- Reduced mb-6 to mb-4 -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 flex-shrink-0"> <!-- Reduced gap-6 to gap-4, mb-6 to mb-4 -->
                    <div class="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center justify-center"> <!-- Reduced p-6 to p-4 -->
                        <p class="text-gray-400 text-sm">Discount</p>
                        <p class="text-white text-3xl font-bold">50 %</p>
                    </div>
                    <div class="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center justify-center"> <!-- Reduced p-6 to p-4 -->
                        <p class="text-gray-400 text-sm">Account Type</p>
                        <p class="text-white text-3xl font-bold" id="dashboard-account-type-display">User</p>
                    </div>
                    <div class="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center justify-center"> <!-- Reduced p-6 to p-4 -->
                        <p class="text-gray-400 text-sm">Your Wallet</p>
                        <p class="text-white text-3xl font-bold" id="dashboard-wallet-balance">$0.00</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0"> <!-- Reduced gap-6 to gap-4 -->
                    <div class="bg-gray-700 p-4 rounded-lg shadow-md col-span-1 lg:col-span-2 flex flex-col flex-grow min-h-0"> <!-- Reduced p-6 to p-4 -->
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
                    <div class="bg-gray-700 p-4 rounded-lg shadow-md col-span-1 lg:col-span-1 flex flex-col flex-grow min-h-0"> <!-- Reduced p-6 to p-4 -->
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
        dynamicContentContainer.innerHTML = `
            <div class="flex-1 flex flex-col min-h-0 h-full px-4 py-4"> <!-- Added px-4 and py-4 -->
                <h1 class="text-3xl font-bold text-white mb-4">Buy Keys</h1> <!-- Reduced mb-6 to mb-4 -->
                <div class="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col flex-1 min-h-0"> <!-- Reduced p-6 to p-4 -->
                    <p class="text-gray-400 text-lg mb-4">Your current balance: <span id="current-balance" class="font-bold text-white">$0.00</span></p>

                    <div id="product-selection-area" class="flex-1 flex flex-col min-h-0">
                        <label class="block text-gray-400 text-sm font-medium mb-2">Select Product</label>
                        <p class="text-gray-500 text-sm mb-2">Click a product card below to select it.</p>
                        <div id="product-cards-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-64 mb-4 p-2 rounded-md bg-gray-800 border border-gray-600">
                            <!-- Product cards will be dynamically loaded here -->
                            <p class="text-gray-500 text-center col-span-full">No products available.</p>
                        </div>
                    </div>

                    <!-- New section for selected product details -->
                    <div id="selected-product-detail" class="hidden bg-gray-800 p-4 rounded-lg shadow-md mb-4 relative flex-shrink-0"> <!-- Reduced mb-6 to mb-4 -->
                        <button id="back-to-products-btn" class="absolute top-3 right-3 bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold py-1 px-2 rounded-md">
                            Back to Products
                        </button>
                        <div class="flex items-center space-x-4 mb-4">
                            <img id="product-detail-image" src="https://placehold.co/120x80/374151/ffffff?text=Product" alt="Product Image" class="w-24 h-auto rounded-md border border-gray-600">
                            <div>
                                <h2 id="product-detail-name" class="text-xl font-bold text-white">Product Name</h2>
                                <p id="product-detail-description" class="text-gray-400 text-sm">No description available.</p>
                            </div>
                            <span id="product-detail-status" class="ml-auto font-bold text-green-500"></span>
                        </div>
                        <div class="flex space-x-4 text-sm text-indigo-400">
                            <a id="product-detail-downloader-link" href="#" target="_blank" class="hover:underline flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Download
                            </a>
                            <a id="product-detail-instructions-link" href="#" target="_blank" class="hover:underline flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                Instructions
                            </a>
                        </div>
                    </div>

                    <!-- Section for key variants -->
                    <div id="key-variants-container" class="mb-4 hidden flex-1 overflow-y-auto">
                        <h3 class="text-xl font-bold text-white mb-4">Select Variants</h3>
                        <!-- Variants will be dynamically loaded here -->
                    </div>

                    <button id="buy-key-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md mt-auto flex-shrink-0">Buy Key(s)</button>
                </div>
            </div>
        `;

        const productSelectionArea = document.getElementById('product-selection-area');
        const productCardsContainer = document.getElementById('product-cards-container');
        const selectedProductDetail = document.getElementById('selected-product-detail');
        const keyVariantsContainer = document.getElementById('key-variants-container');
        const buyKeyBtn = document.getElementById('buy-key-btn');
        const currentBalanceDisplay = document.getElementById('current-balance');
        const backToProductsBtn = document.getElementById('back-to-products-btn');

        const productDetailImage = document.getElementById('product-detail-image');
        const productDetailName = document.getElementById('product-detail-name');
        const productDetailDescription = document.getElementById('product-detail-description');
        const productDetailStatus = document.getElementById('product-detail-status');
        const productDetailDownloaderLink = document.getElementById('product-detail-downloader-link');
        const productDetailInstructionsLink = document.getElementById('product-detail-instructions-link');


        let selectedProduct = null; // To store the currently selected product object

        // Reset state on page load
        selectedProduct = null;
        productSelectionArea.classList.remove('hidden');
        selectedProductDetail.classList.add('hidden');
        keyVariantsContainer.classList.add('hidden');

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
                    'p-4', // Reduced p-6 to p-4
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

                    // Show selected product details and hide product cards
                    productSelectionArea.classList.add('hidden');
                    selectedProductDetail.classList.remove('hidden');
                    keyVariantsContainer.classList.remove('hidden'); // Show variants container

                    // Populate selected product details
                    productDetailImage.src = selectedProduct.imageUrl || 'https://placehold.co/120x80/374151/ffffff?text=Product';
                    productDetailName.textContent = selectedProduct.name;
                    productDetailDescription.textContent = selectedProduct.description || 'No description available.'; // Assuming a description field
                    productDetailStatus.textContent = selectedProduct.status.charAt(0).toUpperCase() + selectedProduct.status.slice(1);
                    productDetailStatus.className = `ml-auto font-bold ${selectedProduct.status === 'undetected' ? 'text-green-500' : 'text-red-500'}`;

                    if (selectedProduct.downloaderLink) {
                        productDetailDownloaderLink.href = selectedProduct.downloaderLink;
                        productDetailDownloaderLink.classList.remove('hidden');
                    } else {
                        productDetailDownloaderLink.classList.add('hidden');
                    }
                    if (selectedProduct.instructionsLink) {
                        productDetailInstructionsLink.href = selectedProduct.instructionsLink;
                        productDetailInstructionsLink.classList.remove('hidden');
                    } else {
                        productDetailInstructionsLink.classList.add('hidden');
                    }

                    renderKeyVariants(); // Render variants based on selection
                });
            });
        };

        // Function to render key variants
        const renderKeyVariants = () => {
            console.log('renderKeyVariants called. Current selectedProduct:', selectedProduct);
            keyVariantsContainer.innerHTML = ''; // Clear existing variants
            keyVariantsContainer.classList.add('hidden'); // Hide by default

            if (selectedProduct && selectedProduct.keyLinks && Object.keys(selectedProduct.keyLinks).length > 0) {
                keyVariantsContainer.classList.remove('hidden'); // Show if variants exist

                const durations = ['1_day', '7_day', '30_day'];
                durations.forEach(durationKey => {
                    if (selectedProduct.keyLinks[durationKey]) { // Only render if API link exists for this duration
                        // Ensure price is a number, defaulting to 0.00 if NaN or undefined
                        const priceValue = selectedProduct.keyPrices && !isNaN(selectedProduct.keyPrices[durationKey])
                            ? selectedProduct.keyPrices[durationKey]
                            : 0.00;
                        const price = priceValue.toFixed(2); // Format to 2 decimal places

                        const displayDuration = durationKey.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase());

                        const variantDiv = document.createElement('div');
                        variantDiv.classList.add('flex', 'items-center', 'justify-between', 'mb-2', 'py-2', 'px-3', 'bg-gray-800', 'rounded-md', 'shadow-sm'); // Reduced mb-3 to mb-2
                        variantDiv.innerHTML = `
                            <div>
                                <p class="text-white font-semibold text-lg">${displayDuration}</p>
                                <p class="text-gray-400 text-sm">$${price} / key</p>
                            </div>
                            <div class="flex items-center space-x-2">
                                <button class="variant-qty-btn bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded-md" data-action="decrement" data-duration="${durationKey}">-</button>
                                <input type="number" class="variant-qty-input w-16 text-center p-1 rounded-md bg-gray-900 text-white border border-gray-600" value="0" min="0" data-duration="${durationKey}">
                                <button class="variant-qty-btn bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded-md" data-action="increment" data-duration="${durationKey}">+</button>
                            </div>
                        `;
                        keyVariantsContainer.appendChild(variantDiv);
                    }
                });

                // Add event listeners for quantity buttons
                keyVariantsContainer.querySelectorAll('.variant-qty-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const durationKey = event.target.dataset.duration;
                        const action = event.target.dataset.action;
                        const input = keyVariantsContainer.querySelector(`.variant-qty-input[data-duration="${durationKey}"]`);
                        let currentValue = parseInt(input.value);

                        if (action === 'increment') {
                            currentValue++;
                        } else if (action === 'decrement') {
                            currentValue = Math.max(0, currentValue - 1); // Don't go below zero
                        }
                        input.value = currentValue;
                    });
                });
            }
        };

        // Event listener for "Back to Products" button
        backToProductsBtn.addEventListener('click', () => {
            selectedProduct = null; // Clear selected product
            productSelectionArea.classList.remove('hidden'); // Show product cards
            selectedProductDetail.classList.add('hidden'); // Hide selected product details
            keyVariantsContainer.classList.add('hidden'); // Hide variants
            renderProductCards(); // Re-render product cards (to reset selection)
        });


        // Initial render of product cards
        renderProductCards();

        buyKeyBtn.addEventListener('click', async () => { // Made async to use await
            if (!selectedProduct) {
                showMessage('Please select a product.');
                return;
            }

            const purchasedItems = [];
            let totalCost = 0;

            const variantInputs = keyVariantsContainer.querySelectorAll('.variant-qty-input');
            for (const input of variantInputs) {
                const durationKey = input.dataset.duration;
                const quantity = parseInt(input.value);

                if (quantity > 0) {
                    const pricePerKey = selectedProduct.keyPrices[durationKey];
                    if (isNaN(pricePerKey)) {
                        showMessage(`Price not defined for ${durationKey.replace('_', ' ')} keys.`);
                        return; // Stop if price is invalid
                    }

                    const itemCost = pricePerKey * quantity;
                    totalCost += itemCost;
                    purchasedItems.push({ durationKey, quantity, pricePerKey, itemCost });
                }
            }

            if (purchasedItems.length === 0) {
                showMessage('Please select a quantity for at least one key variant.');
                return;
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

            const CLOUDFLARE_WORKER_URL = 'https://still-bush-5b4e.infiniteggpaypal.workers.dev/'; // Your deployed Worker URL
            let purchaseSuccessful = true;
            let keysGenerated = [];

            for (const item of purchasedItems) {
                const { durationKey, quantity, pricePerKey, itemCost } = item;
                const productDisplayName = `${selectedProduct.name} (${durationKey.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())})`;

                for (let i = 0; i < quantity; i++) { // Loop for each key in the quantity
                    try {
                        const response = await fetch(CLOUDFLARE_WORKER_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                productName: selectedProduct.name,
                                duration: durationKey
                            })
                        });

                        const result = await response.json();

                        if (!response.ok || !result.success) {
                            console.error(`Error from Cloudflare Worker for ${productDisplayName} (key ${i+1}/${quantity}):`, result.error || 'Unknown error');
                            showMessage(`Failed to get key for ${productDisplayName} (item ${i+1}). ${result.error || 'An unknown error occurred.'}`);
                            purchaseSuccessful = false;
                            // Do not refund here, refund will happen at the end if any purchase fails
                            break; // Stop processing further items if one fails
                        }

                        const realKey = result.key; // Get the real key from the Worker's response
                        keysGenerated.push({ productDisplayName, realKey, quantity: 1, itemCost: pricePerKey, durationKey }); // Store each key individually

                    } catch (error) {
                        console.error(`Network or unexpected error calling Cloudflare Worker for ${productDisplayName} (key ${i+1}/${quantity}):`, error);
                        showMessage(`Network error for ${productDisplayName} (item ${i+1}).`);
                        purchaseSuccessful = false;
                        break; // Stop processing further items if network error
                    }
                }
                if (!purchaseSuccessful) break; // Break outer loop if any inner loop failed
            }

            if (purchaseSuccessful) {
                let allKeysMessage = 'Successfully purchased! Your keys:\n';
                for (const keyInfo of keysGenerated) {
                    // Update product stock (still client-side for this demo, but ideally also backend)
                    // Find the actual product in dataStore to update its stock
                    const productInStore = dataStore.products.find(p => p.name === selectedProduct.name);
                    if (productInStore) {
                        productInStore.stock -= keyInfo.quantity; // keyInfo.quantity will be 1 here
                    }

                    // Add order to user's orders
                    const order = {
                        id: Date.now().toString().slice(-6),
                        product: keyInfo.productDisplayName,
                        quantity: keyInfo.quantity, // This will be 1 for each individual key
                        cost: keyInfo.itemCost, // This will be the price per key
                        date: new Date().toLocaleString(),
                        status: 'Completed',
                        key: keyInfo.realKey // Store the real key
                    };
                    currentUser.orders.push(order);
                    allKeysMessage += `${keyInfo.productDisplayName}: ${keyInfo.realKey}\n`;
                }
                saveDataToLocalStorage(); // Save updated dataStore after all successful purchases

                showMessage(allKeysMessage);
            } else {
                // If any part of the purchase failed, refund the total cost
                currentUser.balance += totalCost;
                saveDataToLocalStorage();
                currentBalanceDisplay.textContent = `$${currentUser.balance.toFixed(2)}`;
                document.getElementById('dashboard-wallet-balance') && (document.getElementById('dashboard-wallet-balance').textContent = `$${currentUser.balance.toFixed(2)}`);
                showMessage('Some purchases failed. Funds have been refunded.');
            }
            buyKeyBtn.disabled = false; // Re-enable button
            renderKeyVariants(); // Re-render variants to reset quantities to 0
        });
    };

    const renderAddFundsPage = () => {
        dynamicContentContainer.innerHTML = `
            <div class="flex-1 flex flex-col min-h-0 h-full px-4 py-4"> <!-- Added px-4 and py-4 -->
                <h1 class="text-3xl font-bold text-white mb-4">Add Funds</h1> <!-- Reduced mb-6 to mb-4 -->
                <div class="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col flex-1 min-h-0"> <!-- Reduced p-6 to p-4 -->
                    <p class="text-gray-400 text-lg mb-4">Your current balance: <span id="add-funds-current-balance" class="font-bold text-white">$0.00</span></p>
                    <div class="mb-4 flex-shrink-0">
                        <label for="amount-input" class="block text-gray-400 text-sm font-medium mb-2">Amount to Add ($)</label>
                        <input type="number" id="amount-input" value="10.00" min="1.00" step="0.01" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600">
                    </div>
                    <button id="initiate-payment-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md mt-auto flex-shrink-0">Initiate Payment</button>

                    <div id="add-funds-confirmation-area" class="mt-4 hidden flex flex-col items-center flex-shrink-0">
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
        dynamicContentContainer.innerHTML = `
            <div class="flex-1 flex flex-col min-h-0 h-full px-4 py-4"> <!-- Added px-4 and py-4 -->
                <h1 class="text-3xl font-bold text-white mb-4">Manage Orders</h1> <!-- Reduced mb-6 to mb-4 -->
                <div class="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col flex-1 min-h-0"> <!-- Reduced p-6 to p-4 -->
                    <div class="overflow-x-auto flex-1">
                        <table class="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                            <thead>
                                <tr>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tl-lg">Order ID</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Product</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Quantity</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tr-lg">Key</th>
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
        dynamicContentContainer.innerHTML = `
            <div class="flex-1 flex flex-col min-h-0 h-full px-4 py-4"> <!-- Added px-4 and py-4 -->
                <h1 class="text-3xl font-bold text-white mb-4">Manage Keys</h1> <!-- Reduced mb-6 to mb-4 -->
                <div class="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col flex-1 min-h-0"> <!-- Reduced p-6 to p-4 -->
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
        dynamicContentContainer.innerHTML = `
            <div class="flex-1 flex flex-col min-h-0 h-full px-4 py-4"> <!-- Added px-4 and py-4 -->
                <h1 class="text-3xl font-bold text-white mb-4">Settings</h1> <!-- Reduced mb-6 to mb-4 -->
                <div class="bg-gray-700 p-4 rounded-lg shadow-md flex items-center justify-center flex-1 min-h-0"> <!-- Reduced p-6 to p-4 -->
                    <p class="text-gray-400 text-lg">Settings content goes here.</p>
                </div>
            </div>
        `;
    };

    const renderProductsPage = () => {
        dynamicContentContainer.innerHTML = `
            <div class="flex-1 flex flex-col min-h-0 h-full px-4 py-4"> <!-- Added px-4 and py-4 -->
                <h1 class="text-3xl font-bold text-white mb-4">Products</h1> <!-- Reduced mb-6 to mb-4 -->
                <div class="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col flex-1 min-h-0"> <!-- Reduced p-6 to p-4 -->
                    <h2 class="text-xl font-bold text-white mb-3 flex-shrink-0">Add New Product</h2> <!-- Reduced mb-4 to mb-3 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 flex-shrink-0"> <!-- Reduced gap-4 to gap-3, mb-4 to mb-3 -->
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
                        <div class="col-span-2">
                            <label for="product-image-url-input" class="block text-gray-400 text-sm font-medium mb-2">Image URL</label>
                            <input type="text" id="product-image-url-input" placeholder="Product Image URL" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600">
                        </div>
                        <div class="col-span-2">
                            <label for="product-downloader-link-input" class="block text-gray-400 text-sm font-medium mb-2">Downloader Link</label>
                            <input type="text" id="product-downloader-link-input" placeholder="Downloader Link" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600">
                        </div>
                        <div class="col-span-2">
                            <label for="product-instructions-link-input" class="block text-gray-400 text-sm font-medium mb-2">Instructions Link</label>
                            <input type="text" id="product-instructions-link-input" placeholder="Instructions Link" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600">
                        </div>
                        <div class="col-span-2">
                            <label for="product-status-select" class="block text-gray-400 text-sm font-medium mb-2">Status</label>
                            <select id="product-status-select" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600">
                                <option value="undetected">Undetected</option>
                                <option value="detected">Detected</option>
                            </select>
                        </div>
                        <div class="col-span-2">
                            <label for="product-description-input" class="block text-gray-400 text-sm font-medium mb-2">Description</label>
                            <textarea id="product-description-input" placeholder="Product Description" class="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 h-24"></textarea>
                        </div>
                    </div>
                    <button id="add-product-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md mt-4 flex-shrink-0">Add Product</button>

                    <h2 class="text-xl font-bold text-white mt-6 mb-3 flex-shrink-0">Existing Products</h2> <!-- Reduced mt-8 to mt-6, mb-4 to mb-3 -->
                    <div class="overflow-x-auto flex-1 min-h-0">
                        <table class="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                            <thead>
                                <tr>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tl-lg">Product Name</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Stock</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Base Price</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">1 Day Price</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">7 Day Price</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">30 Day Price</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Image</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Downloader</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Instructions</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                                    <th class="py-2 px-4 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="products-table-body" class="divide-y divide-gray-700">
                                </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Product Edit Modal (Hidden by default) -->
            <div id="product-edit-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center hidden z-50">
                <div class="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700 overflow-y-auto max-h-[90vh]"> <!-- Reduced p-8 to p-6 -->
                    <h2 class="text-2xl font-bold text-white mb-4">Edit Product</h2> <!-- Reduced mb-6 to mb-4 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3"> <!-- Reduced gap-4 to gap-3, mb-4 to mb-3 -->
                        <div>
                            <label for="edit-product-name-input" class="block text-gray-400 text-sm font-medium mb-2">Product Name</label>
                            <input type="text" id="edit-product-name-input" class="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600" readonly>
                        </div>
                        <div>
                            <label for="edit-product-stock-input" class="block text-gray-400 text-sm font-medium mb-2">Stock</label>
                            <input type="number" id="edit-product-stock-input" class="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600">
                        </div>
                        <div>
                            <label for="edit-product-price-input" class="block text-gray-400 text-sm font-medium mb-2">Base Price (per unit)</label>
                            <input type="number" id="edit-product-price-input" step="0.01" class="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600">
                        </div>
                        <div class="col-span-2">
                            <label class="block text-gray-400 text-sm font-medium mb-2">API Links (Optional)</label>
                            <input type="text" id="edit-product-api-link-1-day" placeholder="1 Day Key API Link" class="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 mb-2">
                            <input type="text" id="edit-product-api-link-7-day" placeholder="7 Day Key API Link" class="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 mb-2">
                            <input type="text" id="edit-product-api-link-30-day" placeholder="30 Day Key API Link" class="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600">
                        </div>
                        <div class="col-span-2">
                            <label class="block text-gray-400 text-sm font-medium mb-2">Key Prices (Optional)</label>
                            <input type="number" id="edit-product-price-1-day" placeholder="1 Day Price" step="0.01" class="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 mb-2">
                            <input type="number" id="edit-product-price-7-day" placeholder="7 Day Price" step="0.01" class="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 mb-2">
                            <input type="number" id="edit-product-price-30-day" placeholder="30 Day Price" step="0.01" class="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600">
                        </div>
                        <div class="col-span-2">
                            <label for="edit-product-image-url-input" class="block text-gray-400 text-sm font-medium mb-2">Image URL</label>
                            <input type="text" id="edit-product-image-url-input" placeholder="Product Image URL" class="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600">
                            <img id="edit-product-image-preview" src="https://placehold.co/120x80/374151/ffffff?text=Product" alt="Product Image" class="w-24 h-auto rounded-md mt-2 border border-gray-600">
                        </div>
                        <div class="col-span-2">
                            <label for="edit-product-downloader-link-input" class="block text-gray-400 text-sm font-medium mb-2">Downloader Link</label>
                            <input type="text" id="edit-product-downloader-link-input" placeholder="Downloader Link" class="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600">
                        </div>
                        <div class="col-span-2">
                            <label for="edit-product-instructions-link-input" class="block text-gray-400 text-sm font-medium mb-2">Instructions Link</label>
                            <input type="text" id="edit-product-instructions-link-input" placeholder="Instructions Link" class="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600">
                        </div>
                        <div class="col-span-2">
                            <label for="edit-product-status-select" class="block text-gray-400 text-sm font-medium mb-2">Status</label>
                            <select id="edit-product-status-select" class="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600">
                                <option value="undetected">Undetected</option>
                                <option value="detected">Detected</option>
                            </select>
                        </div>
                        <div class="col-span-2">
                            <label for="edit-product-description-input" class="block text-gray-400 text-sm font-medium mb-2">Description</label>
                            <textarea id="edit-product-description-input" placeholder="Product Description" class="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 h-24"></textarea>
                        </div>
                    </div>
                    <div class="flex justify-end space-x-4 mt-4 flex-shrink-0"> <!-- Reduced mt-6 to mt-4 -->
                        <button id="cancel-edit-product-btn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                        <button id="save-edit-product-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">Save Changes</button>
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
        const productPrice1DayInput = document.getElementById('product-price-1-day');
        const productPrice7DayInput = document.getElementById('product-price-7-day');
        const productPrice30DayInput = document.getElementById('product-price-30-day');
        const productImageURLInput = document.getElementById('product-image-url-input');
        const productDownloaderLinkInput = document.getElementById('product-downloader-link-input');
        const productInstructionsLinkInput = document.getElementById('product-instructions-link-input');
        const productStatusSelect = document.getElementById('product-status-select');
        const productDescriptionInput = document.getElementById('product-description-input');


        const addProductBtn = document.getElementById('add-product-btn');
        const productsTableBody = document.getElementById('products-table-body');

        // Modal elements
        const productEditModal = document.getElementById('product-edit-modal');
        const editProductNameInput = document.getElementById('edit-product-name-input');
        const editProductStockInput = document.getElementById('edit-product-stock-input');
        const editProductPriceInput = document.getElementById('edit-product-price-input');
        const editProductApiLink1DayInput = document.getElementById('edit-product-api-link-1-day');
        const editProductApiLink7DayInput = document.getElementById('edit-product-api-link-7-day');
        const editProductApiLink30DayInput = document.getElementById('edit-product-api-link-30-day');
        const editProductPrice1DayInput = document.getElementById('edit-product-price-1-day');
        const editProductPrice7DayInput = document.getElementById('edit-product-price-7-day');
        const editProductPrice30DayInput = document.getElementById('edit-product-price-30-day');
        const editProductImageURLInput = document.getElementById('edit-product-image-url-input');
        const editProductImagePreview = document.getElementById('edit-product-image-preview');
        const editProductDownloaderLinkInput = document.getElementById('edit-product-downloader-link-input');
        const editProductInstructionsLinkInput = document.getElementById('edit-product-instructions-link-input');
        const editProductStatusSelect = document.getElementById('edit-product-status-select');
        const editProductDescriptionInput = document.getElementById('edit-product-description-input');
        const saveEditProductBtn = document.getElementById('save-edit-product-btn');
        const cancelEditProductBtn = document.getElementById('cancel-edit-product-btn');

        let currentEditingProductIndex = -1; // To keep track of which product is being edited

        // Function to render the products table
        const renderTable = () => {
            productsTableBody.innerHTML = '';
            dataStore.products.forEach((product, index) => {
                const row = productsTableBody.insertRow();
                row.classList.add('text-gray-300', 'hover:bg-gray-700');
                row.innerHTML = `
                    <td class="py-2 px-4">${product.name}</td>
                    <td class="py-2 px-4">${product.stock}</td>
                    <td class="py-2 px-4">$${product.price.toFixed(2)}</td>
                    <td class="py-2 px-4">$${(product.keyPrices?.['1_day'] || 0).toFixed(2)}</td>
                    <td class="py-2 px-4">$${(product.keyPrices?.['7_day'] || 0).toFixed(2)}</td>
                    <td class="py-2 px-4">$${(product.keyPrices?.['30_day'] || 0).toFixed(2)}</td>
                    <td class="py-2 px-4">
                        ${product.imageUrl ? `<img src="${product.imageUrl}" alt="Product" class="w-10 h-auto rounded-md">` : 'N/A'}
                    </td>
                    <td class="py-2 px-4 text-xs break-all">
                        ${product.downloaderLink ? `<a href="${product.downloaderLink}" target="_blank" class="text-indigo-400 hover:underline">Link</a>` : 'N/A'}
                    </td>
                    <td class="py-2 px-4 text-xs break-all">
                        ${product.instructionsLink ? `<a href="${product.instructionsLink}" target="_blank" class="text-indigo-400 hover:underline">Link</a>` : 'N/A'}
                    </td>
                    <td class="py-2 px-4">
                        <span class="font-bold ${product.status === 'undetected' ? 'text-green-500' : 'text-red-500'}">
                            ${product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>
                    </td>
                    <td class="py-2 px-4 flex space-x-2">
                        <button class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded-md edit-product-btn" data-index="${index}">Edit</button>
                        <button class="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded-md delete-product-btn" data-index="${index}">Remove</button>
                    </td>
                `;
            });

            // Add event listeners for Edit buttons
            document.querySelectorAll('.edit-product-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const index = parseInt(event.target.dataset.index);
                    currentEditingProductIndex = index;
                    const product = dataStore.products[index];
                    
                    // Populate modal fields
                    editProductNameInput.value = product.name;
                    editProductStockInput.value = product.stock;
                    editProductPriceInput.value = product.price.toFixed(2);
                    editProductApiLink1DayInput.value = product.keyLinks?.['1_day'] || '';
                    editProductApiLink7DayInput.value = product.keyLinks?.['7_day'] || '';
                    editProductApiLink30DayInput.value = product.keyLinks?.['30_day'] || '';
                    editProductPrice1DayInput.value = (product.keyPrices?.['1_day'] || 0).toFixed(2);
                    editProductPrice7DayInput.value = (product.keyPrices?.['7_day'] || 0).toFixed(2);
                    editProductPrice30DayInput.value = (product.keyPrices?.['30_day'] || 0).toFixed(2);
                    editProductImageURLInput.value = product.imageUrl || '';
                    editProductImagePreview.src = product.imageUrl || 'https://placehold.co/120x80/374151/ffffff?text=Product';
                    editProductDownloaderLinkInput.value = product.downloaderLink || '';
                    editProductInstructionsLinkInput.value = product.instructionsLink || '';
                    editProductStatusSelect.value = product.status;
                    editProductDescriptionInput.value = product.description || '';

                    // Show the modal
                    productEditModal.classList.remove('hidden');
                });
            });

            // Add event listeners for Delete buttons
            document.querySelectorAll('.delete-product-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const index = event.target.dataset.index;
                    dataStore.products.splice(index, 1);
                    saveDataToLocalStorage();
                    renderTable();
                });
            });
        };

        // Event listener for adding a new product
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
                '1_day': parseFloat(productPrice1DayInput.value.trim()) || 0,
                '7_day': parseFloat(productPrice7DayInput.value.trim()) || 0,
                '30_day': parseFloat(productPrice30DayInput.value.trim()) || 0
            };
            const imageUrl = productImageURLInput.value.trim();
            const downloaderLink = productDownloaderLinkInput.value.trim();
            const instructionsLink = productInstructionsLinkInput.value.trim();
            const status = productStatusSelect.value;
            const description = productDescriptionInput.value.trim();


            if (!name || isNaN(stock) || stock < 0 || isNaN(price) || price < 0) {
                showMessage('Please enter a valid product name, non-negative stock, and a valid base price.');
                return;
            }

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


            dataStore.products.push({
                name,
                stock,
                price,
                keyLinks,
                keyPrices,
                imageUrl,
                downloaderLink,
                instructionsLink,
                status,
                description // Add description to the product object
            });
            saveDataToLocalStorage();
            renderTable();
            // Clear all input fields after adding
            productNameInput.value = '';
            productStockInput.value = '';
            productPriceInput.value = '';
            productApiLink1DayInput.value = '';
            productApiLink7DayInput.value = '';
            productApiLink30DayInput.value = '';
            productPrice1DayInput.value = '';
            productPrice7DayInput.value = '';
            productPrice30DayInput.value = '';
            productImageURLInput.value = '';
            productDownloaderLinkInput.value = '';
            productInstructionsLinkInput.value = '';
            productStatusSelect.value = 'undetected'; // Reset to default
            productDescriptionInput.value = '';
        });

        // Event listener for saving changes in the modal
        saveEditProductBtn.addEventListener('click', () => {
            if (currentEditingProductIndex === -1) {
                showMessage('No product selected for editing.');
                return;
            }

            const product = dataStore.products[currentEditingProductIndex];

            // Update product object with values from modal inputs
            // Note: Product name is readonly in the modal, so it won't change here
            product.stock = parseInt(editProductStockInput.value.trim());
            product.price = parseFloat(editProductPriceInput.value.trim());
            product.keyLinks['1_day'] = editProductApiLink1DayInput.value.trim();
            product.keyLinks['7_day'] = editProductApiLink7DayInput.value.trim();
            product.keyLinks['30_day'] = editProductApiLink30DayInput.value.trim();
            product.keyPrices['1_day'] = parseFloat(editProductPrice1DayInput.value.trim()) || 0;
            product.keyPrices['7_day'] = parseFloat(editProductPrice7DayInput.value.trim()) || 0;
            product.keyPrices['30_day'] = parseFloat(editProductPrice30DayInput.value.trim()) || 0;
            product.imageUrl = editProductImageURLInput.value.trim();
            product.downloaderLink = editProductDownloaderLinkInput.value.trim();
            product.instructionsLink = editProductInstructionsLinkInput.value.trim();
            product.status = editProductStatusSelect.value;
            product.description = editProductDescriptionInput.value.trim();


            // Basic validation for updated values
            if (isNaN(product.stock) || product.stock < 0 || isNaN(product.price) || product.price < 0) {
                showMessage('Please enter valid values for Stock and Base Price in the edit form.');
                return;
            }

            saveDataToLocalStorage();
            showMessage(`Product "${product.name}" updated successfully!`);
            productEditModal.classList.add('hidden'); // Hide modal
            renderTable(); // Re-render the table to show updated data
        });

        // Event listener for canceling edit in the modal
        cancelEditProductBtn.addEventListener('click', () => {
            productEditModal.classList.add('hidden'); // Hide modal
            currentEditingProductIndex = -1; // Reset index
        });

        // Dynamic image preview in modal
        editProductImageURLInput.addEventListener('input', () => {
            editProductImagePreview.src = editProductImageURLInput.value || 'https://placehold.co/120x80/374151/ffffff?text=Product';
        });

        renderTable(); // Initial render for products table
    };


    const renderResellersPage = () => {
        dynamicContentContainer.innerHTML = `
            <div class="flex-1 flex flex-col min-h-0 h-full px-4 py-4"> <!-- Added px-4 and py-4 -->
                <h1 class="text-3xl font-bold text-white mb-4">Manage Users</h1> <!-- Reduced mb-6 to mb-4 -->
                <div class="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col flex-1 min-h-0"> <!-- Reduced p-6 to p-4 -->
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
        dynamicContentContainer.innerHTML = '';

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

        // Body's flex properties are now static in CSS, no dynamic changes here
        // document.body.classList.add('flex', 'flex-row'); // REMOVED

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

        // Body's flex properties are now static in CSS, no dynamic changes here
        // document.body.classList.remove('flex', 'flex-row'); // REMOVED

        loginPasswordInput.value = ''; // Clear password on logout for security
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('loggedInUserRole');
        // The email field will be populated by the initialization logic
    };

    // --- Event Listeners ---

    registerBtn.addEventListener('click', () => {
        console.log('Register button clicked!'); // Debug log
        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();

        if (!email || !password) {
            showMessage('Please enter both email/username and password.');
            return;
        }

        if (dataStore.users.some(user => user.email === email)) {
            showMessage('User with this email/username already exists. Please login or or use a different email.');
            return;
        }

        dataStore.users.push({ email, password, role: 'reseller', balance: 0, orders: [] });
        saveDataToLocalStorage(); // Save users after registration
        showMessage('Registration successful! You can now log in.');
        loginEmailInput.value = '';
        loginPasswordInput.value = '';
    });

    loginBtn.addEventListener('click', () => {
        console.log('Login button clicked!'); // Debug log
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
                },
                imageUrl: 'https://placehold.co/120x80/374151/ffffff?text=ZeroDay', // Example image
                downloaderLink: 'https://example.com/zeroday-downloader',
                instructionsLink: 'https://example.com/zeroday-instructions',
                status: 'undetected', // Default status
                description: 'A powerful tool for various tasks.' // Default description
            },
            {
                name: 'Example Product (No API Keys)',
                stock: 10,
                price: 10.00,
                keyLinks: {}, // Empty object for products without API keys
                keyPrices: {},
                imageUrl: 'https://placehold.co/120x80/374151/ffffff?text=Example',
                downloaderLink: '',
                instructionsLink: '',
                status: 'detected', // Default status
                description: 'A simple example product without API key integration.' // Default description
            }
        );
        saveDataToLocalStorage();
    } else {
        console.log('Products already exist in localStorage, skipping default initialization.');
        // Ensure existing products have new fields, or add them with defaults
        dataStore.products.forEach(product => {
            if (product.imageUrl === undefined) product.imageUrl = 'https://placehold.co/120x80/374151/ffffff?text=Product';
            if (product.downloaderLink === undefined) product.downloaderLink = '';
            if (product.instructionsLink === undefined) product.instructionsLink = '';
            if (product.status === undefined) product.status = 'undetected'; // Default to undetected
            if (product.keyPrices === undefined) product.keyPrices = {}; // Ensure keyPrices exists
            if (product.keyLinks === undefined) product.keyLinks = {}; // Ensure keyLinks exists
            if (product.description === undefined) product.description = 'No description available.'; // Ensure description exists
        });
        saveDataToLocalStorage(); // Save any updates to existing products
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
        showLogin(); // Explicitly call showLogin at the end of DOMContentLoaded
    }
});
