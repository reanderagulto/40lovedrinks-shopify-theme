(function(w, d) {
  productSlider = () => {
    const slider = d.querySelector("#product-slider");
    if (slider) {
      const splideContainer = new Splide("#product-slider", {
        type: "loop",
        perPage: 3,
        gap: "40px",
        autoplay: false,
        pagination: false,
        arrows: false,
        breakpoints: {
          991: {
            perPage: 2,
            gap: "16px"
          },
          430: {
            perPage: 1,
            gap: "0px"
          }
        }
      }).mount();
      const arrows = document.querySelectorAll(".product-slider__arrow");
      if (!arrows.length) {
        console.warn("No custom arrows found");
        return;
      }
      arrows.forEach((arrow) => {
        arrow.addEventListener("click", () => {
          const direction = arrow.dataset.id;
          console.log(`Arrow Direction ${direction}`);
          splideContainer.go(direction);
        });
      });
    }
  };
  plyrIO = () => {
    const videoPlayer = document.querySelector("#video-player");
    if (videoPlayer) {
      const player = new Plyr("#video-player", {
        autoplay: true,
        controls: [],
        settings: ["loop"]
      });
      player.play();
    }
  };
  testimonials = () => {
    const slider = d.querySelector("#testimonials");
    if (slider) {
      console.log("Testimonial Slider");
      const splideContainer = new Splide("#testimonials", {
        type: "loop",
        perPage: 6,
        gap: "16px",
        autoplay: false,
        pagination: false,
        arrows: false,
        breakpoints: {
          991: { perPage: 3 },
          430: { perPage: 2 }
        }
      }).mount();
      const arrows = document.querySelectorAll(".testimonials__slider--arrow");
      if (!arrows.length) {
        console.warn("No custom arrows found");
        return;
      }
      arrows.forEach((arrow) => {
        arrow.addEventListener("click", () => {
          const direction = arrow.dataset.direction;
          console.log(`Arrow Direction ${direction}`);
          splideContainer.go(direction);
        });
      });
    }
  };
  document.addEventListener("DOMContentLoaded", function() {
    productSlider();
    testimonials();
    plyrIO();
  });
})(window, document);
