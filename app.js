const productClass = document.querySelector(".product-items");
const cartItems = document.querySelector(".cart-items");
const cartButton=document.querySelector(".fa-cart-plus");
const cartOverlay=document.querySelector(".cart-overlay");
const cartOverlayCart=document.querySelector(".cart");
const closeCart=document.querySelector(".close-cart");
const cartContent=document.querySelector(".cart-content");
const cartTotal=document.querySelector(".cart-total");
const clearCartBtn=document.querySelector(".clear-cart");

//cart
let cart = []
let buttonsDOM=[]
//getting the products
class Products {
    async getProducts() {
        let url = 'products.json';
        try {
            let res = await fetch(url);
            let data = await res.json();
            let products = data.items;
            return products;
        } catch (error) {
            console.log(error);
        }

    }
}

//display procucts


class UI {
    displayProducts(products) {
        let result = '';
        // console.log(products);
        products.forEach(product => {
            result += `
        <div class="ryz5 product-card">
            <img id="product-photo" src=${product.images} alt="">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button id="add-to-cart" class="btn-class" data-id=${product.id} ><i class="fas fa-shopping-cart"></i>Add To Cart</button>
        </div>
        `

        });
        productClass.innerHTML = result;
        //    console.log(result);
    }
    getBagButtons(){
        const buttons=[...document.getElementsByClassName("btn-class")];
        buttonsDOM=buttons;
        buttons.forEach(button =>{
            // console.log(button);
            let id=button.dataset.id;
            let inCart=cart.find(item => item.id === id);

            if(inCart){
                button.innerText="In Cart";
                button.disabled=true;
            }
            
                button.addEventListener('click',(event)=>{
                    event.target.innerText="In Cart";
                    event.target.disabled=true;
                    //get product from products
                    let cartItem={ ...Storage.getProduct(id),amount:1};
                    
                    //add product to the cart
                    cart=[...cart,cartItem];
                    //save cart in local storage
                    Storage.saveCart(cart);
                    //set cart value
                    this.setCartVAlue(cart);
                    //display cart item
                    this.addCartItem(cartItem);
                    //show the cart
                    this.showCart();
                })            
        });
    }

    setCartVAlue(cart){
    let tempTotal=0;
    let itemsTotal=0;

    cart.map(item => {
        tempTotal += item.price*item.amount;
        itemsTotal += item.amount
    })
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText=itemsTotal;
    
    }
    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `<img id="cartItemImage" src=${item.images} alt="">
        <div>
            <h4>${item.name}</h4>
            <h5><span>$</span>${item.price}</h5>
            <span data-id=${item.id} class="remove-item">remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id} ></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id} ></i>
        </div>`;
        cartContent.appendChild(div);
        
    }
    showCart(){
        cartOverlay.classList.add("transparentBcg");
        cartOverlayCart.classList.add("showCart");
    }

    setupAPP(){
        cart = Storage.getCart();
        this.setCartVAlue(cart);
        this.populateCart(cart);
        this.cartLogic();
    }
    populateCart(){
        cart.forEach(item=>this.addCartItem(item));
    }

    cartLogic(){
        clearCartBtn.addEventListener("click",()=>
        this.ClearCart() );
        //cart functionality
        cartContent.addEventListener('click',event =>{
            if(event.target.classList.contains('remove-item'))
            {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);

            }
            else if(event.target.classList.contains('fa-chevron-up')){
                let addAmount = event.target;   
                let id=addAmount.dataset.id;
                let tempItem = cart.find(item =>item.id === id);
                tempItem.amount= tempItem.amount+1;
                Storage.saveCart(cart);
                this.setCartVAlue(cart);
                // console.log(tempItem);
                // console.log(addAmount.parentElement.parentElement);
                
                addAmount.parentElement.nextElementSibling.innerText=tempItem.amount;

                // addAmount.nextElementSibling.innerText=tempItem.amount;
                // console.log(newAmount);
                // newAmount.innerText=tempItem.amount;
            }
            else if(event.target.classList.contains('fa-chevron-down')){
                let lowerAmount = event.target;
                let id=lowerAmount.dataset.id;
                // console.log(lowerAmount.parentElement);
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount=tempItem.amount-1;
                
                
                
                if(tempItem.amount > 0){
                    Storage.saveCart(cart);
                    this.setCartVAlue(cart);
                    lowerAmount.parentElement.previousElementSibling.innerHTML=tempItem.amount;
                }
                else{
                    
                    cartContent.removeChild(lowerAmount.parentElement.parentElement.parentElement);  
                    // lowerAmount.parentElement.previousElementSibling.innerHTML=tempItem.amount;
                    this.removeItem(id);
                }
                
            }
        })
    }
    ClearCart(){
        let cartItems= cart.map(item=> item.id);
        cartItems.forEach(id =>this.removeItem(id));
        
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart();
    
    }
    hideCart(){
        cartOverlay.classList.remove("transparentBcg");
        cartOverlayCart.classList.remove("showCart");
    }
    removeItem(id){
        cart = cart.filter(item => item.id !== id);
        this.setCartVAlue(cart);
        Storage.saveCart(cart);
        // console.log(cart);
        
        let button = this.getSingleButton(id);
        button.disabled=false;
        button.innerHTML=`<i class="fas fa-shopping-cart"></i>Add to Cart`;
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id)
    }
}

//local storage
class Storage {
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    }
    static getProduct(id){
        let products=JSON.parse(localStorage.getItem("products"));
        // console.log(products);
        return products.find(product => product.id === id)
    }
    static saveCart(cart){
        localStorage.setItem("cart",JSON.stringify(cart));
    }
    static getCart(){
    return localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    // console.log('DOM fully loaded and parsed');
    const p1 = new Products();
    const ui = new UI();
    //setup app
    ui.setupAPP();
    const data = p1.getProducts()
    .then((products) => {
    ui.displayProducts(products)
    Storage.saveProducts(products);
    })
    .then(()=>ui.getBagButtons());
    
});
cartButton.addEventListener('click',()=>{
    cartOverlay.classList.add("transparentBcg");
    cartOverlayCart.classList.add("showCart");
})
closeCart.addEventListener('click',()=>{
    cartOverlay.classList.remove("transparentBcg");
    cartOverlayCart.classList.remove("showCart");
})