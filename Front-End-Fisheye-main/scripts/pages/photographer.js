const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
let currentPhotographerId = searchParams.get("id");
console.log("idPhotographer :", currentPhotographerId);

/*
const photographerId = [243, 930, 82, 527, 925, 195];

const result = data.filter(id(photographer){
    return id === photographerId;
});
*/

//J'ai voulu appeler les médias depuis le json afin de pouvoir les filtrer par la suite avec la const currentMedias
async function getInfos() {
  try {
    const fetchPhotographers = await fetch("./photographers.json");
    if (fetchPhotographers.ok) {
      const photographersResponse = await fetchPhotographers.json();
      if (photographersResponse) {
        // filterInformationId Filtrer les infos du photographe par son id
        let currentP = photographersResponse.photographers.filter((user) => {
          return user.id == currentPhotographerId;
        });

        // filtrer les medias par l'id du média qui doit être égal à l'id du photographe
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
  //displayPhotographer(photographer)
  //displayMedias(medias)
});

//Créer une nouvelle factory (nouveau document) media.js et y entrer l'appel des medias selon le photographe (même méthode que pour function photographerFactory(data))
