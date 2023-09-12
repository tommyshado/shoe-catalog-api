

document.addEventListener('DOMContentLoaded', function () {

    // Compile Handlebars template
    let shoeListTemplate = document.querySelector('#shoeListTemplate');
    let shoeListTemplateInstance = Handlebars.compile(shoeListTemplate.innerHTML);

    let shoesElem = document.querySelector('.shoes');

    // Fetch the shoes from the API
    function fetchShoes() {
        axios.get('/api/shoes')
            .then(function (response) {
                // Handle the response data
                let shoes = response.data;
                let shoeHTML = shoeListTemplateInstance({ shoeList: shoes });
                shoesElem.innerHTML = shoeHTML;
            })
            .catch(function (error) {
                console.error('Error fetching the shoes:', error);
            });
    }

    // Fetch the shoes when the page loads
    fetchShoes();
});
