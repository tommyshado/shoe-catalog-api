document.addEventListener('DOMContentLoaded', function () {
  

    const form = document.getElementById('addShoeForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: form.name.value.trim(),
                brand: form.brand.value.trim(),
                size: parseInt(form.size.value.trim()),
                color: form.color.value.trim(),
                price: parseFloat(form.price.value.trim()),
                in_stock: parseInt(form.in_stock.value.trim()),
                image_url: form.image_url.value.trim()
            };
            
            try {
                const response = await fetch('/api/shoes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
        
                if (response.ok) {
                    alert('Shoe added successfully!');
                    form.reset();
                    window.location.href = '/';
                } else {
                    const data = await response.json();
                    alert('Error: ' + data.error);
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        });
    }
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/auth/logout', {
                    method: 'POST'
                });
                
                if (response.ok) {
                    window.location.href = '/';
                } else {
                    alert('Error logging out');
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        });
    }
});
