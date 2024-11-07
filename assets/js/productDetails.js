// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC63fKcQygMGxuaekB3LUhLHBrtePlgorc",
    authDomain: "plasware-pr.firebaseapp.com",
    projectId: "plasware-pr",
    storageBucket: "plasware-pr.appspot.com",
    messagingSenderId: "754561855795",
    appId: "1:754561855795:web:53001379d46a303ba0ce46",
    measurementId: "G-T4YEG16RDC"
};

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to get product details based on shopId
async function getProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const shopId = urlParams.get('shopId'); // Get the shopId from URL

    if (!shopId) {
        console.error("No shopId found in URL.");
        return;
    }

    try {
        const productRef = doc(db, 'shopLocations', shopId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
            const productData = productSnap.data();
            displayProductDetails(productData);
        } else {
            console.error("No product found for shopId:", shopId);
        }
    } catch (error) {
        console.error("Error fetching product details:", error);
    }
}

// Function to handle 'Buy Now' button click
window.handleBuyNowButton = function(sellerPhone) {
    const whatsappUrl = `https://wa.me/${sellerPhone}`;
    const timeoutDuration = 1000; // Time to wait before showing the phone number as a fallback

    // Try opening WhatsApp using an iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = whatsappUrl;
    document.body.appendChild(iframe);

    // Fallback to showing the phone number if WhatsApp isn't detected
    setTimeout(() => {
        document.body.removeChild(iframe);
        alert(`WhatsApp not detected. You can contact the seller directly at: ${sellerPhone}`);
    }, timeoutDuration);
}


// Function to display product details on the page
function displayProductDetails(product) {
    const productDetailsContainer = document.querySelector('.product-details');
    const productHTML = `
        <img src="${product.imageUrl}" alt="${product.productName}">
        <h1>${product.productName}</h1>
        <p class="price">$${product.productPrice}</p>
        <button onclick="handleBuyNowButton('${product.sellerPhone}')">Buy Now</button>
        <p>${product.productDescription}</p>
        <h5>Shop Address: ${product.fullAddress}</h5> <br>
        <button onclick="window.history.back()">Go Back</button>
    `;
    productDetailsContainer.innerHTML = productHTML;
}

// Call the function to get product details on page load
getProductDetails();