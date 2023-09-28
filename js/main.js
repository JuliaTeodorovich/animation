const track = document.getElementById("image-track");
const line = document.querySelector(".line");
const audio = document.getElementById("myAudio");
track.dataset.percentage = 0;
line.classList.add("mute");

line.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    line.classList.add("play");
    line.classList.remove("mute");
  } else {
    audio.pause();
    line.classList.remove("play");
    line.classList.add("mute");
  }
});

function updateTrack(newPercentage) {
  const nextPercentage = Math.min(0, Math.max(-100, newPercentage));
  track.dataset.percentage = nextPercentage;
  const transformPercentage = `${nextPercentage}%`;
  track.animate(
    { transform: `translate(${transformPercentage}, -50%)` },
    { duration: 1200, fill: "forwards" }
  );
}

function updateImages(newPercentage) {
  const objectPositionPercentage = `${100 + newPercentage}%`;

  for (const image of track.getElementsByClassName("image")) {
    image.animate(
      {
        height: "63vmin",
        objectPosition: `${objectPositionPercentage} 50%`,
      },
      { duration: 1200, fill: "forwards" }
    );
  }
}

window.onmousedown = (e) => {
  track.dataset.mouseDownAt = e.clientX;
};

window.onmouseup = () => {
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
};

window.onmousemove = (e) => {
  if (track.dataset.mouseDownAt === "0") return;
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
  maxDelta = window.innerWidth / 2;
  const percentage = (mouseDelta / maxDelta) * -100;
  const newPercentage = parseFloat(track.dataset.prevPercentage) + percentage;
  updateTrack(newPercentage);
  updateImages(newPercentage);
};

window.addEventListener("wheel", (e) => {
  const scrollAmount = -e.deltaY;
  const currentPercentage = parseFloat(track.dataset.percentage);
  const newPercentage = currentPercentage + scrollAmount / 100;
  updateTrack(newPercentage);
  updateImages(newPercentage);
});

let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 50;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});

document.addEventListener("touchmove", (e) => {
  touchEndX = e.touches[0].clientX;
});

document.addEventListener("touchend", () => {
  const swipeDistance = touchEndX - touchStartX;
  if (swipeDistance > minSwipeDistance) {
    const currentPercentage = parseFloat(track.dataset.percentage);
    const newPercentage = currentPercentage + 10;
    updateTrack(newPercentage);
    updateImages(newPercentage);
  } else if (swipeDistance < -minSwipeDistance) {
    const currentPercentage = parseFloat(track.dataset.percentage);
    const newPercentage = currentPercentage - 10;
    updateTrack(newPercentage);
    updateImages(newPercentage);
  }
});
