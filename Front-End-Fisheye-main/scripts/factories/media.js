function mediaFactory(data, photographerId) {
  const filterMedia = data.media.filter(function (media) {
    return media.photographerId === photographerId;
  });

  filterMedia.forEach(function (media) {
    let mediaElement = document.createElement(`div`);

    if (media.image) {
      //Création de l'élément image
      let imageElement = document.createElement(`img`);
      imageElement.src = `../photographers.json/${media.image}`;
      imageElement.alt = media.title;
      console.log("🚀 ~ file: media.js:14 ~ media.title:", media.title);

      //Ajout de l'élément image au mediaElement
      mediaElement.appendChild(imageElement);
    } else if (media.video) {
      // Création de l'élément vidéo
      let videoElement = document.createElement(`video`);
      videoElement.src = `../photographers.json/${media.video}`;
      videoElement.controls = true;

      //Ajout de l'élément vidéo au mediaElement
      mediaElement.appendChild(videoElement);
    }

    //Ajout du mediaElement au conteneur principal
    document.getElementById(`main`).appendChild(mediaElement);
  });
}
