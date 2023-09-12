

document.addEventListener('DOMContentLoaded', function () {
    let shoeListTemplate = document.querySelector('.shoeListTemplate');
    let shoeListTemplateInstance = Handlebars.compile(shoeListTemplate.innerHTML);
    let shoesElem = document.querySelector('.shoes');

    // Client-side factory function
    function ShoeService() {
        function getShoes() {
            return axios.get('/api/shoes');
        }
        
        return {
            getShoes
        }
    }

    let shoeService = ShoeService();

    function showShoes() {
        shoeService
            .getShoes()
            .then(function (results) {
                let response = results.data;
                let data = response.data;
                let html = shoeListTemplateInstance({
                    shoeList: data
                });
                shoesElem.innerHTML = html;
            });
    }

    showShoes();
});
