class CartItem {
    constructor(product, amount){
        this.product = product;
        this.amount = amount;
    }   

    calcTotal (){
       return (this.product.price * this.amount);
    }
}