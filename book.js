document.addEventListener('DOMContentLoaded', function() {
    // Calculate font sizes based on window width
    var winWidth = window.innerWidth;
    var ratio = winWidth / 1920;
    var fontSize = {
        small: Math.max(12 * ratio, 7),
        medium: Math.max(14 * ratio, 10)
    };
    var posX = Math.max(80 * ratio, 30);

    // Initialize Vara instances
    var vara = [];
    var played = [false, false, false, false, false, false, false, false, false];

    // Define page contents
    const pageContents = [
        {
            text: "15 Jan 2019",
            paragraph: "Start the year with something cool. Looking forward to new adventures."
        },
        {
            text: "16 Jan 2019",
            paragraph: "Every day brings something new. Capturing moments as they come."
        },
        {
            text: "17 Jan 2019",
            paragraph: "Making memories one day at a time. Life is beautiful."
        },
        {
            text: "18 Jan 2019",
            paragraph: "Simple moments become precious memories. Cherishing each day."
        },
        {
            text: "19 Jan 2019",
            paragraph: "Finding beauty in everyday moments. Time flies so fast."
        },
        {
            text: "20 Jan 2019",
            paragraph: "Living life to the fullest. Each moment counts."
        },
        {
            text: "21 Jan 2019",
            paragraph: "Creating memories that last forever. Grateful for everything."
        },
        {
            text: "22 Jan 2019",
            paragraph: "Final thoughts of this journey. What a wonderful time."
        },
        {
            text: "A Special Question",
            paragraph: "Will you be my Valentine?"
        }
    ];

    // Create Vara instances for each page
    for (let i = 0; i < 9; i++) {
        vara[i] = new Vara(
            `#vara-container${i + 1}`,
            "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json",
            [
                {
                    text: pageContents[i].text,
                    textAlign: "right",
                    y: 0,
                    x: -30,
                    delay: 0,
                    duration: 1000,
                    fontSize: fontSize.small
                },
                {
                    text: pageContents[i].paragraph,
                    y: 20,
                    x: posX,
                    delay: 800,
                    duration: 1500,
                    fontSize: fontSize.small
                }
            ],
            {
                strokeWidth: 2,
                fontSize: fontSize.medium,
                autoAnimation: false
            }
        );
    }

    // Initialize page turning functionality
    vara[8].ready(function() {
        const book = document.getElementById('book');
        const papers = Array.from(document.querySelectorAll('.paper'));
        let currentPage = 0;
        let hasAnswered = false;

        // Function to update z-indices
        function updateZIndices() {
            papers.forEach(paper => {
                const pageNum = parseInt(paper.dataset.page);
                if (paper.classList.contains('open')) {
                    paper.style.zIndex = pageNum + 1;
                } else {
                    paper.style.zIndex = 10 - pageNum;
                }
            });
        }

        // Function to play animation
        function playAnimation(pageIndex) {
            if (pageIndex >= 0 && pageIndex < vara.length) {
                vara[pageIndex].animationEnd();
                vara[pageIndex].playAll();
            }
        }

        // Function to check if pages are open
        function areNextPagesOpen(currentIndex) {
            return papers.some((paper, index) => {
                return index > currentIndex && paper.classList.contains('open');
            });
        }

        // Function to move No button with minimal movement
        function moveNoButton(button) {
            const currentRect = button.getBoundingClientRect();
            const moveDistance = 0.3; // Maximum 0.3 pixels movement in any direction
            
            // Get viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Get current position
            const currentX = currentRect.left;
            const currentY = currentRect.top;
            
            // Generate random movement between -0.3 and 0.3 pixels
            const deltaX = (Math.random() * 2 - 1) * moveDistance;
            const deltaY = (Math.random() * 2 - 1) * moveDistance;
            
            // Calculate new position
            let newX = currentX + deltaX;
            let newY = currentY + deltaY;
            
            // Ensure button stays within viewport bounds with padding
            const padding = 10;
            newX = Math.max(padding, Math.min(newX, viewportWidth - currentRect.width - padding));
            newY = Math.max(padding, Math.min(newY, viewportHeight - currentRect.height - padding));
            
            // Add very small random rotation (-2 to 2 degrees)
            const currentRotation = getComputedStyle(button).transform;
            const currentAngle = currentRotation !== 'none' 
                ? parseFloat(currentRotation.split('(')[1].split('deg')[0]) || 0 
                : 0;
            const deltaRotation = (Math.random() * 4 - 2); // Random angle between -2 and 2 degrees
            const newRotation = currentAngle + deltaRotation;

            // Apply new position and rotation
            button.style.position = 'fixed';
            button.style.left = `${newX}px`;
            button.style.top = `${newY}px`;
            button.style.transform = `rotate(${newRotation}deg)`;
        }

        // Function to handle Valentine's response
        function handleValentineResponse(response) {
            if (hasAnswered) return;
            
            const yesButton = document.querySelector('.yes-button');
            const noButton = document.querySelector('.no-button');
            
            if (response === 'yes') {
                yesButton.classList.add('selected');
                noButton.style.opacity = '0.5';
                hasAnswered = true;
                
                setTimeout(() => {
                    window.location.href = 'https://www.google.com';
                }, 1000);
            }
        }

        // Handle clicking front of pages
        document.querySelectorAll('.front:not(.last)').forEach(function(frontPage) {
            frontPage.addEventListener('click', function(e) {
                if (e.target.tagName.toLowerCase() === 'img' || 
                    e.target.classList.contains('polaroid-button')) return;

                const paper = this.parentElement;
                const pageIndex = parseInt(paper.dataset.page);

                book.classList.add('open');
                papers.forEach(p => {
                    const pIndex = parseInt(p.dataset.page);
                    if (pIndex > pageIndex) {
                        p.classList.remove('open');
                    }
                });

                paper.classList.add('open');
                playAnimation(pageIndex);
                updateZIndices();
            });
        });

        // Handle clicking back of pages
        document.querySelectorAll('.back').forEach(function(backPage) {
            backPage.addEventListener('click', function() {
                const paper = this.parentElement;
                const pageIndex = parseInt(paper.dataset.page);

                paper.classList.remove('open');
                if (pageIndex > 0) {
                    playAnimation(pageIndex - 1);
                }

                if (pageIndex === 0 && !areNextPagesOpen(pageIndex)) {
                    book.classList.remove('open');
                }

                updateZIndices();
            });
        });

        // Initialize Valentine's buttons
        const yesButton = document.querySelector('.yes-button');
        const noButton = document.querySelector('.no-button');

        if (yesButton && noButton) {
            yesButton.addEventListener('click', (e) => {
                e.stopPropagation();
                handleValentineResponse('yes');
            });

            noButton.addEventListener('click', function(e) {
                e.stopPropagation();
                if (!hasAnswered) {
                    moveNoButton(this);
                }
            });
        }

        // Modal functionality
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.querySelector('.modal-caption');
        let isModalOpen = false;

        function openModal(imgSrc, caption) {
            modalImg.src = imgSrc;
            modalCaption.textContent = caption;
            modal.classList.add('show');
            isModalOpen = true;
        }

        function closeModal() {
            modal.classList.remove('show');
            isModalOpen = false;
            setTimeout(() => {
                modalImg.src = '';
            }, 300);
        }

        // Handle image clicks
        document.querySelectorAll('.polaroid img').forEach(img => {
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                const polaroid = this.closest('.polaroid');
                const caption = polaroid.querySelector('.caption').textContent;
                openModal(this.src, caption);
            });
        });

        // Close modal on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('modal-content')) {
                closeModal();
            }
        });

        // Close modal with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isModalOpen) {
                closeModal();
            }
        });

        // Initial setup
        updateZIndices();
    });
});