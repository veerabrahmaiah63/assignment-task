
 document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const categoryFilter = document.getElementById("category");
    const navLinks = document.querySelectorAll(".nav a");
    const loadMoreBtn = document.getElementById("load-more");
    const loadingIndicator = document.getElementById("loading");
    const searchInput = document.getElementById("search");
    const sortSelect = document.getElementById("sort");

    let allProducts = []; 
    let filteredProducts = [];
    let displayedProducts = 0;
    const PRODUCTS_PER_PAGE = 10; // Load 10 products at a time

    // Fetch products from API
    async function fetchProducts() {
        try {
            loadingIndicator.style.display = "block";
            const response = await fetch("https://fakestoreapi.com/products");
            const data = await response.json();
            allProducts = data;
            filteredProducts = [...allProducts]; 
            populateCategoryFilter();
            displayProducts();
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            loadingIndicator.style.display = "none";
        }
    }

    
    function displayProducts() {
        const productsToShow = filteredProducts.slice(displayedProducts, displayedProducts + PRODUCTS_PER_PAGE);
        productsToShow.forEach(product => {
            const productItem = document.createElement("div");
            productItem.classList.add("product");
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
            `;
            productList.appendChild(productItem);
        });

        displayedProducts += PRODUCTS_PER_PAGE;
        loadMoreBtn.style.display = displayedProducts >= filteredProducts.length ? "none" : "block";
    }

   
    function populateCategoryFilter() {
        const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
        uniqueCategories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        });
    }

 
    function filterByCategory(category) {
        productList.innerHTML = "";
        displayedProducts = 0;
        filteredProducts = category ? allProducts.filter(p => p.category === category) : [...allProducts];
        displayProducts();
    }

    
    navLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const category = event.target.getAttribute("data-category");

            // If "Gold" is clicked, show no results (or custom logic)
            if (category === "Gold") {
                productList.innerHTML = "<p>No products found in Gold category.</p>";
                loadMoreBtn.style.display = "none";
                return;
            }

            categoryFilter.value = category || "";
            filterByCategory(category);
            document.getElementById("product-list").scrollIntoView({ behavior: "smooth" });
        });
    });

  
    categoryFilter.addEventListener("change", (event) => {
        filterByCategory(event.target.value);
    });

    sortSelect.addEventListener("change", () => {
        if (sortSelect.value === "asc") {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortSelect.value === "desc") {
            filteredProducts.sort((a, b) => b.price - a.price);
        }
        productList.innerHTML = "";
        displayedProducts = 0;
        displayProducts();
    });

   
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredProducts = allProducts.filter(product => product.category.toLowerCase().includes(searchTerm));
        productList.innerHTML = "";
        displayedProducts = 0;
        displayProducts();
    });

  
    loadMoreBtn.addEventListener("click", () => {
        displayProducts();
    });

    // Fetch and display products on page load
    fetchProducts();
});
