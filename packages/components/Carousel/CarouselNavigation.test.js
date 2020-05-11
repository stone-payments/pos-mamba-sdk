// Not implemented
import CarouselNavigation from './CarouselNavigation.html';

const { newTestRoot } = global;

const root = newTestRoot();

const newCarousel = data =>
  root.createComponent(CarouselNavigation, { unique: true, data });

// eslint-disable-next-line
let carouselComp;

const getSlides = () => root.queryAll('.carousel-item');

it('Slides should return an object', () => {
  expect(typeof getSlides()).toBe('object');
});

it('Slides should has 5 images', () => {
  carouselComp = newCarousel();
  expect(Object.keys(getSlides()).length).toBe(5);
});

it('Should pass to next Slide', () => {
  carouselComp = newCarousel({ count: 0 });
  carouselComp._nextSlide();
  expect(carouselComp.get().count).toBe(1);
});

it('Should pass to previous Slide', () => {
  carouselComp = newCarousel({ count: 0 });
  carouselComp._previousSlide();
  expect(carouselComp.get().count).toBe(4);
});
