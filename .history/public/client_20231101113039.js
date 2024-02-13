async function fetchFilterData() {
  try {
    const response = await axios.get("/api/filters"); // API endpoint for fetching filter data
    const filterData = response.data;

    let filterTemplate = document.querySelector("#filterTemplate");
    let filterTemplateInstance = Handlebars.compile(filterTemplate.innerHTML);
    let filterArea = document.getElementById("filterArea");

    if (filterArea) {
      let generatedHTML = filterTemplateInstance(filterData);
      filterArea.innerHTML = generatedHTML;

      attachFilterBoxEventListeners();
    }
  } catch (error) {
    console.error("API Error:", error);
  }
}
function toggleFilterOptions1(element) {
  const optionsList = element.querySelector(".filter-options");
  if (optionsList) {
    optionsList.classList.toggle("hidden");

    if (!optionsList.classList.contains("hidden")) {
      document.body.appendChild(optionsList);
    } else {
      element.appendChild(optionsList);
    }
  }
}



// JavaScript to change position via CSS
function toggleFilterOptions2(element) {
  const optionsList = element.querySelector(".filter-options");
  if (optionsList) {
    optionsList.classList.toggle("hidden");
    optionsList.classList.toggle("show-outside");
  }
}

function attachFilterBoxEventListeners() {
  const filterBoxes = document.querySelectorAll(".filter-box h3");
  filterBoxes.forEach((box) => {
    box.addEventListener("click", function () {
      const parentElement = this.parentElement;
      const currentOptionsList = parentElement.querySelector(".filter-options");

      // Hide all other filter options first
      document.querySelectorAll(".filter-options").forEach((el) => {
        if (el !== currentOptionsList) {
          el.classList.add("hidden");
          el.classList.remove("show-outside");
        }
      });

      // Then toggle the clicked filter options
      toggleFilterOptions2(parentElement); // Change this to toggleFilterOptions1 for the other method
    });
  });
}


let shoeListTemplateInstance;
let shoesElem;


function fetchShoes() {
  axios.get("/api/shoes")
    .then(function (response) {

      let shoeList = response.data.data;
      let generatedHTML = shoeListTemplateInstance({ shoeList: shoeList });
    
      shoesElem.innerHTML = generatedHTML;
   
      
    })
    .catch(function (error) {
      console.error("API Error:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  // Compile Handlebars template
  let shoeListTemplate = document.querySelector("#shoeListTemplate");
  if (shoeListTemplate) {
    // Continue with existing logic
    shoeListTemplateInstance = Handlebars.compile(shoeListTemplate.innerHTML);
    shoesElem = document.querySelector(".shoes");
    if (shoesElem) {
      fetchShoes();
    }
  } else {
    console.error("Handlebars template not found");
  }

  fetchFilterData();

  let currentFilters = {};

  // Function to handle filter button clicks
  // Function to handle filter button clicks
  function handleFilterButtonClick(event) {
    const filterType = event.target.getAttribute("data-filter");
    const filterValue = event.target.getAttribute("data-value");

    if (filterType && filterValue) {
      // Toggle currentFilters object
      if (currentFilters[filterType] === filterValue) {
        delete currentFilters[filterType]; // Remove filter if it's already selected
        event.target.classList.remove("active-filter"); // Remove active state
      } else {
        currentFilters[filterType] = filterValue; // Add filter otherwise
        event.target.classList.add("active-filter"); // Add active state
      }

      // Construct API endpoint based on all active filters
      let apiEndpoint = "/api/shoes/filtered";
      let queryParameters = new URLSearchParams(currentFilters).toString();
      if (queryParameters) {
        apiEndpoint += `?${queryParameters}`;
      }

      // Fetch filtered shoes
      fetchFilteredShoes(apiEndpoint);
    }
  }

  function fetchFilteredShoes(apiEndpoint) {
    axios
      .get(apiEndpoint)
      .then(function (response) {
        let shoeList = response.data.data;
        let generatedHTML = shoeListTemplateInstance({ shoeList: shoeList });
        shoesElem.innerHTML = generatedHTML;
      })
      .catch(function (error) {
        console.error("API Error:", error);
      });
  }

  // Attach event listeners to filter buttons
  const filterArea = document.getElementById("filterArea");
  if (filterArea) {
    filterArea.addEventListener("click", (event) => {
      if (event.target.classList.contains("filter-button")) {
        handleFilterButtonClick(event);
      }
    });
  }

  // signup
  const signupButton = document.querySelector("#signupButton");
  if (signupButton) {
    signupButton.addEventListener("click", () => {
      window.location.href = "/signup";
    });
  }

  // logout
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      window.location.href = "/logout";
    });
  }
  // login
  const loginButton = document.querySelector("#loginButton");
  if (loginButton) {
    loginButton.addEventListener("click", () => {
      window.location.href = "/login";
    });
  }


  const urlParams = new URLSearchParams(window.location.search);
  const user = urlParams.get('user');

  // Client-side JavaScript

  

//   cart

  let cart = {};

  async function fetchCartItems() {
    try {
      const userId = user;  // Make sure 'user' is defined or fetched from somewhere
  
      // Debugging: Log the user ID being fetched

  
      const response = await fetch(`/api/cart/items/${userId}`);
  
      // Debugging: Log the raw response text for tracing
   
  
      if (!response.ok) {
        console.log(`Error fetching cart items: ${response.status} - ${response.statusText}`);
        return;
      }
  
      const cartItems = await response.json();
  
      // Debugging: Log the parsed cart items
     
  
      for (let item of cartItems.data) {
        const stockResponse = await fetch(`/api/shoes/${item.shoe_id}`);
  
        // Check if the stockResponse is ok
        if (stockResponse.ok) {
          const stockData = await stockResponse.json();
  
          // Debugging: Log the stock data
        
  
          const available_stock = stockData.in_stock;  // assuming the stock number is in `in_stock` field
          
          if (!cart[item.shoe_id] || cart[item.shoe_id].quantity !== item.quantity) {
            cart[item.shoe_id] = {
              cart_id: item.cart_id,
              id: item.shoe_id,
              name: item.name,
              size: item.size,
              quantity: item.quantity,
              image_url: item.image_url,
              price: item.price,
              available_stock: available_stock  // Store available stock
            };
          }
        } else {
          console.log(`Error fetching stock for shoe_id: ${item.shoe_id}, Status: ${stockResponse.status}`);
        }
      }
  
      updateCartUI();
      updateTotalPrice();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  

  let clientCart = {};

  function showPopupMessage(message) {
    alert(message);  // Using a simple alert for demonstration, you can use a fancier UI
  }
  
  

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add_shoe_button")) {
      if (!user) {
        showPopupMessage("You cannot add to the cart until you are logged in.");
        return;  // Exit the function
      }
  
      const shoeId = event.target.getAttribute("data-id");
      const userId = user; // Assuming 'user' is the variable where you store the user ID
      
      // Check if the item is already in the cart
      if (cart[shoeId]) {
        // If it is, update the quantity
        updateQuantity(cart[shoeId].cart_id, 1);
      } else {
        // If it's not, add it to the cart
        fetch(`/api/shoes/${shoeId}`)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              console.log(`Error fetching shoe data: ${response.status} - ${response.statusText}`);
              throw new Error('Not a valid response');
            }
          })
          .then(shoe => {
            return addItemToCart(shoeId, 1, userId);  // Wait for this to complete
          })
          .then(() => {
            fetchShoes();  // Now re-fetch the list of shoes
          })
          .catch(error => console.error('An error occurred:', error));
      }
    }
  });
  
  
  

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("checkout_button")) {
    cart = {};
    updateCartUI();
  }
});

