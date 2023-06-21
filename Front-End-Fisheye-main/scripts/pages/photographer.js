const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
let currentPhotographerId = searchParams.get("id");
console.log("idPhotographer :", currentPhotographerId);
let allMedia = [];

async function getInfos() {
  try {
    const fetchPhotographers = await fetch("./photographers.json");
    if (fetchPhotographers.ok) {
      const photographersResponse = await fetchPhotographers.json();
      if (photographersResponse) {
        // Filtrer les infos du photographe par son id
        let currentP = photographersResponse.photographers.filter((user) => {
          return user.id == currentPhotographerId;
        });

        // filtrer les medias par l'id du photographe
        let currentM = photographersResponse.media.filter((mediaItem) => {
          return mediaItem.photographerId == currentPhotographerId;
        });
        return {
          medias: currentM,
          photographer: currentP[0],
        };
      } else {
        throw new Error("Impossible de trouver les photographes du fichier");
      }
    } else {
      throw new Error("Impossible de contacter le serveur");
    }
  } catch (err) {
    console.log("oups", err);
  }
}

getInfos().then((infos) => {
  const { photographer, medias } = infos;
  allMedia = medias;
  let target = document.getElementById("main");
  let photographHeader = document.querySelector(".photograph-header");

  const infoPhotographer = `
  <div class="photographerInfo">
   <h2>${photographer.name}</h2>
   <h3>${photographer.city}</h3>
   <h4>${photographer.tagline}</h4>
  </div>`;

  const picPhotographer = `
  <div class="photographerPortrait">
   <img class="photobooth" src="assets/images/photographers/${photographer.portrait}" alt="${photographer.name}">
  </div>`;
  photographHeader.insertAdjacentHTML("afterbegin", infoPhotographer);
  photographHeader.insertAdjacentHTML("beforeend", picPhotographer);

  //Création de la div media-container
  const mediaContainer = document.createElement("div");
  mediaContainer.classList.add("media-container");

  medias.forEach((media) => {
    let myFactoryMediaModel = mediaFactory(media, photographer);
    const myMediaHtml = myFactoryMediaModel.getHtmlMedia();
    mediaContainer.appendChild(myMediaHtml);
  });

  //Ajout de la div media-container à l'intérieur de l'élément main
  target.appendChild(mediaContainer);

  // Ajout des flèches du carrousel
  const carouselArrows = document.createElement("div");
  carouselArrows.classList.add("carousel-arrows");
  carouselArrows.innerHTML = `
    <div class="carousel-arrow carousel-arrow-left" onclick="prevMedia()"></div>
    <div class="carousel-arrow carousel-arrow-right" onclick="nextMedia()"></div>
  `;

  // Ajout des flèches du carrousel après "media-container"
  target.appendChild(carouselArrows);

  const sortMedia = (allMediaToSort, option) => {
    let newMedia = allMediaToSort.sort((a, b) => {
      //const valueA = option === "date" ? new Date(a[option]) : a[option];
      const valueA = a[option];
      const valueB = b[option];

      if (valueA < valueB) {
        return -1;
      } else if (valueA > valueB) {
        return 1;
      } else {
        return 0;
      }
    });
    return newMedia;
  };

  const sortOptions = document.querySelectorAll(".sort-option");
  const selectedOption = document.querySelector(".selected-option");
  const optionsList = document.querySelector(".options-list");

  selectedOption.addEventListener("click", () => {
    optionsList.style.display =
      optionsList.style.display === "none" ? "block" : "none";
  });

  sortOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedValue = option.getAttribute("data-value");
      selectedOption.textContent = option.textContent;
      optionsList.style.display = "none";

      let mediaSorted = sortMedia(allMedia, selectedValue);

      // Vider les médias présents dans le DOM
      mediaContainer.innerHTML = "";
      mediaSorted.forEach((media) => {
        let myFactoryMediaModel = mediaFactory(media, photographer);
        const myMediaHtml = myFactoryMediaModel.getHtmlMedia();
        mediaContainer.appendChild(myMediaHtml);
      });
    });
  });
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!target.closest(".sort-container")) {
    optionsList.style.display = "none"; // "toggleclass" Ajouter un classe à l'action du clique
  }
});

const button = document.getElementByClass("options-list");
const buttonPressed = (e) => {
  e.target.classList.toggle("active");
};
button.addEventListener("click", buttonPressed);

//Gestion de la modal
function displayModal() {
  const contactModal = document.getElementById("contact_modal");
  const photographerName = document.querySelector(
    ".photographerInfo h2"
  ).textContent;
  const photographerNameElement = document.getElementById("photographer_name");
  photographerNameElement.textContent = photographerName;

  contactModal.style.display = "flex";
}

function closeModal() {
  const contactModal = document.getElementById("contact_modal");

  /*  // Suppression du nom du photographe avant de fermer la modal
  const modalContent = document.querySelector(".modal");
  modalContent.removeChild(modalContent.firstChild);
  */
  contactModal.style.display = "none";
}
