var listDrink = [];

var listCart = [];

var listSearch = [];

var numberInCart = 0;
var totalMoneyInCart = 0;


// cuộn chuột là header đi theo
window.onscroll = function () {
  let header = document.getElementById("header");
  let sticky = header.offsetTop;

  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
  console.log("Cuộn trang", sticky);
};



//render Product
const renderProduct = (listProduct,divShow) => {
  let tempStr = "";

  for (currentProduct of listProduct) {
    tempStr += `
        <div style="margin-top:10px;" class="col-3">
        <div class="card p-2">
            <img style="height: 250px" src="${currentProduct.image}" class="w-100" alt="hình ảnh sản phẩm" />
            <p style="color: aqua; font-size: 25px; text-align: center">
               ${currentProduct.name}
            </p>
            <p>
                Giá: <span style="font-size: 20px; color: #f84f8a">${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(currentProduct.price)}</span>
            </p>
            <button class="btn btn-primary" onclick="addToCart(${currentProduct.id}, '${currentProduct.name}', ${currentProduct.quantity}, ${currentProduct.price}, '${currentProduct.category}', '${currentProduct.image}')">
                Thêm vào giỏ hàng
            </button>
        </div>
    </div>
        `;
  }

  document.getElementById(divShow).innerHTML = tempStr;  
};



// 5. Add to cart
//Thêm vào giỏ hàng
const addToCart = (idProduct, name, quantity, price, category, image ) => {   
  

  
    //check trùng trong list card
    let indexCart = getIndexInCart(idProduct, listCart);    

    if (indexCart != -1) {
        if((listCart[indexCart].amount + 1) <= quantity){
            numberInCart++;
            listCart[indexCart].amount++;
        }else{
            Swal.fire({
                title: "Đây là số lượng tối đa bạn có thể thêm",
                icon: "info",                
                confirmButtonText: 'Đồng Ý',
            }).then((result) => {
                if(result.isConfirmed){
                    return;
                }
            })
        }
        
    }else{
              
        numberInCart++;
        let newProduct = new Product(idProduct, name, quantity,price, category, image);
        let newCart = new CartItem(
            newProduct,1);
        listCart.push(newCart);
    }
  
  
  document.getElementById("header_cart_number").innerHTML = numberInCart;
  console.log("list cart", listCart);
};


// 7. Lấy index của cart item trong 1 list cart
const getIndexInCart = (idProduct, listCart) => {
    for (let i = 0; i < listCart.length; i++) {
      let currentCart = listCart[i];
      if (currentCart.product.id == idProduct) {
        return i;
      }
    }
    return -1;
};

// 8. Show trang cart ra
const showCart = () => {
  if(listCart.length == 0){
    document.getElementById("table_body_cart").innerHTML = `<h2 style="color:red">Không có sản phẩm</h2>`;
    document.getElementById("total_amount").innerHTML = 0;
    document.getElementById("btnPay").disabled = true;

  }else{
    document.getElementById("btnPay").disabled = false;
    renderCartItem(listCart);
  }
};


// 9. Show cart item trong trang cart
const renderCartItem = (listCartParam) => {
  let tempStr = "";
  totalMoneyInCart = 0; 

  for(let currentCart of listCartParam){
    totalMoneyInCart += currentCart.calcTotal();    

    tempStr += `<tr>
    <td>${currentCart.product.name}</td>
    <td>
        <img style="width:100px; height:100px" src="${currentCart.product.image}" alt="">
    </td>    
    <td>${(currentCart.product.price).toLocaleString('vi', {style : 'currency', currency : 'VND'})}</td>
    <td>
        <button onclick="clickAddAmount(${currentCart.product.id},${currentCart.product.quantity})" class="btn btn-primary"><i class="fa fa-plus"></i></button>
        <span style="font-size: large; font-weight: bold;">${currentCart.amount}</span>
        <button  onclick="clickMinusAmount(${currentCart.product.id})" class="btn btn-warning"><i class="fa fa-minus"></i></button>
     </td>
    <td>${(currentCart.calcTotal()).toLocaleString('vi', {style : 'currency', currency : 'VND'})}</td>
    
    <td>
        <button  onclick="deleteCartItem(${currentCart.product.id})" class="btn btn-danger"><i class="fa fa-times"></i></button>
    </td>
</tr>`;
  }
  document.getElementById("table_body_cart").innerHTML = tempStr;
  document.getElementById("total_amount").innerHTML = totalMoneyInCart.toLocaleString('vi', {style : 'currency', currency : 'VND'});
};

