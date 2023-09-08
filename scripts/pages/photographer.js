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

      // Crée un élément <article> et transfère le contenu de myMediaHtml dedans
      const articleElement = document.createElement("article");
      articleElement.appendChild(myMediaHtml);

      // Ajoute les classes appropriées à l'élément <article>
      articleElement.setAttribute("role", "button");

      // Ajoute l'élément <article> à la classe media-container
      mediaContainer.appendChild(articleElement);
    });

    const updateTotal = (mediasToTotal) => {
      return mediasToTotal.reduce(
        (initvalue, media) => media.likes + initvalue,
        0
      );
    };
    let totalLikes = updateTotal(medias);
    let mainHTML = document.querySelector("#main");
    mainHTML.insertAdjacentHTML(
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
    let selectedOptionIndex = -1;

    // Gestion de la liste déroulante avec le clic
    selectedOption.addEventListener("click", (event) => {
      event.stopPropagation();
      optionsList.style.display =
        optionsList.style.display === "block" ? "none" : "block";
    });

    // Gestion de la liste déroulante avec le clavier
    selectedOption.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        optionsList.style.display =
          optionsList.style.display === "block" ? "none" : "block";
        optionsList.focus();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        selectedOptionIndex = (selectedOptionIndex + 1) % sortOptions.length;
        sortOptions[selectedOptionIndex].focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        selectedOptionIndex =
          (selectedOptionIndex - 1 + sortOptions.length) % sortOptions.length;
        sortOptions[selectedOptionIndex].focus();
      }
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

    sortOptions.forEach((option) => {
      option.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
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
        }
      });
    });
  })
  .catch((err) => {
    // Si l'URL n'est pas valide cela affichera ce message d'erreur
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

  const focusableElements = contactModal.querySelectorAll(
    'input[type="text"], input[type="email"], textarea, .contact_button'
  );
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
}

// Gestion de la modal de contact au clavier
const contactModal = document.getElementById("contact_modal");
const focusableElements = contactModal.querySelectorAll(
  'input[type="text"], input[type="email"], textarea, .contact_button'
);
let focusedElementIndex = 0;
contactModal.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    if (event.shiftKey) {
      // Déplace le focus vers l'élément précédent
      focusedElementIndex =
        (focusedElementIndex - 1 + focusableElements.length) %
        focusableElements.length;
    } else {
      // Déplace le focus vers l'élément suivant
      focusedElementIndex =
        (focusedElementIndex + 1) % focusableElements.length;
    }
    focusableElements[focusedElementIndex].focus();
  }
});

let previouslyFocusedElement = null;
let focusableElementsInModal = []; // Liste les éléments focusables dans la modal

// Gestion de la fermeture des modals
function closeModal() {
  if (previouslyFocusedElement !== null) {
    previouslyFocusedElement.focus();
  }

  const contactModal = document.getElementById("contact_modal");
  const galleryModal = document.getElementById("gallery_modal");

  contactModal.style.display = "none";
  galleryModal.style.display = "none";
}

// Gestion de la fermeture de la modale au clavier
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal();
  }
});

// Gestion du clic sur le cœur
document.addEventListener("click", function (event) {
  const clickedElement = event.target;

  // Ciblez le bouton parent avec la classe "heart"
  const heartButton = clickedElement.closest(".heart");

  if (heartButton) {
    event.preventDefault(); // Empêche le comportement par défaut du cœur

    const mediaId = heartButton.getAttribute("data-id");
    const liked = heartButton.getAttribute("data-liked");

    if (liked === "no") {
      // Met le "like"
      toggleLike(mediaId);

      // Met à jour l'état du bouton du cœur à "oui"
      heartButton.setAttribute("data-liked", "yes");
    } else {
      // Retire le "like"
      toggleLike(mediaId);

      // Met à jour l'état du bouton du cœur à "non"
      heartButton.setAttribute("data-liked", "no");
    }

    toggleLike(mediaId);

    // Remet le focus sur le bouton like
    heartButton.focus();
  }
});

