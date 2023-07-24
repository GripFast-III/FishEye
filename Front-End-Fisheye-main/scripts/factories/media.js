function mediaFactory(media, photographer) {
  let folderImage = photographer.name.split(" ")[0];

  function getHtmlMedia(index, medias) {
    let mediaElement = document.createElement(`div`);
    mediaElement.classList.add("media"); // Ajout de la class "media" à chaque élement média
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

    // Ajout de code HTML pour afficher le titre et le nombre de likes
    let titleElement = document.createElement(`section`);
    let templateTitleAndLike = `
    <div class="info">
     <div class="title">${media.title}</div>
     <div class="likeAndHeart">
      <div class="likes">${media.likes}
      <button class="heart">
       <i class="far fa-heart unchecked" aria-hidden="true"></i>
       <i class="fas fa-heart checked" aria-hidden="true"></i>
      </button>
      </div>
     </div>
    </div>
    `;
    titleElement.innerHTML = templateTitleAndLike;
    mediaElement.appendChild(titleElement);

    // Met le contenu de la div avec l'id "total-likes" à jour
    let totalLikes = 0;
    allMedia.forEach((mediaItem) => {
      //<--"medias" n'est pas reconnu dans la consol et le filtre de tri ne fonctionnera pas
      totalLikes += mediaItem.likes;
    });

    mediaElement.insertAdjacentHTML(
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
    return mediaElement;
  }

  return { folderImage, getHtmlMedia };
}
