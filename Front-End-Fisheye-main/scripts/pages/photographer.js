const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
let currentPhotographerId = searchParams.get("id");
console.log("idPhotographer :", currentPhotographerId);

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
  console.log("result getInfos", photographer, medias);
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

  // Récupérer l'élément select et ajouter un gestionnaire d'événements pour le changement de valeur
  const sortSelect = document.querySelector(".sort-select");
  sortSelect.addEventListener("change", function () {
    const sortOption = this.value;
    sortMedia(mediaContainer, sortOption);
  });

  function sortMedia(container, option) {
    const mediaElements = Array.from(container.getElementsByClassName("media"));

    mediaElements.sort(function (a, b) {
      const valueA = getSortValue(a, option);
      const valueB = getSortValue(b, option);

      if (valueA < valueB) {
        return -1;
      } else if (valueA > valueB) {
        return 1;
      } else {
        return 0;
      }
    });

    mediaElements.forEach(function (mediaElement) {
      container.appendChild(mediaElement);
    });
  }

  function getSortValue(element, option) {
    if (option === "popularite") {
      return parseInt(element.querySelector(".like").textContent);
    } else if (option === "titre") {
      return element.querySelector(".title").textContent;
    } else if (option === "date") {
      return element.querySelector(".date").textContent; //----------> Le classement par date ne fonctionne pas
    }
  }
});

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
  const modalContent = document.querySelector(".modal");

  // Supprimer le nom du photographe avant de fermer la modal
  modalContent.removeChild(modalContent.firstChild);

  contactModal.style.display = "none";
}