const cartModal = document.getElementById("cartModal");
const cartButton = document.querySelector(".cart_button");
const overlay = document.getElementById("overlay");  // Get the overlay element

cartButton.addEventListener("click", function (event) {
  event.stopPropagation();
  cartModal.classList.toggle("show");
  overlay.style.display = "block";  // Show the overlay when the modal opens
});

// Function to close the modal and hide the overlay
function closeOnOutsideClick(event) {
  const modal = document.getElementById("cartModal");
  modal.classList.remove("show");
  overlay.style.display = "none";  // Hide the overlay when the modal closes
}

// Stop propagation of click events within the modal content
cartModal.addEventListener("click", function (event) {
  event.stopPropagation();
});

// Attach the function to the 'click' event on the document body
document.body.addEventListener("click", closeOnOutsideClick);

// Initialize cart UI with items from the backend
fetchCartItems();


async function addItemToCart(shoeId, quantity, userId) {
  try {
    const response = await fetch(`/api/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ shoe_id: shoeId, quantity: quantity, user_id: userId })  // <-- note the change here
    });
    if (response.ok) {
      await fetchCartItems();  // Update cart items from the server
    }
  } catch (err) {
    console.error('Error adding item to cart:', err);
  }
}

async function updateCartUI() {
  // Filter out items with zero or negative quantity
  let cartItems = Object.values(cart).filter(item => item.quantity > 0);

  let cartTemplate = document.querySelector("#cartTemplate");
  if (cartTemplate) {
    let cartTemplateInstance = Handlebars.compile(cartTemplate.innerHTML);
    let generatedHTML = cartTemplateInstance({ cartItems });

    let cartItemsContainer = document.querySelector(".cart_list");
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = generatedHTML;
    } else {
      console.error("Cart items container not found");
    }
  } else {
    console.error("Cart template not found");
  }
}



async function updateQuantity(cartItemId, change) {

  let cartItem = null;

  // Find the cart item with the matching cart_id.
  for (const shoeId in cart) {
    if (cart[shoeId].cart_id === parseInt(cartItemId, 10)) {
      cartItem = cart[shoeId];
      break;
    }
  }

  // Debugging: Check if the cart item was found.
  if (cartItem) {

    const currentQuantity = cartItem.quantity;
    const updatedQuantity = currentQuantity + change;

    if (updatedQuantity > cartItem.available_stock) {
      alert("You can't add more items than what's available in stock!");
      return;
    }

    if (updatedQuantity <= 0) {
      const res = await fetch(`/api/cart/remove/${cartItemId}`, {
        method: 'DELETE'
      });
      
      // Check if the server-side removal was successful.
      if (res.ok) {
      
        // Make a fetch call to update available stock on the server.
        const stockResponse = await fetch(`/api/cart/updateQuantity`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cart_id: cartItemId, newQuantity: cartItem.available_stock + cartItem.quantity }),
        });
    
        if (stockResponse.ok) {
          console.log("Successfully updated stock on the server.");
        } else {
          console.error("Failed to update stock on the server.");
        }
    
        delete cart[cartItem.id];  // Remove from client-side cart
        await fetchCartItems();    // Refresh cart items from the server
        updateCartUI();            // Update the UI to reflect the changes
      } else {
        console.log('Failed to remove cart item');
      }
    }
    
     else {
      // Update the server-side cart.
      const response = await fetch(`/api/cart/updateQuantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart_id: cartItemId, newQuantity: updatedQuantity }),
      });

      // Debugging: Log the server response.
      if (response.ok) {
        console.log("Successfully updated quantity on the server.");
      } else {
        console.error("Failed to update quantity on the server.");
      }

      // Update the client-side cart.
      await fetchCartItems();
    }

    // Update the total price.
    updateTotalPrice();

    // Return the updated quantity for further handling.
    return updatedQuantity;

  } else {
    // Debugging: Log that the cart item was not found.
    console.error("Cart item not found for ID:", cartItemId);
    return null;  // Indicate that the cart item was not found.
  }
}