// 10. Ấn nút cộng thêm Amount
const clickAddAmount = (idProduct, quantity) => {

      if(idProduct == 0){
        return;
      }
      let indexCart = getIndexInCart(idProduct, listCart);

      if(listCart[indexCart].amount + 1 <= quantity ){
        listCart[indexCart].amount++ ;
        numberInCart++ ;
        renderCartItem(listCart);
      }else{
        Swal.fire({
          title: "Đây là số lượng tối đa bạn có thể thêm",
          icon: "info",                
          confirmButtonText: 'Đồng Ý',
      }).then((result) => {
          if(result.isConfirmed){
              return;
          }
      })
      }                
  
  document.getElementById("header_cart_number").innerHTML = numberInCart;
};

// 11. Ấn nút trừ Amount
const clickMinusAmount = (idProduct, quantity) => {
 
  if(idProduct == 0){
    return;
  }
  let indexCart = getIndexInCart(idProduct, listCart);
    //Kiểm tra xem add có lố quantity ko ?
    if(listCart[indexCart].amount - 1 >  0 ){
      listCart[indexCart].amount-- ;
      numberInCart-- ;
      renderCartItem(listCart);
    }else{
      Swal.fire({
        title: "Bạn có muốn xóa sản phẩm này",
        icon: "error",                
        confirmButtonText: 'Đồng Ý',
        showCancelButton: true,
    }).then((result) => {
        if(result.isConfirmed){
            listCart.splice(indexCart,1);
            numberInCart-- ;
            document.getElementById("header_cart_number").innerHTML = numberInCart;
            showCart();
        }
    })
    }  
             

  document.getElementById("header_cart_number").innerHTML = numberInCart;
};

// 12. Xóa sản phẩm ra khỏi listCart
const deleteCartItem = (idProduct) => {

  let indexCart = getIndexInCart(idProduct, listCart);
  if(indexCart == -1){
    return;
  }
  Swal.fire({
    title: "Bạn có muốn xóa sản phẩm này",
    icon: "error",                
    confirmButtonText: 'Đồng Ý',
    showCancelButton: true,
}).then((result) => {
    if(result.isConfirmed){
      numberInCart -= listCart[indexCart].amount;  
      listCart.splice(indexCart,1);
      document.getElementById("header_cart_number").innerHTML = numberInCart;
      showCart();
    }
})
 
};






//14. Tìm kiếm đồ uống 
const searchDrink = () => {
  let keyword = document.getElementById("inpSearchDrink").value;
  $('#div_drinkPaging').html('');
  $('#div_drinkPaging').html('<ul id="drinkPaging" ></ul>');
  getAllDrink(keyword, 1, "none", renderProduct);

};

//14. Tìm kiếm đồ ăn vặt
const searchFood = () => {
  let keyword = document.getElementById("inpSearchFood").value;
  $('#div_foodPaging').html('');
  $('#div_foodPaging').html('<ul id="foodPaging" ></ul>');
  getAllFood(keyword, 1, "none", renderProduct);

};


// dùng để có thể nhập liệu trên swal
$.fn.modal.Constructor.prototype._enforceFocus = function() {};


//15. Ấn nút thanh toán
const clickPayment = () => {
  let phoneNumber = document.getElementById("inp_phone_payment").value;
  createVerificationCode(phoneNumber, listCart, autoRunInIndex);

}



//=================AUTO=============================



const autoRunInIndex = () => {
  getAllDrink ("",1,"none", renderProduct);

  getAllFood("", 1 ,"none", renderProduct);
  listCart = [];
  document.getElementById("header_cart_number").innerHTML = 0;  
};

autoRunInIndex();








