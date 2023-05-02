async function getPhotographers() {
  const photographers = await fetch(
    "https://jsonplaceholder.typicode.com/users"
  );
  if (photographers.ok === true) {
    const photographersResponse = await photographers.json();
    return {
      photographers: photographersResponse,
    };
  }
  throw new Error("Impossible de contacter le serveur");
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerFactory(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();

/*
const photographers = fetch(
  "https://jsonplaceholder.typicode.com/users"
).then((photographers) => photographers.json);

fetch('https://jsonplaceholder.typicode.com/users"').then(
  (photographers) => photographers.json
);
*/
