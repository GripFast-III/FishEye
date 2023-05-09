function photographerFactory(data) {
  const { name, portrait, id, city, country, tagline, price } = data;

  const picture = `assets/images/photographers/${portrait}`;

  function getUserCardDOM() {
    //const card = document.createElement("card");
    const article = document.createElement("article");

    const img = document.createElement("img");
    img.setAttribute("src", picture);

    const h2 = document.createElement("h2");
    h2.textContent = name;

    const paragrapheCity = document.createElement("h3");
    paragrapheCity.textContent = city;

    const paragrapheCountry = document.createElement("h3");
    paragrapheCountry.textContent = country;

    const tagline = document.createElement("h4");
    tagline.textContent = tagline;

    const price = document.createElement("p");
    price.textContent = price;

    article.appendChild(img);
    article.appendChild(h2);
    article.appendChild(paragrapheCity);
    article.appendChild(paragrapheCountry);
    article.appendChild(tagline);
    article.appendChild(price);
    return article;
  }
  return { name, picture, id, city, tagline, price, getUserCardDOM };
}
