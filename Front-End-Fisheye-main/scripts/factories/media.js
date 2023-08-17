function mediaFactory(media, photographer) {
  let folderImage = photographer.name.split(" ")[0];

  function getHtmlMedia(index) {
    let mediaElement = document.createElement(`div`);
    mediaElement.classList.add("media"); // Ajout de la class "media" à chaque élement média
    mediaElement.setAttribute("role", "button");
    mediaElement.setAttribute("tabindex", "0");
    let childElement = null;

    if (media.image) {
      // Création de l'élément image
      childElement = document.createElement(`img`);
      childElement.src = `./assets/images/${folderImage}/${media.image}`;
      childElement.alt = media.title;
      childElement.classList.add("media-image"); // Ajout d'une classe aux images/photos
    } else if (media.video) {
      // Création de l'élément vidéo
      childElement = document.createElement(`video`);
      childElement.src = `./assets/images/${folderImage}/${media.video}`;
      childElement.classList.add("media-video"); // Ajout d'une classe aux vidéos
    }
    // Ajout de l'élément vidéo au mediaElement
    mediaElement.appendChild(childElement);

    // Gestion du clic pour ouvrir une modale
    childElement.addEventListener("click", () => {
      openModal(allMedia, index, folderImage);
    });

    // Gestion de l'événement pour ouvrir une modale (clavier et clic)
    mediaElement.addEventListener("keydown", (event) => {
      // mediaElement ou chilElement ?
      if (event.key === "Enter" || event.key === " ") {
        openModal(allMedia, index, folderImage);
      }
    });

    // Ajout de code HTML pour afficher le titre et le nombre de likes
    let titleElement = document.createElement(`section`);
    let templateTitleAndLike = `
      <div class="info" onclick="toggleLike('${media.id}')" >
        <div class="title">${media.title}</div>
        <div class="likeAndHeart"  data-id="${media.id}">
          <div class="likes"><span class="likesValueJs">${media.likes}</span>
            <button class="heart" data-liked="no" data-id="${media.id}">
              <i class="far fa-heart unchecked" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    titleElement.innerHTML = templateTitleAndLike;
    mediaElement.appendChild(titleElement);
    return mediaElement;
  }

  return { folderImage, getHtmlMedia };
}
