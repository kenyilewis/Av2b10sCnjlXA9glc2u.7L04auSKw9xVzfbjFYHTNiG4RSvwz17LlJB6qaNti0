export const newsfeedCollect = (index, element, newsfeedUrl, $) => {
  const config= {
    "https://elpais.com/": () => {
      if (index < 5) {  // Limitar a los primeros 5 artículos
        const title = $(element).find('h2 a').text().trim();
        const url = $(element).find('h2 a').attr('href');
        const image = $(element).find('img').attr('src');
        const content = $(element).find('p').text().trim();
        const author = newsfeedUrl.split('//')[1];

          return {
            title,
            content,
            url,
            image,
            author,
          };
      }
    },
    "https://elmundo.es": () => {
      if (index < 5) {
        const titleElement = $(element).find('.ue-c-cover-content__headline');
        const imageElement = $(element).find('img');
        const contentElement = $(element).find('span'); // Ajuste del selector para contenido
        const urlElement = $(element).find('a'); // Ajuste del selector para contenido

        const title = titleElement.text().trim();
        const url = urlElement.attr('href');
        const image = imageElement.attr('src');
        const content = contentElement.text().trim();
        const author = newsfeedUrl.split('//')[1];

          return {
            title,
            content,
            url,
            image,
            author,
          };
      }
    }
  }

  return config[newsfeedUrl]();
}


