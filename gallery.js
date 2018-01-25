import imagesService from './image-service';
import CarouselGesture from './carousel-gesture';
import { PI180 } from './utility';

class Gallery {
  constructor(imagesService, carouselGesture, carouseArea, topImageID) {
    this.fetchImageUrls = imagesService;
    carouselGesture.addEndEventListener(this.setTopDivStyle.bind(this));
    carouselGesture.addMoveEventListener(this.moveImage.bind(this));

    this.initElements(carouseArea, topImageID);
    this.initProperties();

    this.fetchImageUrls(++this.fectchPageIndex, (imgs, loadedImageNum) => {
      this.imgs = this.imgs.concat(imgs);

      this.updateImagesSrc(this.imgs);
    });
  }

  initProperties() {
    this.imgs = [];
    this.imagesOnFetching = 0;
    this.fectchPageIndex = 0;
    this.fetchImagesLessThan = 10;
    this.imageMoveRate = 3;

    this.numImagesPreLoaed = this.eleImages.length;
    this.expectImageWidth = this.topDiv.clientHeight * 0.5;
  }

  initElements(carouseAreaID, topImageID) {
    this.topDiv = document.querySelector(topImageID);
    // `document.querySelectorAll` is JUST an Array like object
    this.eleImages = [...document.querySelectorAll(`${carouseAreaID} img`)];
  }

  setTopDivStyle(marginLeft = 0, opacity = 1) {
    this.topDiv.setAttribute(
      'style',
      `
    margin-left: ${marginLeft}px;
    opacity: ${opacity};
    `
    );
  }

  updateImagesSrc(imgs, loadedImageNum = 0) {
    // console.log('updateImagesSrc');
    this.eleImages.forEach((img, index) => {
      img.setAttribute(
        'src',
        `${imgs[this.numImagesPreLoaed - index - 1 + loadedImageNum]}`
      );
    });
  }

  moveImage(angleSum) {
    angleSum *= this.imageMoveRate;
    var curOneRoundOfPercent = (angleSum % (2 * PI180)) / 2 / PI180;
    console.log(angleSum, curOneRoundOfPercent);
    this.setTopDivStyle(
      `${curOneRoundOfPercent * this.expectImageWidth}`,
      `${1 - curOneRoundOfPercent}`
    );
    // console.log(curOneRoundOfPercent);
    if (curOneRoundOfPercent < 0.1 || curOneRoundOfPercent > 0.9) {
      this.updateImagesSrc(this.imgs, ~~(angleSum / 2 / PI180));
      this.tryFetchMoreImages(~~(angleSum / 2 / PI180));
    }
  }

  tryFetchMoreImages(roundNum) {
    if (
      this.numImagesPreLoaed - 1 + roundNum + this.fetchImagesLessThan <
      this.imgs.length + this.imagesOnFetching
    ) {
      return;
    }

    this.imagesOnFetching += 20;
    this.fetchImageUrls(++this.fectchPageIndex, imgs => {
      this.imagesOnFetching -= 20;
      this.imgs = this.imgs.concat(imgs);
    });
  }
}

window.onload = function() {
  new Gallery(
    imagesService,
    new CarouselGesture('#circle', '#carouse-area'),
    '#carouse-area',
    '#top-img'
  );
};
