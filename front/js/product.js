//**************** VARIABLES DE RECUPERATIONS D'ELEMENTS DU DOM **********************

let productId = getProductId(); // Variable qui contient l'ID du produit
let productColor = document.getElementById("colors"); // Variable qui contient les couleurs
let productQuantity = document.getElementById("quantity");// Variable qui contient la quantité
let productData = [];

/** Réccupération de l'ID du produit de la page
 * 
 * @returns Chaine de caractère de l'ID (String)
 */
function getProductId() {
    return new URL(location.href).searchParams.get("id");
}

/** APPEL API EN PRENANT EN COMPTE L'ID DE L'ARTCILE
 * Réccupérer les données concernant le produit
 * @param {*} productId 
 * @returns promise contenant l'objet 
 */
   function getProduct() {   
    fetch(`http://localhost:3000/api/products/${productId}`)
        .then((response) => response.json())
        // Promesse sous forme d'objet
        .then((data) => {
        productData = data // console.log(productData); TEST DE VERIFICATION
        console.log(productData);
        hydrateProduct(productData);
        addProductOnClick(productData);
        })
        // Emet une erreur si problème d'appel à l'API
        .catch((error) => {
        alert("Une erreur est survenue !" + (error));
        });
}
getProduct();


//************ INSERTION DES ELEMENTS DANS LE DOM ********************/
 /** Fonction qui permet d'afficher les élèments d'un produit défini par son ID dans le DOM
 * @param {*} productData 
 */
const hydrateProduct = (productData) => {
    let productName = document.getElementById("title"); // variable qui contient l'Id Title
    productName.innerHTML = productData.name;

    let productImg = document.createElement("img"); // Variable qui contient la balise image (enfant de la div .item__img)
    document.querySelector(".item__img").appendChild(productImg); // sélection du parent de l'image
    productImg.src = productData.imageUrl; // insertion des images via les données API
    productImg.alt = productData.altTxt; // insertion du texte alternatif via les données API

    let productPrice = document.getElementById("price");
    productPrice.innerHTML = productData.price;

    let productDescription = document.getElementById("description");
    productDescription.innerHTML = productData.description;

    let colors = productData.colors; // variable qui contient les couleurs du produit

    let select = document.getElementById("colors") // Variable qui contient la liste des couleurs de l'id du produit

    // Boucle pour obtenir autant de balises que de couleurs liées à un artcile 
    colors.forEach(colors => {              
    let Option = document.createElement("option");// Variable qui contient l'élèment du DOM
    Option.innerHTML = `${colors}`; 
    Option.value = `${colors}`;
    select.appendChild(Option);
    });     
}

//************* GESTION DU PANIER SELON CONDITION QUANTITES ET COULEURS ********/
/**Fonction d'ecoute d'événement au click sur le bouton 'commander'
 * 
 * @param {*} productData 
 */
 const addProductOnClick = () => { 
    let btnCommand = document.getElementById("addToCart");
    
    btnCommand.addEventListener("click", (event) => { //Ecoute de l'event
         event.preventDefault(); 

    let quantity = productQuantity.value;
    let color = productColor.value;
    
    console.log(color, quantity);
 // **************** CONFIRMATION DU CHOIX VIA POP-UP ********************/
 /**Ouvre un pop-up de confirmation
  * Redirige vers l'accueil si le choix et annulé ou renvoi vers la page panier si le choix est validé
  */      
        const confirmDataPopUp = () => {
            if (
              window.confirm(
                `${productData.name}, de couleur ${color} est ajouté au panier.
OK pour voir le panier ou ANNULER pour continuer votre commande`
              )
            ) {
              window.location.href = "cart.html";
            } else {
              window.location.href = "index.html";
            }
          };
        /**Confirmation des conditions des valeurs d'entrées
         * 
         * @returns Message d'alerte si faux ou pop-up si true
         */
        const dataEntriesValidation = () => {
            if (
                quantity < 1 || //ou
                quantity > 100 || // ou
                color === ""
            ) {
                return alert("Saisissez des options valides pour la couleur et la quantité");
            } else {
                return confirmDataPopUp();
            }
        };
       
        //Création d'un objet permettant de stocker les clés et valeurs du produit

        let objKanapAddInLs = {
            color: color,
            quantity: quantity,
            id: productId  
        };
        console.log(objKanapAddInLs);

        //initialisation du LocalStorage "key, value"/ conversion des donnée au format json , en objet javascript
        let tabKanaps = JSON.parse(localStorage.getItem("product"));
        console.log(tabKanaps);
        /**
         ** Ajoute les données dans au localStorage
         * Retourne une clé product et une valeur */
        const pushKanapInLs = () => {
            tabKanaps.push(objKanapAddInLs);
            localStorage.setItem("product", JSON.stringify(tabKanaps));
          };
    
         //*****  Bloc conditionnel qui prend en compte la quantité et la couleur selon l'ID du produit */
          
          if (
            objKanapAddInLs.quantity >= 1 && //et
            objKanapAddInLs.quantity <= 100 && // et
            objKanapAddInLs.color != ""
          ) {
            if (tabKanaps) {
              /**
               ** Méthode Find() pour rechercher un produit dont l'ID et la couleur sont identiques
               */  
              const findResult = tabKanaps.find(
                (element) =>
                  element.id === productId && element.color === color // Recherche d'un produit avec une id et une couleur identique
              );
              if (findResult) {
                findResult.quantity =
                  parseInt(objKanapAddInLs.quantity) + 
                  parseInt(findResult.quantity);
                localStorage.setItem("product", JSON.stringify(tabKanaps));  // Ajoute la quantité du produit si l'ID et la couleur est identtiques
                dataEntriesValidation();
              } else {
                pushKanapInLs(); 
                dataEntriesValidation(); 
              }
            } else {
              tabKanaps = []; // Envoie un nouveau produit dans le localStorage
              pushKanapInLs();
              dataEntriesValidation();
            }
          } else {
            dataEntriesValidation(); 
          }  
    });
};
