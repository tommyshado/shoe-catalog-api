


document.addEventListener('DOMContentLoaded', function () {

    // Compile Handlebars template
    let shoeListTemplate = document.querySelector('#shoeListTemplate');
    if (!shoeListTemplate) {
        console.error('Handlebars template not found');
        return;
    }
    let shoeListTemplateInstance = Handlebars.compile(shoeListTemplate.innerHTML);

    let shoesElem = document.querySelector('.shoes');
    if (!shoesElem) {
        console.error('Target element not found');
        return;
    }

    // Fetch the shoes from the API
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


    document.querySelector("#signupButton").addEventListener("click", () => {
        window.location.href = "/signup";
    });
    
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        window.location.href = '/logout';
      });
    }


    document.querySelector("#loginButton").addEventListener("click", () => {
        window.location.href = "/login";
      });


});
