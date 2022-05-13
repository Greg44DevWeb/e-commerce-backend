//*****CONFIRMATION DE COMMANDE ET AFFICHAGE ID DANS LE DOM */
/**
 * Fonction qui réccupère le UrlSearchParam pour l'afficher dans le DOM
 */
const getIdCommandNumber = () => {
    const url_orderId = window.location.search;
    const urlSearchParams = new URLSearchParams(url_orderId);
    const orderId = urlSearchParams.get("orderId");
    document.getElementById("orderId").textContent = orderId;
    
    localStorage.clear();
   
  };
  getIdCommandNumber();