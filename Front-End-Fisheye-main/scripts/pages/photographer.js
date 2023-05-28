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
});