// Modifie la gestion de l'événement pour ouvrir la modal
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter" || event.key === " ") {
    const focusedElement = document.activeElement;
    if (focusedElement.classList.contains("heart")) {
      event.preventDefault(); // Empêche la page de défiler lorsque la barre d'espace est pressée
      event.stopPropagation(); // Arrête la propagation de l'événement
    }
  }
});

// Gestion de la modal des médias
const openModal = (infos, indexMedia, folderMedia) => {
  if (event.target.tagName !== "BUTTON") {
    currentMediaIndex = indexMedia;
    let mediaSelected = infos[indexMedia];
    const galleryModal = document.getElementById("gallery_modal");
    const modalHtml = galleryModal.querySelector(".modal");
    modalHtml.innerHTML = ""; // Enlève le contenu dans la modal
    previouslyFocusedElement = document.querySelector(":focus"); // Grafikart

    let containerArrows = document.createElement("div");
    containerArrows.classList.add("carousel");
    containerArrows.innerHTML = `
      <div class="blue-square"
        <div class="arrows">
          <div class="carousel-arrow-left">
            <i class="fa-solid fa-angle-left" onclick="prevMedia('${folderMedia}')"></i>
          </div>
          <div class="cadre-media-and-title">
            <div id="gallery_modal_current_media"></div>
            <div class="under-title-media">${mediaSelected.title}</div>
          </div>
          <div class="carousel-arrow-right">
            <i class="fa-solid fa-angle-right" onclick="nextMedia('${folderMedia}')"></i>
          </div>
        </div>
      </div>
    `;

    // Gestion du carousel avec les flèches G/D
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeModal();
      } else if (event.key === "ArrowLeft") {
        prevMedia(folderMedia);
      } else if (event.key === "ArrowRight") {
        nextMedia(folderMedia);
      }
    });

    const targetModal = containerArrows.querySelector(
      "#gallery_modal_current_media"
    );

    if (mediaSelected.image) {
      childrenTargetModal = document.createElement("img");
      childrenTargetModal.src = `./assets/images/${folderMedia}/${mediaSelected.image}`;
    } else {
      childrenTargetModal = document.createElement("video");
      childrenTargetModal.setAttribute("controls", true);
      childrenTargetModal.setAttribute("autoplay", true);
      childrenTargetModal.setAttribute("tabindex", "0");
      let sourceHtml = document.createElement("source");
      sourceHtml.setAttribute("type", "video/mp4");
      sourceHtml.src = `./assets/images/${folderMedia}/${mediaSelected.video}`;
      childrenTargetModal.append(sourceHtml);
    }

    childrenTargetModal.data = `./assets/images/${folderMedia}/${
      mediaSelected.image ? mediaSelected.image : mediaSelected.video
    }`;

    targetModal.append(childrenTargetModal);

    modalHtml.appendChild(containerArrows);

    galleryModal.style.display = "block";

    let isVideoPlaying = true;
    // Gestion de la fonction pause de la barre espace
    document.addEventListener("keyup", (event) => {
      if (event.key === " " && event.target === document.body) {
        event.preventDefault(); // Empêche le défilement de la page lorsque l'on appuie sur la barre espace

        // Sélectionne la vidéo affichée dans la modal
        const videoElement = document.querySelector("video");

        // Si une vidéo est trouvée, cela met "pause" ou "lecture"
        if (videoElement) {
          if (isVideoPlaying) {
            pauseVideo(videoElement);
          } else {
            playVideo(videoElement);
          }
          isVideoPlaying = !isVideoPlaying;
        }
      }
    });
    function playVideo(videoElement) {
      videoElement.play();
    }

    function pauseVideo(videoElement) {
      videoElement.pause();
    }
  }
};

// Gestion des fonctions "précédentes" et "suivantes" pour le carousel des medias
// Fonction pour passer au média précédent
function prevMedia(folder) {
  let prevIndex = currentMediaIndex - 1;
  if (prevIndex < 0) {
    prevIndex = allMedia.length - 1;
  }
  currentMediaIndex = prevIndex;
  updateMedia(folder, prevIndex);
}

// Fonction pour passer au média suivant
function nextMedia(folder) {
  let nextIndex = currentMediaIndex + 1;
  if (nextIndex >= allMedia.length) {
    nextIndex = 0;
  }
  currentMediaIndex = nextIndex;
  updateMedia(folder, nextIndex);
}

