const API_KEY = "api_key=de39be19b33a72ce5cefb0b1c831886a";
const BASE_URL = "https://api.themoviedb.org/3/";
const API_URL =
  BASE_URL + "discover/movie?sort_by=popularity.desc&" + API_KEY + "&page=1";
//include_adult=false&include_video=false&language=en-US&page=1&
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = BASE_URL + "search/movie?" + API_KEY;
const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tags = document.getElementById("tags");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const currentPageEl = document.getElementById("current-page");
const overlayContentEl = document.getElementById("overlay-content");
const caroPrevButton = document.getElementById("caro-prev-button");
const caroNextButton = document.getElementById("caro-next-button");
const dotsEl = document.getElementById("dots");

let selectedGenreIds = [];
let currentPage = 0;
let nextPage = 0;
let prevPage = 0;
let totalPage = 0;
let lastPageUrl = "";

//------------setting genres for movies-------------------//

setGenres();

function setGenres() {
  tags.innerHTML = "";
  genres.forEach((genre) => {
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.id = genre.id;
    tag.innerText = genre.name;

    tag.addEventListener("click", () => {
      if (selectedGenreIds.length === 0) {
        selectedGenreIds.push(genre.id);
      } else {
        if (selectedGenreIds.includes(genre.id)) {
          selectedGenreIds = selectedGenreIds.filter((id) => id !== genre.id);
        } else {
          selectedGenreIds.push(genre.id);
        }
      }
      getMovies(
        API_URL + "&with_genres=" + encodeURI(selectedGenreIds.join(","))
      );
      getHighlighted();
    });

    tags.appendChild(tag);
  });
}

function getHighlighted() {
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => tag.classList.remove("highlight"));
  clearBtn();

  selectedGenreIds.forEach((id) => {
    const selectedGenre = document.getElementById(id);
    selectedGenre.classList.add("highlight");
  });
  if (selectedGenreIds.length === 0) {
    resetDefault();
  }
}

function clearBtn() {
  const clearBtn = document.getElementById("clearButton");
  if (clearBtn) {
  } else {
    const clearEl = document.createElement("div");
    clearEl.classList.add("tag", "clear-btn");
    clearEl.id = "clearButton";
    clearEl.innerText = "Clear X";
    tags.appendChild(clearEl);
    clearEl.addEventListener("click", () => {
      resetDefault();
    });
  }
}

//------------getiing and showing movies---------------------//

getMovies(API_URL);

function getMovies(url) {
  lastPageUrl = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.results.length !== 0) {
        showMovies(data.results);
      } else {
        main.innerHTML = `<h1 class="not-found"> No Results Found! :( </h1>`;
      }

      currentPage = data.page;
      nextPage = currentPage + 1;
      prevPage = currentPage - 1;
      totalPage = data.total_pages;

      currentPageEl.innerText = currentPage;
    });
}

function showMovies(data) {
  main.innerHTML = "";
  data.forEach((movie) => {
    const { poster_path, title, vote_average, overview, id } = movie;
    const movieElement = document.createElement("div");
    movieElement.className = "movie";
    movieElement.innerHTML = `
            <img src=${
              poster_path
                ? IMG_URL + poster_path
                : "https://placehold.co/300x500"
            } alt="${title}" />
            <div class="movie-title">
                <h2>${title}</h2>
                <span class="rating ${getColor(
                  vote_average
                )}"> ${vote_average.toFixed(1)} </span>
            </div>
            
            <div class="overview">
                <h2>Overview</h2>
                <p>${overview}</p>
                <button class="know-more" id="${id}">Know More</button>
            </div>`;
    main.appendChild(movieElement);

    document.getElementById(id).addEventListener("click", () => {
      openCarousel(movie);
      dotsEl.innerHTML = "";
    });
  });
}

function pageCall(page) {
  let splitUrl = lastPageUrl.split("?");
  let splitQuery = splitUrl[1].split("&");
  splitQuery.splice(-1, 1, `page=${page}`);
  let a = splitQuery.join("&");
  splitUrl.splice(-1, 1, a);
  let resultUrl = splitUrl.join("?");

  getMovies(resultUrl);
}

