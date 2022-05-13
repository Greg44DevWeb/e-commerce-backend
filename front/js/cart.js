
let tabProductInLs = JSON.parse(localStorage.getItem("product")); //JSON;parse converti les données au format JSON qui sont dans le LS de l'objet JS
console.log(tabProductInLs);

// ********* AFFICHAGE DES PRODUITS DU PANIER **********************/
// Sélection de la classe pour injection du code HTML

const DisplayKanapCart = () => {
   
     if (tabProductInLs === null) {
        alert ('Votre panier est vide !');
        window.location.href = "index.html";

        tabProductInLs = [];
    };
       
       // ************ FETCH POUR RECCUPERER LES INFORMATIONS PRODUITS SIMILAIRES AU LOCALSTORAGE *********/
             if (tabProductInLs) {
                for (let product in tabProductInLs) 
                fetch(`http://localhost:3000/api/products/${tabProductInLs[product].id}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    if(data.price != undefined && tabProductInLs[product].color != undefined)
                        {console.log('afficher les articles dans le DOM');

        // *********** CREATION DES ELEMENTS NECESSAIRES DANS LE DOM **************/
                    let cartItems = document.getElementById("cart__items"); // stocker l'ID de la section dans le DOM
                    let Article = document.createElement("article"); // Créer une balise <article>
                    cartItems.appendChild(Article);
                    Article.setAttribute("class" , "cart__item"); // attribuer une classe à la balise <article>
                    Article.setAttribute("data-id", `${tabProductInLs[product].id}`); // Attribuer les valeurs pour l'ID
                    Article.setAttribute("data-color", `${tabProductInLs[product].color}`); //  Attribuer les valeurs pour la couleur
                    console.log(Article + 'ok');

                    // Création de la DIV pour l'image du produit dans le DOM
                    let imgDiv = document.createElement("div");
                    Article.appendChild(imgDiv);
                    imgDiv.setAttribute("class" , "cart__item__img");

                    let imgKanap = document.createElement("img");
                    imgDiv.appendChild(imgKanap);
                    imgKanap.src = data.imageUrl;
                    imgKanap.alt = data.altTxt;

                    // Création de la DiV pour le contenu attaché au produit dans le DOM
                    let KanapContent = document.createElement("div");
                    Article.appendChild(KanapContent);
                    KanapContent.setAttribute("class" , "cart__item__content");

                    // création des enfants de la div de contenu
                    let KanapDescribe = document.createElement("div")
                    KanapContent.appendChild(KanapDescribe);
                    KanapDescribe.setAttribute("class" , "cart__item__content__description");

                    // Insertion du Titre du produit dans le DOM
                    let titleKanap = document.createElement("h2");
                    KanapDescribe.appendChild(titleKanap);
                    titleKanap.innerHTML = data.name;

                    // Insertion de la couleur du produit affiché dans le DOM
                    let KanapColor = document.createElement("p");
                    KanapDescribe.appendChild(KanapColor);
                    KanapColor.innerHTML = tabProductInLs[product].color;

                    // Insertion du Prix du produit
                    let KanapPrice = document.createElement("p");
                    KanapDescribe.appendChild(KanapPrice);
                    KanapPrice.innerHTML = `${data.price} €`;

                    // Insertion de la div Conteneur principal pour la quantité
                    let divSettings = document.createElement("div");
                    KanapDescribe.appendChild(divSettings);
                    divSettings.setAttribute("class" , "cart__item__content__settings__quantity");

                    // Insertion de la Div contenant le select de quantité
                    let divSettingsQuantity = document.createElement("div");
                    KanapDescribe.appendChild(divSettingsQuantity);
                    divSettingsQuantity.setAttribute("class" , "cart__item__content__settings");

                    // insertion de la balise contenant la quantité
                    
                    let quantityDiv = document.createElement("p");
                    divSettingsQuantity.appendChild(quantityDiv);
                    quantityDiv.innerHTML =`Qté : `;

                    // Insertion de l'input quantité et de ses attribut (class, type, name, min, max)
                    let quantityInput = document.createElement("input");
                    quantityDiv.appendChild(quantityInput);
                    quantityInput.setAttribute("type" , "number");
                    quantityInput.setAttribute("class" , "itemQuantity");
                    quantityInput.setAttribute("name" , "itemQuantity");
                    quantityInput.setAttribute("min" , "1");
                    quantityInput.setAttribute("max" , "100");
                    quantityInput.setAttribute("value" , `${tabProductInLs[product].quantity}`);

                    // Insertion de la div contenant le bouton de suppression d'article
                    let btnRemoveDiv = document.createElement("div");
                    KanapDescribe.appendChild(btnRemoveDiv);
                    btnRemoveDiv.setAttribute("class" , "cart__item__content__settings__delete");

                    // insertion du bouton de suppression
                    let btnRemove = document.createElement("p");
                    btnRemoveDiv.appendChild(btnRemove);
                    btnRemove.setAttribute("class" , "deleteItem");
                    btnRemove.innerHTML = `supprimer`;
                    
                };
            });
    };
};

DisplayKanapCart();

// *********** CALCUL DE LA QUANTITE TOTAL ********************/
const getTotalQuantity = () => {
    let tabQuantityKanap = [];
        for (let b = 0; b < tabProductInLs.length; b++) {
            let totalQuantityKanap = tabProductInLs[b].quantity;
            tabQuantityKanap.push(totalQuantityKanap);
            console.log(tabQuantityKanap); //*** CONTROLE
           
        };

// ********** CONVERSION D'UN TABLEAU EN NOMBRE ***************/

let totalQuantityKanap = 0;
    for (let c = 0; c < tabQuantityKanap.length; c++){
        tabQuantityKanap[c] = parseInt(tabQuantityKanap[c]);
        totalQuantityKanap += tabQuantityKanap[c];
    };
    // Insertion de la quantité totale dans le DOM
    let totalArticles = document.querySelector("#totalQuantity");
    totalArticles.innerHTML = totalQuantityKanap;
    
};
getTotalQuantity();

// ********** CALCUL DU PRIX TOTAL ******************/
// APPEL API pour identifier les produits et leur prix par rapport au LS
let totalPriceCart = 0;
    for (let d = 0 ; d <tabProductInLs.length ; d++) {
            fetch(`http://localhost:3000/api/products/${tabProductInLs[d].id}`)
                        .then((response) => response.json())
                        .then((data) => {
            // Calcul du prix total des produits du panier selon leur quantité affichée 
            const getTotalPrice = () => {
                totalPriceCart += Number(data.price) * Number(tabProductInLs[d].quantity); //converti les arguments en nombre
                let insertTotalPrice = document.querySelector("#totalPrice");
                insertTotalPrice.innerHTML = totalPriceCart;     // insertion du prix dans le DOM 
            };
getTotalPrice ();

//*************SUPPRESSION D'UN PRODUIT DU PANIER ***********/
const deleteItem = () => {
    let deleteItem = document.querySelectorAll(".deleteItem"); // Réccupération de tous les boutons "supprimer" du DOM
    
    for (let e = 0 ; e < deleteItem.length ; e++) {   
        deleteItem[e].addEventListener("click" , (deleteEvent) => {
        deleteEvent.preventDefault(); 
                let deleteId = deleteEvent.target.closest(".cart__item").dataset.id;
                let deleteColor = deleteEvent.target.closest(".cart__item").dataset.color;
                // Methode filter pour sélectionner les élèments à garder et suupprimer les élèments du btn cliqué      
                tabProductInLs = tabProductInLs.filter((element) => element.id != deleteId || element.color != deleteColor);
                
                // Envoi de la variable dans le LS et Rechargement de la page
                localStorage.setItem("product", JSON.stringify(tabProductInLs));
                if (tabProductInLs.length === 0){
                    localStorage.clear(); // Suppresion de la clé pour vider le LS
                };
                window.location.reload(); // rechargement de la page 
        });
    };   
};
deleteItem();

//******************AJUSTEMENT DES QUANTITES *******************/
const quantityAdjust = () => {
    let quantitySelect = document.querySelectorAll(".itemQuantity");
    console.log(quantitySelect);
    
    for (let f = 0 ; f < quantitySelect.length; f++) {
        quantitySelect[f].addEventListener("change" , (adjustEvent) => {
        adjustEvent.preventDefault();
    //Identification du produit (ID, couleur) sélectionné pour effectuer le changement    
            let adjustEventId = adjustEvent.target.closest(".cart__item").dataset.id;
            let adjustEventColor = adjustEvent.target.closest(".cart__item").dataset.color;
            let registredProduct = tabProductInLs[f].quantity;
            let updateChange = Number(quantitySelect[f].value); // converti l'argument en nombre
            //Methode Find pour trouver les élèments dont les paramètres sont définis
            const ResultFind = tabProductInLs.find((element) => 
            element.updateChange !== registredProduct &&
            element.id === adjustEventId &&
            element.color === adjustEventColor);
            
            ResultFind.quantity = updateChange;
            if(ResultFind.quantity <= 0 || ResultFind.quantity > 100){
                alert('Saisir une quantité entre 1 et 100');
                ResultFind.quantity = 1;
            };
            
            tabProductInLs[f].quantity = ResultFind.quantity; 
           
             // Sauvegarde du LS
            localStorage.setItem("product", JSON.stringify(tabProductInLs));
            window.location.reload(); // rechargement de la page  
        });
    };   
};
        quantityAdjust();
    });
};

// ******************** VALIDATION DU FORMULAIRE *****************/
    
let form = document.querySelector(".cart__order__form");
// Variables de paramétrages Message d'erreur de saisie formulaire
let validationMsg = "Saisie validée";
let InvalidMsg = "Saisie incorrecte";
let emailErrorMsg = "Email Invalide (exemple : johndoe@gmail.com)";
// Variable contenant les Expressions Relationnelles 
let txtRegExp = new RegExp(/^[a-z0-9éèà, -'.\s-]{2,30}$/i); // New RegExp
let EmailRegExp = new RegExp(/^[a-z0-9\-_]+[a-z0-9\.\-_]*@{1}[a-z0-9\-_]{2,}\.[a-z\.\-_]+[a-z\-_]+$/i); // New RegExp
console.log(form);

/**Fonction qui vérifie les expressions régulières ayant la même règle
 * Retourne true ou false selon si la condition est remplie ou non
 * @param {*} form 
 */
const validform = (form) => {
    let testregExp = txtRegExp.test(form.value);
    let ErrorMsg = form.nextElementSibling;
    if(testregExp == true ) {
        console.log(testregExp);
        console.log('testRegExp');
        ErrorMsg.innerHTML = `${validationMsg}`;
        ErrorMsg.style.color = "#a8fbe5";
        }else{
            ErrorMsg.innerHTML = `${InvalidMsg}`;
            ErrorMsg.style.color = "#FBA8BE"; 
        };
    };

// Ecoute de l'évenement sur l'input
form.firstName.addEventListener("change" , function() {
    validform(this);
});
form.lastName.addEventListener("change" , function() {
    validform(this);
});
form.address.addEventListener("change" , function() {
    validform(this);
});
form.city.addEventListener("change" , function() {
    validform(this);
});

/** Fonction qui vérifie les expressions régulières pour l'adresse Email
 *  Retourne true or false selon si la condition est remplie ou non
 * @param {*} form 
 */
const validEmail = (form) => {
    let testEmailRegExp = EmailRegExp.test(form.value);
    console.log(testEmailRegExp);
    let ErrorMsg = form.nextElementSibling;
    if(testEmailRegExp == true) {
        ErrorMsg.innerHTML = `${validationMsg}`;
        ErrorMsg.style.color = "#a8fbe5";
        }else {
            ErrorMsg.innerHTML = `${emailErrorMsg}`;
            ErrorMsg.style.color = "#FBA8BE"; 
        };
};
// Ecoute de l'évenement sur l'input
form.email.addEventListener("change" , function() {
    validEmail(this);
});

//***************** ENVOI DU FORMULAIRE  ******************/
// Configuration des données pour l'envoi
    //Ecoute de l'évenement sur le bouton "commander"
    const cmdBtn = document.querySelector("#order");
    cmdBtn.addEventListener("click" , (event) => {
    event.preventDefault();
    
    // réccupération des données du formulaire
    const contact = {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        address: document.querySelector("#address").value,
        city: document.querySelector("#city").value,
        email: document.querySelector("#email").value,
    };
    console.log(contact);

    // préparation des données produit contenus dans le LS
    let products = [];

    // boucle pour réccupérer les ID des produits du LS
    for (let u = 0 ; u < tabProductInLs.length; u++) {
        products.push(tabProductInLs[u].id);
    }
    console.log(products);
    // Envoi de l'objet contact dans le localStorage
    localStorage.setItem("contact", JSON.stringify(contact));

    // Configuration de l'objet contact/products pour envoi
   const dataUserContent = {
        contact, 
        products
    };
    console.log(dataUserContent);
    if (
        (contact.firstName != " " ||
        contact.lastName != " " ||
        contact.address != " " ||
        contact.city != " "||
        contact.email != " ")
    ) {
    // Paramètre de la requète au serveur
    const send = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataUserContent),
    };

    const sendToServer = () => { 
        fetch("http://localhost:3000/api/products/order", send)
        .then(async (response) => {
            try {
                if (response.ok) {
                    const contentData = await response.json();
                    window.location.href = `confirmation.html?orderId=${contentData.orderId}`;
                }else {
                    alert("La saisie de votre formule n'est pas valide, veuillez compléter les informations demandées");
                   // alert(`Vérifier la saisie de votre formulaire : erreur ${response.status}`);
                }
            }
            catch (error) {
                alert(`Nature de l'erreur au catch : ${error}`);
            }
        })
        .catch((error) => console.log(error));
    }
    sendToServer();
};
});