// Fonction pour mettre à jour le titre du média
function updateMediaTitle(title) {
  const titleElement = document.querySelector(".under-title-media");
  titleElement.textContent = title;
}

// Fonction pour mettre à jour le média dans la modal
function updateMedia(folderMedia, newMediaIndex) {
  const mediaSelected = allMedia[newMediaIndex];
  const targetModal = document.getElementById("gallery_modal_current_media");
  targetModal.innerHTML = ""; // Enlève le contenu dans la modal
  let childrenTargetModal;
  if (mediaSelected.image) {
    childrenTargetModal = document.createElement("img");
    childrenTargetModal.src = `./assets/images/${folderMedia}/${mediaSelected.image}`;
  } else {
    childrenTargetModal = document.createElement("video");
    childrenTargetModal.setAttribute("controls", true);
    childrenTargetModal.setAttribute("autoplay", true);
    let sourceHtml = document.createElement("source");
    sourceHtml.setAttribute("type", "video/mp4");
    sourceHtml.src = `./assets/images/${folderMedia}/${mediaSelected.video}`;
    childrenTargetModal.append(sourceHtml);
  }
  targetModal.appendChild(childrenTargetModal);

  // Met à jour le titre du média
  updateMediaTitle(mediaSelected.title);
}

function toggleLike(id) {
  let currentEl = document.querySelector(`.likeAndHeart[data-id="${id}"]`);
  let idNumb = Number(id);
  let myCurrentElJS = allMedia.find((el) => el.id === idNumb);

  let likes = myCurrentElJS.likes;
  let isCheckedHTML = currentEl.querySelector(`.heart`);
  let totalLikes = document.querySelector(".like-quantity");
  let totalLikesValue = document.querySelector(".like-quantity").textContent;

  let likesCountMedia = parseInt(likes); // parseInt convertit la chaîne de caractères en un nombre entier.
  let isChecked = isCheckedHTML.dataset.liked;

  let newTemplate;
  let newTotalLikes;
  let newLikesCountMedia;
  let isSelected;
  let classHeart;

  if (isChecked === "no") {
    newLikesCountMedia = likesCountMedia + 1;
    myCurrentElJS.likes = myCurrentElJS.likes + 1;
    newTotalLikes = Number(totalLikesValue) + 1;
    isSelected = "yes";
    classHeart = "fas";
  } else {
    newLikesCountMedia = likesCountMedia - 1;
    newTotalLikes = Number(totalLikesValue) - 1;
    myCurrentElJS.likes = myCurrentElJS.likes - 1;
    isSelected = "no";
    classHeart = "far";
  }

  newTemplate = `
      <div class="likes"><span class="likesValueJs">${newLikesCountMedia}</span>
        <button class="heart" aria-label="likes" data-liked="${isSelected}" data-id="${id}">
          <i class="${classHeart} fa-heart checked" aria-hidden="true"></i>
        </button>
      </div>
    `;
  currentEl.innerHTML = "";
  currentEl.innerHTML = newTemplate;
  totalLikes.innerHTML = newTotalLikes;
}

// Gestion de la touche Entrée/Espace pour le cœur
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter" || event.key === " ") {
    const focusedElement = document.activeElement;
    if (focusedElement.classList.contains("heart")) {
      event.preventDefault(); // Empêche le comportement par défaut de la touche

      const mediaId = focusedElement.getAttribute("data-id");
      toggleLike(mediaId);

      // Remet le focus sur le bouton du cœur
      focusedElement.focus();
    }
  }
});

// Gestion des informations saisies dans la modal de contact et fermeture de la modal après submit
function redirectToPhotographerPage() {
  // Récupération des informations du formulaire
  const firstName = document.getElementById("first_name").value;
  const lastName = document.getElementById("last_name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // Affichage des infos dans la console
  console.log("Prénom :", firstName);
  console.log("Nom :", lastName);
  console.log("e-mail :", email);
  console.log("Message : ", message);

  // Fermeture de la modal
  closeModal();
}
