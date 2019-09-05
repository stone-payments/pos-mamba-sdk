// Not implemented
import Carousel from './Carousel.html';

const { newTestRoot } = global;

const root = newTestRoot();

const newCarousel = data =>
  root.createComponent(Carousel, { unique: true, data });

// eslint-disable-next-line
let carouselComp;

// check if there's images
// check methods

const getSlides = () => root.queryAll('.carousel-item');

it('Slides should return an object', () => {
  carouselComp = newCarousel();
  expect(typeof getSlides()).toBe('object');
});

it('Slides should has 6 images', () => {
  carouselComp = newCarousel();
  expect(Object.keys(getSlides()).length).toBe(5);
});

it('Should pass to next Slide', () => {
  carouselComp = newCarousel();
  expect(getSlides()._nextSlide()).toBe(5);
});

// it('should fire a change event when value is modified', () => {
//   carouselComp = newCarousel();
//   return new Promise(res => {
//     carouselComp.on('change', res);
//     getCheckboxNode().click();
//   });
// });

// it('should toggle its checked value', () => {
//   carouselComp = newCarousel();

//   carouselComp.toggle();

//   carouselComp.toggle(true);
//   expect(getCheckboxNode().checked).toBe(true);

//   carouselComp.toggle(false);
//   expect(getCheckboxNode().checked).toBe(false);

//   carouselComp.toggle(null);
//   expect(getCheckboxNode().checked).toBe(false);
// });
