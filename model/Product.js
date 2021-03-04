class Product{
    constructor(id, name, quantity, price, category, image){
        this.id = id;
        this.name = name;                 
        this.quantity = quantity;
        this.price = price;
        this.category = category;
        this.image = image;
    }

    calcPrice(){
        return this.quantity*this.price;
    }
    
    returnCategory(){
        if(this.category == "Đồ uống"){
            return 1;
        }else if(this.category == "Đồ ăn vặt"){
            return 2;
        }
    }

}