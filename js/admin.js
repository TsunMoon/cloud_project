// 1. render sản phẩm theo list
const renderProduct = (listProduct, div_show) => {
  let tempStr = "";
  for (let eachProduct of listProduct) {
    tempStr += ` <tr>
        <td style="font-weight: bold;">${eachProduct.name}</td>
        <td>
          <img style="width: 100px;height: 100px;" src=${eachProduct.image} alt="">
        </td>
        <td style="color: #F67280; font-weight: bold">${ new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(eachProduct.price)}</td>
        <td>${eachProduct.quantity}</td>
        <td>
          <button data-toggle="modal" data-target="#detailModel" onclick="editProduct(${eachProduct.id})" class="btn btn-primary"><i class="fa fa-edit"></i></button>
          <button onclick="deleteProductAdmin(${eachProduct.id})" class="btn btn-danger"><i class="fa fa-trash"></i></button>
        </td>
      </tr>`;
  }

  document.getElementById(div_show).innerHTML = tempStr;
};

// 2. click edit Product
const editProduct = (idProduct) => {
  //load lại phân trang drink
  $("#div_drinkPagingAdmin").html("");
  $("#div_drinkPagingAdmin").html('<ul id="drinkPagingAdmin" ></ul>');
  //load lại phân trang food
  $("#div_foodPagingAdmin").html("");
  $("#div_foodPagingAdmin").html('<ul id="foodPagingAdmin" ></ul>');

  getProductById(idProduct);
};

// 3. Tự động load hình ảnh
const autoLoadImage = () => {
  let image = document.getElementById("inpImageDetail").value;
  document.getElementById("imgDetail").src = image;
};

// 4. click udate product
const clickUpdateDetailProduct = () => {
  let idProduct = document.getElementById("btnUpdateDetail").value;
  let name = document.getElementById("inpNameDetail").value;
  let quantity = +document.getElementById("inpQuantityDetail").value;
  let price = +document.getElementById("inpPriceDetail").value;

  let category = document.getElementById("sopCategoty").value;
  let image = document.getElementById("inpImageDetail").value;

  updateProduct(idProduct, name, quantity, price, category, image, autoRun);
};

// 5. click xóa product
const deleteProductAdmin = (idProduct) => {
  //load lại phân trang drink
  $("#div_drinkPagingAdmin").html("");
  $("#div_drinkPagingAdmin").html('<ul id="drinkPagingAdmin" ></ul>');
  //load lại phân trang food
  $("#div_foodPagingAdmin").html("");
  $("#div_foodPagingAdmin").html('<ul id="foodPagingAdmin" ></ul>');

  deleteProduct(idProduct);
};

// 6. search đồ uống trong trang admin
const searchDrinkAdmin = () => {
  let keyword = document.getElementById("inpSearchDrinkAdmin").value;
  //load lại phân trang drink
  $("#div_drinkPagingAdmin").html("");
  $("#div_drinkPagingAdmin").html('<ul id="drinkPagingAdmin" ></ul>');

  getAllDrinkAdmin(keyword, 1, "none", renderProduct);
};

// 7. search đồ ăn vặt trong trang admin
const searchFoodAdmin = () => {
  let keyword = document.getElementById("inpSearchFoodAdmin").value;
  //load lại phân trang food
  $("#div_foodPagingAdmin").html("");
  $("#div_foodPagingAdmin").html('<ul id="foodPagingAdmin" ></ul>');

  getAllFoodAdmin(keyword, 1, "none", renderProduct);
};

