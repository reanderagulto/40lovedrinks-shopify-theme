(function (w, d){
    
    function productSlider(){
        const slider = d.querySelector('#product-slider');
        if(slider) {
            const splideContainer = new Splide('#product-slider', {
                type: 'loop', 
                perPage: 3, 
                gap: '40px',
                autoplay: false,
                pagination: false,
                arrows: false,
                breakpoints: {
                    991: {
                        perPage: 2, 
                        gap: '16px'
                    }, 
                    430: {
                        perPage: 1,
                        gap: '0px'
                    }
                }
            }).mount();

            const arrows = document.querySelectorAll('.product-slider__arrow');
            if (!arrows.length) {
                console.warn('No custom arrows found');
                return;
            }

            arrows.forEach(arrow => {
                arrow.addEventListener('click', () => {
                    const direction = arrow.dataset.id; // "<" or ">"
                    console.log(`Arrow Direction ${direction}`);
                    splideContainer.go(direction);
                });
            });
        }        
    }

    document.addEventListener('DOMContentLoaded', function() {
        productSlider();
    });
    
})(window, document);