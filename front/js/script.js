
main ()

//************ FONCTION D'APPEL PRINCIPALE *******************/
/**
 * Fonction principale asyncrone 
 * Retourne le résultats de l'appel API dans le DOM*/
async function main () {
    const articles = await getArticles();
    console.log(articles);
// boucle sur l'article pour réccupérer chaque information de chaque article
    for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
// fonction d'affichage des articles
    displayArticle(article);
    }  ;
}; 

//*********  APPEL ET RECCUPERATION DES DONNEES DE L'API ********/
/**
 * Réccupère les données de l'API e
 * @returns les données de l'API ou un message d'erreur 
 */
function getArticles() {
    const url_api = 'http://localhost:3000/api/products';
    return fetch (url_api)
    .then(function(response) {
        return response.json()
    })

// affiche un article 
    .then(function (article){
        return article
    })

// Emet une erreur si problème de fetch
    .catch(function(error){
    alert('Une erreur est survenue ! '+ (error))
    })
};

//*********** AFFICHAGE DANS LE DOM ***********************/
/**
 * fonction d'affichage d'un article' avec intégration de chaque donnée pour chaque article dans le HTML
 * @param {*} article 
 */
function displayArticle (article) {
    document.getElementById("items").innerHTML += ` 
    <a href="./product.html?id=${article._id}">
        <article>
        <img src=${article.imageUrl} alt=${article.altTxt}>
        <h3 class="productName">${article.name}</h3>
        <p class="productDescription">${article.description}</p>
        </article>
    </a>` 
};


