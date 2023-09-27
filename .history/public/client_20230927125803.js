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
      // Hide all other filter options first
      document.querySelectorAll(".filter-options").forEach((el) => {
        el.classList.add("hidden");
        el.classList.remove("show-outside");
      });

      // Then toggle the clicked filter options
      toggleFilterOptions2(this.parentElement); // Change this to toggleFilterOptions1 for the other method
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
      const userId = user;
    
      const response = await fetch(`/api/cart/items/${userId}`);
    
      if (!response.ok) {
        console.log(`Error fetching cart items: ${response.status} - ${response.statusText}`);
        return;
      }
    
      const cartItems = await response.json();


    
      for (let item of cartItems.data) {
        if (!cart[item.shoe_id] || cart[item.shoe_id].quantity !== item.quantity) {
          cart[item.shoe_id] = {
            cart_id: item.cart_id,
            id: item.shoe_id,
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            image_url: item.image_url,
            price: item.price
          };
        }
      }
      updateCartUI();
      updateTotalPrice();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  let clientCart = {};

  

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add_shoe_button")) {
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
  // Debugging logs for tracing.
  console.log("Received Cart ID:", cartItemId);
  console.log("Change:", change);
  console.log("Current Cart:", cart);

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
    console.log("Cart Item Found:", cartItem);

    const currentQuantity = cartItem.quantity;
    const updatedQuantity = currentQuantity + change;

    // Debugging: Log the updated quantity.
    console.log("Updated Quantity:", updatedQuantity);

    if (updatedQuantity <= 0) {
      // Debugging: Item will be removed.
      console.log("Removing item as updated quantity is <= 0");

      const res = await fetch(`/api/cart/remove/${cartItemId}`, {
        method: 'DELETE'
      });

      // Check if the server-side removal was successful.
      if (res.ok) {
        console.log(`Successfully removed cart item with ID ${cartItemId}`);
      } else {
        console.log('Failed to remove cart item');
      }

      // Remove from the client-side cart.
      delete cart[cartItem.id];

      // Fetch the updated list of shoes.
      await fetchShoes();
    } else {
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

  updateTotalPrice(); // Assuming this is not async
});




document.getElementById('checkoutButton').addEventListener('click', async function() {
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
    } else {
      console.error(`Failed to checkout: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
});



});



document.addEventListener("DOMContentLoaded", async function() {
    const res = await fetch('/api/check-session');
  
    const data = await res.json();
    
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton'); // Assuming you have added this button in your HTML
  
    // Toggle display of login and logout buttons based on session status
    if (data.loggedIn) {
      loginButton.style.display = 'none';
      logoutButton.style.display = 'block';
    } else {
      loginButton.style.display = 'block';
      logoutButton.style.display = 'none';
    }
  
    // Attach click event to logout button
    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        window.location.href = "/logout";
      });
    }
  });
