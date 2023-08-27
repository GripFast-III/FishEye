function photographerFactory(data) {
  const { name, portrait, id, city, country, tagline, price } = data;

  const picture = `assets/images/photographers/${portrait}`;
  const urlLocation = `./photographer.html?id=${id}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    const link = document.createElement("a");
    link.href = urlLocation;
    link.setAttribute("data-url", urlLocation);
    link.tabIndex = 0;

    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", name);

    const h2 = document.createElement("h2");
    h2.textContent = name;

    const paragrapheCity = document.createElement("h3");
    paragrapheCity.textContent = city;

    const paragrapheCountry = document.createElement("h3");
    paragrapheCountry.innerHTML = country;

    const taglineHtml = document.createElement("h4");
    taglineHtml.innerHTML = tagline;

    const priceHtml = document.createElement("p");
    priceHtml.innerHTML = price;

    article.appendChild(img);
    article.appendChild(h2);
    article.appendChild(paragrapheCity);
    article.appendChild(paragrapheCountry);
    article.appendChild(taglineHtml);
    article.appendChild(priceHtml);
    link.appendChild(article);

    return link;
  }
  return { name, picture, id, city, tagline, price, getUserCardDOM };
}