// 8. render danh sách order history
const renderOrderHistory = (listOrderHistory) => {
  let tempStr = "";
  for (eachOrder of listOrderHistory) {
    let totalMoney = 0;
    tempStr += `
    <div class="card text-center" style="margin-top: 20px;">
      <div style="background-color: #654321; color: yellow;" class="card-header row">
       <div style="text-align: left; padding-top: 10px;" class="col-4">Mã hóa đơn: #${eachOrder.orderId}</div>
       <div class="col-4"></div>
       <div style="text-align: left;" class="col-4">Số điện thoại: <span style="font-weight: bold;font-size: 30px; color: yellowgreen; ">${eachOrder.phoneNumber}</span></div>
      </div>
      <div id="body_show_order_detail" class="card-body">`;

    for (eachOrderDetail of eachOrder.listOrderHistoryDetails) {
      tempStr += `<div style="margin-top: 20px" class="row">
        <div class="col-3">
          <img style="width: 100px; height: 100px;" src= ${eachOrderDetail.image} alt="Hình ảnh sản phẩm">
        </div>
        <div class="col-6 text-muted" style="text-align: left; font-size: larger; padding-top: 40px;" >
          <p>Tên sản phẩm: <span style="color: black; font-weight: bold;">${eachOrderDetail.name}</span> </p>
          <p style="margin-top: 55px;">Giá: <span style="color: black; font-weight: bold;">${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(eachOrderDetail.priceDetail)}</span></p>
        </div>
        <div class="col-3 text-muted" style="text-align: left; font-size: larger; padding-top: 40px;">
           <p>Loại: <span style="color: black; font-weight: bold;">${eachOrderDetail.category}</span></p>
           <p  style="margin-top: 55px;">Số lượng: <span style="color: black; font-weight: bold;">${eachOrderDetail.amount}</span></p>
        </div>
        </div>
        <hr style="border: 1px solid black"/>
        `;

      // Tính tổng tiền của 1 hóa đơn
      totalMoney += eachOrderDetail.priceDetail * eachOrderDetail.amount;
    }

    tempStr += `</div>
      <div class="card-footer text-muted">
        <div class="row">
          <div class="col-8" style="text-align: left; font-size: larger; padding-top: 22px;">
            <p>Ngày thanh toán: <span style="color: black; font-weight: bold;">${eachOrder.createAt}</span></p>
          </div>
          <div class="col-4" style="text-align: left; font-size: larger; padding-top: 10px;">
            <p>Tổng cộng: <span style="color: black; font-weight: bold;font-size: 30px">${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(totalMoney)}</span></p>
          </div>
        </div>
      </div>
    </div>`;
  }

  document.getElementById("showOrderHistory").innerHTML = tempStr;
};

// 9. Khi ấn tab Đơn đặt hàng thì load lại trang
const clickTabOrder = () => {
  getAllOrderHistory(renderOrderHistory);
};

// 10. Khi ấn tab Đơn đặt hàng thì load lại trang
const clickTabDrink = () => {
  getAllDrinkAdmin("", 1, "none", renderProduct);
};

// 11. Khi ấn tab Đơn đặt hàng thì load lại trang
const clickTabFood = () => {
  getAllFoodAdmin("", 1, "none", renderProduct);
};

// 12. Khi ấn nút tìm kiếm trong order history
const clickSearchOrderHistory = () => {
  let search_phoneNumber = document.getElementById("inpSearchOrderAdmin").value;
  searchOrderDetail(search_phoneNumber, renderOrderHistory);
};

// 13. Logout
const logout = () => {
  window.location.href = "login.html";
  localStorage.clear();
};

// 14. Tự động load hình trong modal add new product
const autoLoadImageAdd = () => {
  let image = document.getElementById("inpImageAdd").value;
  document.getElementById("imgAdd").src = image;
};

// 15. click tạo mới product
const clickAddNewProduct = () => { 
  let name = document.getElementById("inpNameAdd").value;
  let quantity = +document.getElementById("inpQuantityAdd").value;
  let price = +document.getElementById("inpPriceAdd").value;

  let category = document.getElementById("sopCategotyAdd").value;
  let image = document.getElementById("inpImageAdd").value;
  createNewProduct(name,quantity,price,category,image, autoRun);
};

// ===========AUTO===================
const autoRun = () => {
  getAllDrinkAdmin("", 1, "none", renderProduct);
  getAllFoodAdmin("", 1, "none", renderProduct);
  getThreeInformation();
};

autoRun();

getAllOrderHistory(renderOrderHistory);