// helpers
function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

function resetDefault() {
  selectedGenreIds = [];
  setGenres();
  getMovies(API_URL);
}

function openCarousel(movie) {
  fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?${API_KEY}`)
    .then((res) => res.json())
    .then((videoData) => {
      if (videoData) {
        document.querySelector(".overlay").style.height = "100%";
        let allEmbedVideo = [];
        if (videoData.results.length > 0) {
          videoData.results.forEach((video) => {
            let { name, key } = video;
            allEmbedVideo.push(`
            <iframe class="video" width="560" src="https://www.youtube.com/embed/${key}" title="${name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            `);
          });

          overlayContentEl.innerHTML = allEmbedVideo.join("");
          createCarousel();
          createDot();
        } else {
          overlayContentEl.innerHTML = `<h1 class="not-found"> No Results Found! :( </h1>`;
        }
      }
    });
}

let active = 0;
function createCarousel() {
  const videos = document.querySelectorAll(".video");
  // videoItems = videos.length <= 10 ? videos.length : 10;

  videos[active].style.transform = `none`;
  videos[active].style.opacity = 1;
  videos[active].style.zIndex = 100;

  let stt = 0;
  for (let i = active + 1; i < videos.length; i++) {
    stt++;
    videos[i].style.transform = `translateX(${120 * stt}px) scale(${
      1 - 0.2 * stt
    })`;
    videos[i].style.opacity = stt > 3 ? 0 : 1;
    videos[i].style.zIndex = -stt;
  }

  stt = 0;
  for (let i = active - 1; i >= 0; i--) {
    stt++;
    videos[i].style.transform = `translateX(${-120 * stt}px) scale(${
      1 - 0.2 * stt
    })`;
    videos[i].style.opacity = stt > 2 ? 0 : 1;
    videos[i].style.zIndex = -stt;
  }
}

function createDot() {
  dotsEl.innerHTML = "";
  const videos = document.querySelectorAll(".video");
  for (let i = 0; i < videos.length; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    dotsEl.appendChild(dot);
  }
  dotsEl.firstChild.classList.add("highlight");
}

function scaleActiveDot(active) {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot) => {
    dot.classList.remove("highlight");
  });
  dots[active].classList.add("highlight");
  console.log(dots.length);
}

// evenet listeners here
document.getElementById("close-btn").addEventListener("click", () => {
  document.querySelector(".overlay").style.height = "0%";
});

document.getElementById("menubar").addEventListener("click", () => {
  document.querySelector(".tags-wrapper").style.transform = `translateX(0px)`;
});

document.getElementById("menubar-cross").addEventListener("click", () => {
  document.querySelector(".tags-wrapper").style.transform = `translateX(-110%)`;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  resetDefault();
  const searchTerm = search.value;
  if (searchTerm) {
    getMovies(`${SEARCH_URL}&query=${searchTerm}`);
  } else {
    getMovies(API_URL);
  }
});

nextButton.addEventListener("click", () => {
  prevButton.disabled = false;
  if (currentPage >= totalPage - 1) {
    nextButton.disabled = true;
  }

  if (currentPage <= totalPage) {
    pageCall(nextPage);
  }
});

prevButton.addEventListener("click", () => {
  nextButton.disabled = false;
  if (currentPage <= 2) {
    prevButton.disabled = true;
  }
  if (currentPage > 1) {
    pageCall(prevPage);
  }
});

caroPrevButton.addEventListener("click", () => {
  const videos = document.querySelectorAll(".video");
  active = active > 0 ? active - 1 : active;
  createCarousel();
  active === videos.length ? scaleActiveDot(active - 1) : scaleActiveDot(active);
});

caroNextButton.addEventListener("click", () => {
  const videos = document.querySelectorAll(".video");
  active = active < videos.length ? active + 1 : videos.length - 1;
  createCarousel();
  scaleActiveDot(active);
});