function updateTotalPrice() {
  let totalPrice = 0;
  for (const item of Object.values(cart)) {
    totalPrice += item.price * item.quantity;
  }
  document.getElementById("total_price").innerText = totalPrice;
}



document.querySelector(".cart_list").addEventListener("click", async function(event) {
  if (event.target.classList.contains("increment")) {
    const cartId = event.target.closest(".cart_item").getAttribute("data-cart-id");
    await updateQuantity(cartId, 1);
  }

  if (event.target.classList.contains("decrement")) {
    const cartId = event.target.closest(".cart_item").getAttribute("data-cart-id");
    const shoeId = event.target.closest(".cart_item").getAttribute("data-id");

    // Get the updated quantity
    const updatedQuantity = await updateQuantity(cartId, -1); 

    console.log(`Updated Quantity for Cart ID ${cartId}: ${updatedQuantity}`);

    if (updatedQuantity <= 0) {
      // Remove item from cart
      const res = await fetch(`/api/cart/remove/${cartId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        console.log(`Successfully removed cart item with ID ${cartId}`);
        // Update client-side cart
        delete clientCart[shoeId];
      } else {
        console.log('Failed to remove cart item');
      }

      // Update shoes and cart items
      await fetchShoes();
      await fetchCartItems();
    }
  }

  updateTotalPrice(); 
});




document.getElementById('checkoutButton').addEventListener('click', async function() {


  // Show a confirmation dialog
  const isConfirmed = window.confirm("Are you sure you want to proceed with the checkout?");

  // If the user confirms, proceed with the checkout process
  if (isConfirmed) {
    try {
      const userId = user;  // Assuming 'user' contains the user ID
      

      const response = await fetch(`/api/cart/checkout/${userId}`, {
        method: 'POST'
      });

      if (response.ok) {
        console.log('Checkout successful');
        cart = {};  // Clear the client-side cart object
        updateCartUI();  // Update the UI
        updateTotalPrice();  // Update the total price
        fetchShoes();
      } else {
        console.error(`Failed to checkout: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  } else {
    console.log("Checkout cancelled by the user.");
  }
});
});


document.addEventListener("DOMContentLoaded", async function() {
  const res = await fetch('/api/check-session');
  const data = await res.json();

  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');
  const signupButton = document.getElementById('signupButton');  
  const logoDisplay = document.getElementsByClassName('logo_container')

  if (data.loggedIn) {
    loginButton.style.display = 'none';
    logoutButton.style.display = 'block';
    signupButton.style.display = 'none';  // Hide the Signup button
    logoDisplay.style.marginright = "3em"
    onLoginSuccess(data.username);  // Update the UI with the username
  } else {
    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';
    signupButton.style.display = 'block';  // Show the Signup button
    onLogout();
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      window.location.href = "/logout";
      onLogout();
    });
  }
});

function onLoginSuccess(username) {
  document.getElementById('usernameDisplay').textContent = "Welcome " + username;
}

function onLogout() {
  document.getElementById('usernameDisplay').textContent = '';
}

