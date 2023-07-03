function mediaFactory(media, photographer) {
  let folderImage = photographer.name.split(" ")[0];

  function getHtmlMedia(index) {
    let mediaElement = document.createElement(`div`);
    mediaElement.classList.add("media"); // Ajout de la class "media" à chaque élement média
    let childElement = null;

    if (media.image) {
      // Création de l'élément image
      childElement = document.createElement(`img`);
      childElement.src = `./assets/images/${folderImage}/${media.image}`;
      childElement.alt = media.title;
      childElement.classList.add("media-image"); //Ajout d'une classe aux images/photos
    } else if (media.video) {
      // Création de l'élément vidéo
      childElement = document.createElement(`video`);
      childElement.src = `./assets/images/${folderImage}/${media.video}`;
      childElement.controls = true;
      childElement.classList.add("media-video"); // Ajout d'une classe aux vidéos
    }
    // Ajout de l'élément vidéo au mediaElement
    mediaElement.appendChild(childElement);

    // Gestion du clic pour ouvrir une modale
    childElement.addEventListener("click", () => {
      openModal(allMedia, index);
      console.log(
        "🚀 ~ file: media.js:29 ~ childElement.addEventListener ~ index:",
        index
      );
      console.log(
        "🚀 ~ file: media.js:29 ~ childElement.addEventListener ~ allMedia:",
        allMedia
      );
    });

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
    return mediaElement;
  }

  return { folderImage, getHtmlMedia };
}
