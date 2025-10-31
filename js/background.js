const page = window.location.pathname.split('/').pop();
const isRootPage = page === '' || page === 'index.html';

const bgPath = isRootPage ? 'images/' : '../images/';

const backgrounds = [
  `${bgPath}/Background/bg1.jpg`,
  `${bgPath}/Background/bg2.jpg`,
  `${bgPath}/Background/bg3.jpg`,
  `${bgPath}/Background/bg4.jpg`,
  `${bgPath}/Background/bg5.jpg`,
  `${bgPath}/Background/bg6.jpg`,
  `${bgPath}/Background/bg7.jpg`,
  `${bgPath}/Background/bg8.jpg`,
  `${bgPath}/Background/bg9.jpg`
];

const preloadedImages = [];
let loadedCount = 0;

backgrounds.forEach((src) => {
  const img = new Image();
  img.onload = () => {
    loadedCount++;
    if (loadedCount === backgrounds.length) {
      changeBackground();
      setInterval(changeBackground, 10000);
    }
  };
  img.src = src;
  preloadedImages.push(img);
});

document.body.style.cssText = `
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  transition: background-image 0.6s ease-in-out;
`;

let currentIndex = -1;

function changeBackground() {
  let newIndex;
  if (backgrounds.length > 1) {
    do {
      newIndex = Math.floor(Math.random() * backgrounds.length);
    } while (newIndex === currentIndex);
  } else {
    newIndex = 0;
  }

  currentIndex = newIndex;
  requestAnimationFrame(() => {
    document.body.style.backgroundImage = `url(${backgrounds[currentIndex]})`;
  });
}