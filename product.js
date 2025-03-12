
 document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const categoryFilter = document.getElementById("category");
    const navLinks = document.querySelectorAll(".nav a");
    const loadMoreBtn = document.getElementById("load-more");
    const loadingIndicator = document.getElementById("loading");
    const searchInput = document.getElementById("search");
    const sortSelect = document.getElementById("sort");

    let allProducts = []; // Store all products from API
    let filteredProducts = []; // Store filtered products
    let displayedProducts = 0;
    const PRODUCTS_PER_PAGE = 10; // Load 10 products at a time

    // ✅ Fetch products from API
    async function fetchProducts() {
        try {
            loadingIndicator.style.display = "block";
            const response = await fetch("https://fakestoreapi.com/products");
            const data = await response.json();
            allProducts = data;
            filteredProducts = [...allProducts]; // Initially, show all products
            populateCategoryFilter();
            displayProducts();
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            loadingIndicator.style.display = "none";
        }
    }

    // ✅ Display products in batches
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

    // ✅ Populate category filter dropdown
    function populateCategoryFilter() {
        const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
        uniqueCategories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        });
    }

    // ✅ Filter products by category
    function filterByCategory(category) {
        productList.innerHTML = "";
        displayedProducts = 0;
        filteredProducts = category ? allProducts.filter(p => p.category === category) : [...allProducts];
        displayProducts();
    }

    // ✅ Handle navigation clicks (including "Gold")
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

    // ✅ Handle category dropdown change
    categoryFilter.addEventListener("change", (event) => {
        filterByCategory(event.target.value);
    });

    // ✅ Handle sorting by price
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

    // ✅ Handle search functionality
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredProducts = allProducts.filter(product => product.category.toLowerCase().includes(searchTerm));
        productList.innerHTML = "";
        displayedProducts = 0;
        displayProducts();
    });

    // ✅ Load more products when button is clicked
    loadMoreBtn.addEventListener("click", () => {
        displayProducts();
    });

    // Fetch and display products on page load
    fetchProducts();
});
