async function fetchFilterData() {
    try {
        const response = await axios.get('/api/filters'); // API endpoint for fetching filter data
        const filterData = response.data;

  
        let filterTemplate = document.querySelector('#filterTemplate');
        let filterTemplateInstance = Handlebars.compile(filterTemplate.innerHTML);
        let filterArea = document.getElementById('filterArea');
        
        if (filterArea) {
            let generatedHTML = filterTemplateInstance(filterData);
            filterArea.innerHTML = generatedHTML;

            allowSingleFilterSelection();

            // Debugging: Directly add click event to filter buttons
            let filterButtons = document.querySelectorAll('.filter-button');
            

            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
            
                });
            });
        }
    } catch (error) {
        console.error('API Error:', error);
    }
}
function toggleFilterOptions1(element) {
    const optionsList = element.querySelector('.filter-options');
    if (optionsList) {
        optionsList.classList.toggle('hidden');
        
        if (!optionsList.classList.contains('hidden')) {
            document.body.appendChild(optionsList);
        } else {
            element.appendChild(optionsList);
        }
    }
}

// JavaScript to change position via CSS
function toggleFilterOptions2(element) {
    const optionsList = element.querySelector('.filter-options');
    if (optionsList) {
        optionsList.classList.toggle('hidden');
        optionsList.classList.toggle('show-outside');
    }
}

function attachFilterBoxEventListeners() {
    const filterBoxes = document.querySelectorAll('.filter-box h3');
    filterBoxes.forEach(box => {
        box.addEventListener('click', function() {
            toggleFilterOptions2(this.parentElement); // Change this to toggleFilterOptions1 for the other method
        });
    });
}


document.addEventListener('DOMContentLoaded', function () {



    // Compile Handlebars template
    let shoeListTemplate = document.querySelector('#shoeListTemplate');
    if (shoeListTemplate) {
        // Continue with existing logic
        let shoeListTemplateInstance = Handlebars.compile(shoeListTemplate.innerHTML);
        let shoesElem = document.querySelector('.shoes');
        if (shoesElem) {
            function fetchShoes() {
                axios.get('/api/shoes')
                .then(function (response) {
                    let shoeList = response.data.data;  
                    let generatedHTML = shoeListTemplateInstance({ shoeList: shoeList });
                    shoesElem.innerHTML = generatedHTML;
                })
                .catch(function (error) {
                    console.error('API Error:', error);
                });
            }
            fetchShoes();
        }
    } else {
        console.error('Handlebars template not found');
    }

    
    fetchFilterData();


    // setTimeout(() => {
    //     let filterButtons = document.querySelectorAll('.filter-button');
    //     console.log("Direct event listeners attached to", filterButtons.length, "filter buttons");
    
    //     filterButtons.forEach(button => {
    //       button.addEventListener('click', function() {
    //         console.log("Direct filter button clicked:", this);
    //       });
    //     });
    //   }, 1000);  


    // Function to handle filter button clicks
  function handleFilterButtonClick(event) {
    const filterType = event.target.getAttribute('data-filter');
    const filterValue = event.target.getAttribute('data-value');
    if (filterType && filterValue) {
      let apiEndpoint = `/api/shoes/${filterType}/${filterValue}`;
      fetchFilteredShoes(apiEndpoint);
    }
  }

  // Attach event listeners to filter buttons
  const filterArea = document.getElementById('filterArea');
  if (filterArea) {
    filterArea.addEventListener('click', (event) => {
      if (event.target.classList.contains('filter-button')) {
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
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            window.location.href = '/logout';
        });
    }
// login
    const loginButton = document.querySelector("#loginButton");
    if (loginButton) {
        loginButton.addEventListener("click", () => {
            window.location.href = "/login";
        });
    }


});

function allowSingleFilterSelection() {
    let filterBoxes = document.querySelectorAll('.filter-box');
    
    console.log("Event listeners attached to", filterBoxes.length, "filter boxes");
  
    filterBoxes.forEach(box => {
      box.addEventListener('click', function(event) {
        console.log("Filter box clicked.");

        // Hide all other filter options and remove their 'selected' class
        document.querySelectorAll('.filter-options').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('selected'));
  
        // If the clicked element is a filter-button, proceed
        if (event.target.classList.contains('filter-button')) {
          console.log("Filter button clicked:", event.target);

          // Stop propagation to ensure the click event doesn't bubble up
          event.stopPropagation();

          // Show the filter options related to the clicked button
          const optionsList = box.querySelector('.filter-options');
          optionsList.classList.remove('hidden');
          optionsList.classList.add('show-outside');

          // Add the 'selected' class to the clicked button
          event.target.classList.add('selected');
        }
      });
    });
}

  