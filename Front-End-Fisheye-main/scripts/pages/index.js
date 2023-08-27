async function getPhotographers() {
  try {
    const fetchPhotographers = await fetch("./photographers.json");
    if (fetchPhotographers.ok) {
      const photographersResponse = await fetchPhotographers.json();
      if (photographersResponse.photographers) {
        return {
          photographers: photographersResponse.photographers,
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

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerFactory(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();

    // Gestion de la touche Enter ou Space pour les liens
    userCardDOM.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault(); // Évite le comportement par défaut de la touche Espace
        const url = userCardDOM.getAttribute("data-url");
        if (url) {
          window.location.href = url; // Redirige vers l'URL du photographe
        }
      } else if (e.key === "Tab" && e.shiftKey) {
        // Gestion du focus au clavier avec Shift+Tab pour le retour en arrière
        e.preventDefault(); // Empêche la tabulation par défaut
        const prevLink = userCardDOM.previousElementSibling;
        if (prevLink) {
          prevLink.focus(); // Définir le focus sur le lien précédent
        }
      }
    });

    photographersSection.appendChild(userCardDOM);

    // Gestion du focus au clavier avec la touche Tab (avancement)
    userCardDOM.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault(); // Empêche la tabulation par défaut
        const nextLink = userCardDOM.nextElementSibling;
        if (nextLink) {
          nextLink.focus(); // Définir le focus sur le prochain lien
        }
      }
    });
  });
}

async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();
