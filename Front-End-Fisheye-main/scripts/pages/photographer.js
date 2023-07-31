const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
let currentPhotographerId = searchParams.get("id");
console.log("idPhotographer :", currentPhotographerId);
let allMedia = [];
let currentMediaIndex = 0;
const mediaCount = allMedia.length;

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
        if (currentM.length && currentP.length) {
          return {
            medias: currentM,
            photographer: currentP[0],
          };
        } else {
          throw new Error("l'ID est erroné");
        }
      } else {
        throw new Error("Impossible de trouver les photographes du fichier");
      }
    } else {
      throw new Error("Impossible de contacter le serveur");
    }
  } catch (err) {
    console.log("oups", err);

    return err;
  }
}

getInfos()
  .then((infos) => {
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

    medias.forEach((media, i) => {
      let myFactoryMediaModel = mediaFactory(media, photographer);
      const myMediaHtml = myFactoryMediaModel.getHtmlMedia(i, medias);
      mediaContainer.appendChild(myMediaHtml);
    });
    // Met le contenu de la div avec l'id "total-likes" à jour
    // let totalLikes = 0;
    // allMedia.forEach((mediaItem) => {
    //   totalLikes += mediaItem.likes;
    // });
    const updateTotal = (mediasToTotal) => {
      return mediasToTotal.reduce(
        (initvalue, media) => media.likes + initvalue,
        0
      );
    };
    let totalLikes = updateTotal(medias);
    mediaContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="sub-info footer">
        <div id="total-likes" class="sub-info__likes">
          <span class="like-quantity">${totalLikes}</span>
          <div class="fas fa-heart" aria-hidden="true"></div>
        </div>
        <div class="sub-info__price">
          <span id="price" class="price">${photographer.price} €/jour</span>
        </div>
      </div>
    `
    );

    // Ajout de la div media-container à l'intérieur de l'élément main
    target.appendChild(mediaContainer);

    const sortMedia = (allMediaToSort, option) => {
      console.log(
        "🚀 ~ file: photographer.js:80 ~ sortMedia ~ sortMedia:",
        sortMedia
      );
      let newMedia = allMediaToSort.sort((a, b) => {
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

    optionsList.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    selectedOption.addEventListener("click", (event) => {
      event.stopPropagation();
      optionsList.style.display =
        optionsList.style.display === "block" ? "none" : "block";
    });

    sortOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const selectedValue = option.getAttribute("data-value");
        selectedOption.textContent = option.textContent;
        optionsList.style.display = "none";
        let mediaSorted = sortMedia(allMedia, selectedValue);

        // Vider les médias présents dans le DOM
        mediaContainer.innerHTML = "";
        mediaSorted.forEach((media, i) => {
          let myFactoryMediaModel = mediaFactory(media, photographer);
          const myMediaHtml = myFactoryMediaModel.getHtmlMedia(i, media);
          mediaContainer.appendChild(myMediaHtml);
        });

        // Ferme la liste des options après avoir effectué le tri
        optionsList.style.display = "none";
      });
    });
  })
  .catch((err) => {
    // Si l'URL n'est pas valide cela affichera un message d'erreur
    const target = document.getElementById("main");
    target.innerHTML = `
    <div class="message-error">
      <p class="message">Oups, la page que vous recherchez n'existe pas.
        <img class="gif" src="./assets/images/nedry-no.gif" alt="Non, non, non">
      </p>
    </div>`;
  });

// Gestion de la modal de contact
function displayModal() {
  const contactModal = document.getElementById("contact_modal");
  const photographerName = document.querySelector(
    ".photographerInfo h2"
  ).textContent;
  const photographerNameElement = document.getElementById("photographer_name");
  photographerNameElement.textContent = photographerName;

  contactModal.style.display = "flex";
}

// Gestion de la fermeture des modals
function closeModal() {
  const contactModal = document.getElementById("contact_modal");
  const galleryModal = document.getElementById("gallery_modal");

  contactModal.style.display = "none";
  galleryModal.style.display = "none";
}

//Gestion de la modal des médias
const openModal = (infos, indexMedia, folderImage) => {
  currentMediaIndex = indexMedia;
  let mediaSelected = infos[indexMedia];
  let containerArrows = document.createElement("div");
  containerArrows.classList.add("carousel");
  containerArrows.innerHTML = `
    <img class="cross-media" src="assets/icons/close.svg" onclick="closeModal()" />
    <div class="carousel-arrow-left">
      <i class="fa-solid fa-angle-left" onclick="prevMedia('${folderImage}')"></i>
    </div>
    <div class="carousel-arrow-right">
      <i class="fa-solid fa-angle-right" onclick="nextMedia('${folderImage}')"></i>
    </div>
  `;

  const galleryModal = document.getElementById("gallery_modal");
  const modalHtml = gallery_modal.querySelector(".modal");
  modalHtml.innerHTML = ""; // Enlève le contenu dans la modal
  const targetModal = document.getElementById("gallery_modal_current_media");
  targetModal.innerHTML = "";
  const childrenTargetModal = document.createElement("object");
  childrenTargetModal.data = `./assets/images/${folderImage}/${
    mediaSelected.image ? mediaSelected.image : mediaSelected.video
  }`;
  targetModal.append(childrenTargetModal);
  modalHtml.append(containerArrows);
  galleryModal.style.display = "block";
};

//Gestion des fonctions précédentes et suivantes pour le carousel des medias
function prevMedia(folder) {
  let prevIndex = currentMediaIndex - 1;
  if (prevIndex < 0) {
    prevIndex = allMedia.length - 1;
  }
  currentMediaIndex = prevIndex;
  updateMedia(folder, prevIndex);
}

function nextMedia(folder) {
  let nextIndex = currentMediaIndex + 1;
  if (nextIndex >= allMedia.length) {
    nextIndex = 0;
  }
  currentMediaIndex = nextIndex;
  updateMedia(folder, nextIndex);
}

function updateMedia(folderMedia, newMediaIndex) {
  const mediaSelected = allMedia[newMediaIndex];
  const targetModal = document.getElementById("gallery_modal_current_media");
  targetModal.innerHTML = ""; // Enlève le contenu dans la modal
  const childrenTargetModal = document.createElement("object");
  childrenTargetModal.data = `./assets/images/${folderMedia}/${
    mediaSelected.image ? mediaSelected.image : mediaSelected.video
  }`;
  targetModal.appendChild(childrenTargetModal);
}

function toggleLike(id) {
  let currentEl = document.querySelector(`.likeAndHeart[data-id="${id}"]`);
  let likes = currentEl.querySelector(`.likesValueJs`).textContent;
  let isCheckedHTML = currentEl.querySelector(`.heart`);

  console.log(
    "🚀 ~ file: photographer.js:258 ~ toggleLike ~ isCheckedHTML:",
    isCheckedHTML
  );
  console.log("🚀 ~ file: photographer.js:257 ~ toggleLike ~ likes:", likes);
  let likesCountMedia = parseInt(likes); // parseInt convertit la chaîne de caractères en un nombre entier.
  console.log("🚀 ~ file: photographer.js:258 ~ toggleLike ~ id:", id);
  let isChecked = isCheckedHTML.dataset.liked;
  console.log(
    "🚀 ~ file: photographer.js:261 ~ toggleLike ~ isChecked:",
    isChecked
  );
  console.log(
    "🚀 ~ file: photographer.js:261 ~ toggleLike ~ currentEl:",
    currentEl
  );
  let newTemplate;
  if (isChecked === "no") {
    console.log("pas liké");
    let newLikesCountMedia = likesCountMedia + 1;
    newTemplate = `
    
      <div class="likes"><span class="likesValueJs">${newLikesCountMedia}</span>
        <button class="heart" data-liked="yes" data-id="${id}">
          <i class="fas fa-heart checked" aria-hidden="true"></i>
        </button>
      </div>
    `;
  } else {
    console.log(" liké");

    let newLikesCountMedia = likesCountMedia - 1;
    newTemplate = `
      <div class="likes"><span class="likesValueJs">${newLikesCountMedia}</span>
        <button class="heart" data-liked="no" data-id="${id}">
          <i class="far fa-heart checked" aria-hidden="true"></i>
        </button>
      </div>
    `;
  }
  currentEl.innerHTML = "";
  currentEl.innerHTML = newTemplate;
  // Sélectionner les icônes de cœur à partir de heartButton
  // const uncheckedHeart = heartButton.querySelector(".unchecked");
  // const checkedHeart = heartButton.querySelector(".checked");

  // if (!!isLiked) {
  //   console.log("pas liké")
  //   let currentEl = document.querySelector(`.likeAndHeart[data-id="${id}"]`)
  //   // heartButton.dataset.liked = true
  //   console.log("🚀 ~ file: photographer.js:271 ~ toggleLike ~ likesCountMedia:", likesCountMedia + 1 )
  //   let newLikesCountMedia = likesCountMedia + 1
  //   currentEl.innerHTML = ''
  //   let newTemplate = `<div class="likes">${newLikesCountMedia}
  //     <button class="heart" data-id="${id}">
  //       <i class="fas fa-heart checked" aria-hidden="true"></i>
  //     </button>
  //   </div>`
  //   currentEl.innerHTML = newTemplate
  // uncheckedHeart.style.display = "none";
  // checkedHeart.style.display = "inline";
  // } else {
  //   console.log("deja liké")
  //   likesCountMedia--; // Soustrait un like si l'utilisateur a déjà aimé tel média
  //   // checkedHeart.style.display = "none";
  //   // uncheckedHeart.style.display = "inline";
  // }

  // Met à jour le nombre de likes dans l'élément DOM approprié
  // const likesElement = heartButton.parentElement.querySelector(".likes");
  // likesElement.textContent = likesCount;
  // console.log(
  //   "🚀 ~ file: photographer.js:263 ~ toggleLike ~ likesElement:",
  //   likesElement
  // );

  // Met à jour le nombre de likes dans l'élément <span class="like-quantity">
  // const likeQuantityElement = document.querySelector(".like-quantity");
  // likeQuantityElement.textContent = likesCount;
  // console.log(
  //   "🚀 ~ file: photographer.js:267 ~ toggleLike ~ likesCount:",
  //   likesCount
  // );
}
