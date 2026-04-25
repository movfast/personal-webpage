// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// Scroll fade-in animation using Intersection Observer
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => observer.observe(el));

// Show More — hides items beyond data-show-more count, adds buttons
document.querySelectorAll('[data-show-more]').forEach(grid => {
    const limit = parseInt(grid.dataset.showMore, 10);
    const fullPage = grid.dataset.fullPage;
    const children = Array.from(grid.children);

    if (children.length <= limit) return;

    // Hide overflow items
    children.forEach((child, i) => {
        if (i >= limit) child.classList.add('show-more-hidden');
    });

    // Create button wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'show-more-wrapper';

    // "Show more" button (expands inline)
    const showBtn = document.createElement('button');
    showBtn.className = 'btn btn-outline';
    showBtn.textContent = `Show More (${children.length - limit} more)`;
    let expanded = false;

    showBtn.addEventListener('click', () => {
        expanded = !expanded;
        children.forEach((child, i) => {
            if (i >= limit) {
                child.classList.toggle('show-more-hidden', !expanded);
            }
        });
        showBtn.textContent = expanded
            ? 'Show Less'
            : `Show More (${children.length - limit} more)`;
    });
    wrapper.appendChild(showBtn);

    // "View all" link (goes to dedicated page)
    if (fullPage) {
        const viewAll = document.createElement('a');
        viewAll.className = 'btn btn-primary';
        viewAll.href = fullPage;
        viewAll.textContent = 'View All';
        wrapper.appendChild(viewAll);
    }

    grid.parentNode.insertBefore(wrapper, grid.nextSibling);
});

// Projects carousel: counter + progress bar
const projectsCarousel = document.querySelector('.projects-carousel');
const projectsCounter = document.querySelector('.projects-counter');
const projectsProgressFill = document.querySelector('.projects-progress-fill');
if (projectsCarousel && projectsCounter && projectsProgressFill) {
    const cards = projectsCarousel.querySelectorAll('.project-card');
    const total = cards.length;
    const pad = (n) => String(n).padStart(2, '0');
    const updateCarousel = () => {
        const maxScroll = projectsCarousel.scrollWidth - projectsCarousel.clientWidth;
        const ratio = maxScroll > 0 ? projectsCarousel.scrollLeft / maxScroll : 0;
        projectsProgressFill.style.width = `${ratio * 100}%`;
        const center = projectsCarousel.scrollLeft + projectsCarousel.clientWidth / 2;
        let activeIdx = 0;
        let minDist = Infinity;
        cards.forEach((card, i) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const dist = Math.abs(cardCenter - center);
            if (dist < minDist) { minDist = dist; activeIdx = i; }
        });
        projectsCounter.textContent = `${pad(activeIdx + 1)} / ${pad(total)}`;
    };
    projectsCarousel.addEventListener('scroll', updateCarousel, { passive: true });
    window.addEventListener('resize', updateCarousel);
    updateCarousel();
}
