const screens = document.querySelectorAll('.screen');

document.querySelectorAll('[data-go]').forEach((button) => {
  button.addEventListener('click', () => {
    screens.forEach((screen) => {
      screen.classList.toggle('active', screen.id === button.dataset.go);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (button.dataset.go === 'letter') {
      startSakura();
    }
  });
});

document.querySelectorAll('.note').forEach((note) => {
  note.addEventListener('click', () => note.classList.toggle('open'));
});

const cake = document.querySelector('#cake');
const cakePrompt = document.querySelector('#cakePrompt');
const finalMessage = document.querySelector('#finalMessage');

cake.addEventListener('click', () => {
  cake.classList.add('lit');
  cakePrompt.textContent = 'Your wish is on its way...';
  finalMessage.classList.add('show');
  makeConfetti();
});

function makeConfetti() {
  const holder = document.querySelector('#confetti');
  const colors = ['#ee837d', '#d9cef6', '#f6c85f', '#8ec9d5', '#ffffff'];

  holder.replaceChildren();

  for (let i = 0; i < 70; i += 1) {
    const piece = document.createElement('i');
    piece.className = 'piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--drift', `${(Math.random() - .5) * 28}vw`);
    piece.style.animationDelay = `${Math.random() * .35}s`;
    holder.appendChild(piece);
  }
}

/* Sakura animation for the final letter */
let sakuraTimer = null;

function createPetal() {
  const holder = document.querySelector('#sakura');
  if (!holder) return;

  const petal = document.createElement('i');
  petal.className = 'petal';

  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.setProperty('--drift', `${(Math.random() - 0.5) * 35}vw`);
  petal.style.animationDuration = `${5 + Math.random() * 5}s`;
  petal.style.animationDelay = `${Math.random() * 1.5}s`;
  petal.style.transform = `rotate(${Math.random() * 360}deg)`;
  petal.style.scale = `${0.6 + Math.random() * 0.8}`;

  holder.appendChild(petal);

  setTimeout(() => petal.remove(), 11000);
}

function startSakura() {
  if (sakuraTimer) return;

  for (let i = 0; i < 18; i += 1) {
    setTimeout(createPetal, i * 180);
  }

  sakuraTimer = setInterval(createPetal, 450);
}


/* =========================================
   INSTAGRAM / TIKTOK STYLE PHOTO SLIDER
========================================= */

const memorySlides =
  document.querySelectorAll('.memory-slide');

const memoryDots =
  document.querySelectorAll('.slider-dot');

const slideQuote =
  document.querySelector('#slideQuote');

const prevMemory =
  document.querySelector('#prevMemory');

const nextMemory =
  document.querySelector('#nextMemory');

const memorySlider =
  document.querySelector('#memorySlider');


const memoryQuotes = [
  'Somehow, my favorite memories always have you in them.',
  'You + me — a tiny world I never want to leave.',
  'If I could keep one moment forever, it would be one with you.'
];


let currentMemory = 0;

let touchStartX = 0;
let currentDragX = 0;

let isDragging = false;
let isAnimating = false;


/* =========================================
   SHOW SLIDE
========================================= */

function showMemory(index, direction = 1) {

  if (!memorySlides.length) return;

  if (isAnimating) return;

  const oldIndex = currentMemory;

  const newIndex =
    (index + memorySlides.length) %
    memorySlides.length;

  if (newIndex === oldIndex) return;

  const oldSlide =
    memorySlides[oldIndex];

  const newSlide =
    memorySlides[newIndex];


  isAnimating = true;


  /*
    Make sure ONLY the current
    and then the new slide are visible.
  */

  memorySlides.forEach((slide) => {

    slide.classList.remove(
      'active',
      'slide-out-left',
      'slide-out-right'
    );

    slide.style.transform = '';
    slide.style.opacity = '';

  });


  /*
    Current photo leaves
  */

  oldSlide.classList.add(
    direction > 0
      ? 'slide-out-left'
      : 'slide-out-right'
  );


  /*
    Wait until the old photo
    completely leaves.
  */

  setTimeout(() => {

    oldSlide.classList.remove(
      'slide-out-left',
      'slide-out-right'
    );


    /*
      NOW show the new photo.
      This means the previous photo
      is already completely gone.
    */

    newSlide.classList.add('active');

    currentMemory = newIndex;


    /* Update dots */

    memoryDots.forEach((dot, i) => {

      dot.classList.toggle(
        'active',
        i === currentMemory
      );

    });


    /* Update quote */

    if (slideQuote) {

      slideQuote.classList.remove(
        'changing'
      );

      void slideQuote.offsetWidth;

      slideQuote.classList.add(
        'changing'
      );

      setTimeout(() => {

        slideQuote.textContent =
          memoryQuotes[currentMemory];

        slideQuote.classList.remove(
          'changing'
        );

      }, 160);

    }


    setTimeout(() => {
      isAnimating = false;
    }, 50);

  }, 400);
}


/* =========================================
   NEXT BUTTON
========================================= */

if (nextMemory) {

  nextMemory.addEventListener(
    'click',
    () => {

      showMemory(
        currentMemory + 1,
        1
      );

    }
  );

}


/* =========================================
   PREVIOUS BUTTON
========================================= */

if (prevMemory) {

  prevMemory.addEventListener(
    'click',
    () => {

      showMemory(
        currentMemory - 1,
        -1
      );

    }
  );

}


/* =========================================
   DOTS
========================================= */

memoryDots.forEach((dot) => {

  dot.addEventListener(
    'click',
    () => {

      const target =
        Number(dot.dataset.slide);

      if (target === currentMemory)
        return;

      const direction =
        target > currentMemory
          ? 1
          : -1;

      showMemory(
        target,
        direction
      );

    }
  );

});


/* =========================================
   TOUCH START
========================================= */

if (memorySlider) {

  memorySlider.addEventListener(
    'touchstart',
    (event) => {

      if (isAnimating) return;

      touchStartX =
        event.touches[0].clientX;

      currentDragX = 0;

      isDragging = true;

      memorySlider.classList.add(
        'is-dragging'
      );

    },
    { passive: true }
  );


  /* =========================================
     TOUCH MOVE
  ========================================= */

  memorySlider.addEventListener(
    'touchmove',
    (event) => {

      if (!isDragging) return;

      const touchX =
        event.touches[0].clientX;

      currentDragX =
        touchX - touchStartX;


      /*
        IMPORTANT:

        We ONLY move the current photo.

        The next/previous photo stays hidden.
      */

      const currentSlide =
        memorySlides[currentMemory];


      currentSlide.style.transform =
        `translateX(${currentDragX}px)`;

    },
    { passive: true }
  );


  /* =========================================
     TOUCH END
  ========================================= */

  memorySlider.addEventListener(
    'touchend',
    () => {

      if (!isDragging) return;

      isDragging = false;

      memorySlider.classList.remove(
        'is-dragging'
      );


      const threshold = 70;


      /*
        SWIPE LEFT
      */

      if (currentDragX < -threshold) {

        resetDrag();

        showMemory(
          currentMemory + 1,
          1
        );

      }


      /*
        SWIPE RIGHT
      */

      else if (currentDragX > threshold) {

        resetDrag();

        showMemory(
          currentMemory - 1,
          -1
        );

      }


      /*
        NOT ENOUGH SWIPE
        → return photo to center
      */

      else {

        const currentSlide =
          memorySlides[currentMemory];

        currentSlide.style.transform =
          'translateX(0)';

        currentDragX = 0;

      }

    },
    { passive: true }
  );

}


/* =========================================
   RESET DRAG
========================================= */

function resetDrag() {

  const currentSlide =
    memorySlides[currentMemory];

  currentSlide.style.transform = '';

  currentDragX = 0;

}