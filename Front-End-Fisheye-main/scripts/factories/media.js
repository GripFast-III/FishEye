function mediaFactory(media, photographer) {
  let folderImage = photographer.name.split(" ")[0];

  function getHtmlMedia() {
    let mediaElement = document.createElement(`div`);

    if (media.image) {
      //Création de l'élément image
      let imageElement = document.createElement(`img`);
      imageElement.src = `./assets/images/${folderImage}/${media.image}`;
      imageElement.alt = media.title;

      //Ajout de l'élément image au mediaElement
      mediaElement.appendChild(imageElement);
    } else if (media.video) {
      // Création de l'élément vidéo
      let videoElement = document.createElement(`video`);
      videoElement.src = `./assets/images/${folderImage}/${media.video}`;
      videoElement.controls = true;

      //Ajout de l'élément vidéo au mediaElement
      mediaElement.appendChild(videoElement);
    }
    return mediaElement;
  }
  return { folderImage, getHtmlMedia };
}
