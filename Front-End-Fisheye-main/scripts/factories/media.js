function mediaFactory(media, photographer) {
  let folderImage = photographer.name.split(" ")[0];

  function getHtmlMedia() {
    let mediaElement = document.createElement(`div`);
    mediaElement.classList.add("media"); //Ajout de la class "media" à chaque élement média

    if (media.image) {
      //Création de l'élément image
      let imageElement = document.createElement(`img`);
      imageElement.src = `./assets/images/${folderImage}/${media.image}`;
      imageElement.alt = media.title;
      imageElement.classList.add("media-image"); //Ajout d'une classe aux images/photos

      //Ajout de l'élément image au mediaElement
      mediaElement.appendChild(imageElement);
    } else if (media.video) {
      // Création de l'élément vidéo
      let videoElement = document.createElement(`video`);
      videoElement.src = `./assets/images/${folderImage}/${media.video}`;
      videoElement.controls = true;
      videoElement.classList.add("media-video"); //Ajout d'une classe aux vidéos

      //Ajout de l'élément vidéo au mediaElement
      mediaElement.appendChild(videoElement);
    }
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
