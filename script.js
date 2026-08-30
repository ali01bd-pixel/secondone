const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');

    burger.addEventListener('click', () => {
        // Toggle the Navigation Menu
        nav.classList.toggle('nav-active');

        // Animate the Burger Icon into an 'X'
        burger.classList.toggle('toggle');
    });
};

// Initialize the function
navSlide();