const API = "https://projectcloudver1.herokuapp.com";

const WELCOME = API + "/welcome";
const AUTHENTICATION = API + "/authentication";
const ADMIN = API + "/admin";

//WELCOME
const GET_ALL_PRODUCT = WELCOME + "/get_all_product";
const CREATE_VERIFICATION_CODE = WELCOME + "/create_verification_code";
const ENTER_VERIFICATION_CODE = WELCOME + "/enter_verification_code";
const SAVE_ORDER_PAYMENT = WELCOME + "/save_order_payment";

const AUTHENTICATE = AUTHENTICATION + "/authenticate";

//ADMIN
const GET_PRODUCT_BY_ID = ADMIN + "/get_product_by_id";
const UPDATE_PRODUCT = ADMIN + "/update_product";
const DELETE_PRODUCT = ADMIN + "/delete_product";
const GET_ALL_ORDER_HISTORY = ADMIN + "/get_all_order_history";
const SEARCH_ORDER_HISTORY = ADMIN + "/seach_order_history";
const CREATE_NEW_PRODUCT = ADMIN + "/create_new_product";
const GET_THREE_INFORMATION = ADMIN + "/get_three_information";

const limit = 8;
const limitAdmin = 10;

const jwt = localStorage.getItem("TOKEN_AUTH");

// 1. Lấy tất cả các drink
const getAllDrink = (keyword, page, sortBy, cb) => {
  axios({
    method: "GET",
    url: GET_ALL_PRODUCT,
    params: {
      keyword: keyword,
      page: page,
      limit: limit,
      sortBy: sortBy,
      categoryId: 1,
    },
    headers: { Accept: "*" },
  })
    .then((result) => {
      console.log("result data", result.data);
      cb(result.data.listProductDTOS, "show_drink");
      $("#drinkPaging").twbsPagination({
        totalPages: result.data.totalPage,
        visiblePages: result.data.totalPage,
        onPageClick: function (event, page) {
          getAllDrink(keyword, page, "none", cb);
        },
      });
    })
    .catch((error) => {
      console.log("Lỗi global getAllDrink", error);
    });
};

//2. Lấy tất cả các food
const getAllFood = (keyword, page, sortBy, cb) => {
  axios({
    method: "GET",
    url: GET_ALL_PRODUCT,
    params: {
      keyword: keyword,
      page: page,
      limit: limit,
      sortBy: sortBy,
      categoryId: 2,
    },
    headers: { Accept: "*" },
  })
    .then((result) => {
      console.log("result food data", result.data);
      cb(result.data.listProductDTOS, "show_food");
      $("#foodPaging").twbsPagination({
        totalPages: result.data.totalPage,
        visiblePages: result.data.totalPage,
        onPageClick: function (event, page) {
          getAllFood(keyword, page, "none", cb);
        },
      });
    })
    .catch((error) => {
      console.log("Lỗi global getAllDrink", error);
    });
};

// 3. Login, gửi username và password lên server
const loginRequest = (username, password) => {
  axios({
    method: "POST",
    url: AUTHENTICATE,
    data: {
      username: username,
      password: password,
    },
  })
    .then((result) => {
      console.log("data login", result.data);
      let valid = result.data.valid;
      if (valid) {
        localStorage.removeItem("TOKEN_AUTH");
        localStorage.removeItem("ADMIN_NAME");
        localStorage.setItem("TOKEN_AUTH", result.data.token);
        localStorage.setItem("ADMIN_NAME", result.data.username);
        //Chuyển trang admin
        window.location.href = "admin.html";
      } else {
        Swal.fire({
          title: result.data.errorMessage,
          icon: "error",
          showCancelButton: false,
        });
      }
    })
    .catch((error) => {
      console.log("Error loginRequest in global", error);
    });
};

// ===== ADMIN ======

// 4. Lấy tất cả các drink cho trang admin
const getAllDrinkAdmin = (keyword, page, sortBy, cb) => {
  axios({
    method: "GET",
    url: GET_ALL_PRODUCT,
    params: {
      keyword: keyword,
      page: page,
      limit: limitAdmin,
      sortBy: sortBy,
      categoryId: 1,
    },
    headers: { Accept: "*" },
  })
    .then((result) => {
      console.log("result data", result.data);
      cb(result.data.listProductDTOS, "table__body_drink");
      $("#drinkPagingAdmin").twbsPagination({
        totalPages: result.data.totalPage,
        visiblePages: result.data.totalPage,
        onPageClick: function (event, page) {
          getAllDrinkAdmin(keyword, page, "none", cb);
        },
      });
    })
    .catch((error) => {
      console.log("Lỗi global getAllDrinkAdmin", error);
    });
};

// 5. Lấy tất cả các food cho trang Admin
const getAllFoodAdmin = (keyword, page, sortBy, cb) => {
  axios({
    method: "GET",
    url: GET_ALL_PRODUCT,
    params: {
      keyword: keyword,
      page: page,
      limit: limitAdmin,
      sortBy: sortBy,
      categoryId: 2,
    },
    headers: { Accept: "*" },
  })
    .then((result) => {
      console.log("result food data", result.data);
      cb(result.data.listProductDTOS, "table__body_food");
      $("#foodPagingAdmin").twbsPagination({
        totalPages: result.data.totalPage,
        visiblePages: result.data.totalPage,
        onPageClick: function (event, page) {
          getAllFoodAdmin(keyword, page, "none", cb);
        },
      });
    })
    .catch((error) => {
      console.log("Lỗi global getAllFoodAdmin", error);
    });
};

// 6. Lấy product theo id để edit
const getProductById = (idProduct) => {
  axios({
    method: "GET",
    url: GET_PRODUCT_BY_ID + "/" + idProduct,
    headers: {
      Accept: "*",
      Authorization: "Bearer " + jwt,
    },
  })
    .then((result) => {
      console.log("edit data", result);
      let productDetail = result.data;
      //in ra modal
      document.getElementById("inpNameDetail").value = productDetail.name;
      document.getElementById("inpQuantityDetail").value =
        productDetail.quantity;
      document.getElementById("inpPriceDetail").value = productDetail.price;
      document.getElementById("sopCategoty").value = productDetail.category;
      document.getElementById("inpImageDetail").value = productDetail.image;

      // src hình ảnh
      document.getElementById("imgDetail").src = productDetail.image;

      //gán giá trị vào nút bấm
      document.getElementById("btnUpdateDetail").value = productDetail.id;
    })
    .catch((error) => {
      console.log("Lỗi ở getProductById", error);
    });
};

// 7. API update product
const updateProduct = (
  idProduct,
  name,
  quantity,
  price,
  category,
  image,
  autoRun
) => {
  console.log("idProduct", idProduct);
  axios({
    method: "PUT",
    url: UPDATE_PRODUCT + "/" + idProduct,
    data: {
      name: name,
      quantity: quantity,
      price: price,
      category: category,
      image: image,
    },
    headers: {
      Accept: "*",
      Authorization: "Bearer " + jwt,
    },
  })
    .then((result) => {
      if (result.status == 200) {
        autoRun();
        document.getElementById("btn_close_modal_detail_product").click();
      } else {
        Swal.fire({
          title: "Cập nhật thất bại",
          icon: "error",
          showCancelButton: false,
        });
      }
    })
    .catch((error) => {
      console.log("Lỗi ở updateProduct, global", error);
      Swal.fire({
        title: "Cập nhật thất bại",
        icon: "error",
        showCancelButton: false,
      });
    });
};

// 8. API xóa product
const deleteProduct = (idProduct) => {
  axios({
    method: "DELETE",
    url: DELETE_PRODUCT + "/" + idProduct,
    headers: {
      Accept: "*",
      Authorization: "Bearer " + jwt,
    },
  })
    .then((result) => {
      if (result.status == 200) {
        autoRun();
      }
    })
    .catch((error) => {
      console.log("Lỗi ở deleteProduct, global", error);
    });
};

// 9. Api lấy tất cả các order history
const getAllOrderHistory = (renderOrderHistory) => {
  axios({
    method: "GET",
    url: GET_ALL_ORDER_HISTORY,
    headers: {
      Accept: "*",
      Authorization: "Bearer " + jwt,
    },
  })
    .then((result) => {
      console.log("data get all order detail", result.data);
      let listOrderDetail = result.data;
      listOrderDetail.sort((a,b)=> b.orderId - a.orderId );
      renderOrderHistory(listOrderDetail);
    })
    .catch((error) => {
      console.log("Lỗi ở getAllOrderHistory, global", error);
    });
};

// 10. Api search order history
const searchOrderDetail = (phoneNumber, renderOrderHistory) => {
  axios({
    method: "GET",
    url: SEARCH_ORDER_HISTORY,
    params: {
      search_phone: phoneNumber,
    },
    headers: {
      Accept: "*",
      Authorization: "Bearer " + jwt,
    },
  })
    .then((result) => {
      console.log("data search order history", result.data);
      renderOrderHistory(result.data);
    })
    .catch((error) => {
      console.log("Lỗi ở searchOrderDetail, global", error);
    });
};

// 11. Api tạo mới sản phầm
const createNewProduct = (name, quantity, price, category, image, autoRun) => {
  axios({
    method: "POST",
    url: CREATE_NEW_PRODUCT,
    data: {
      name: name,
      quantity: +quantity,
      price: +price,
      category: category,
      image: image,
    },
    headers: {
      Accept: "*",
      Authorization: "Bearer " + jwt,
    },
  })
    .then((result) => {
      if (result.status == 201) {
        Swal.fire({
          title: "Tạo mới thành công",
          icon: "success",
          showCancelButton: false,
        });
        document.getElementById("closeModalAdd").click();
        autoRun();
      } else {
        Swal.fire({
          title: "Tạo mới thất bại",
          icon: "error",
          showCancelButton: false,
        });
      }
    })
    .catch((error) => {
      console.log("Lỗi ở createNewProduct, global", error);
      Swal.fire({
        title: "Tạo mới thất bại",
        icon: "error",
        showCancelButton: false,
      });
    });
};

// 12. Api tạo phone verification code
const createVerificationCode = (phoneNumber, listCart, autoRunInIndex) => {
  axios({
    method: "POST",
    url: CREATE_VERIFICATION_CODE,
    params: {
      phone_number: phoneNumber,
    },
    headers: {
      Accept: "*",
    },
  })
    .then((result) => {
      if (result.status == 200) {
        let timerInterval;
        Swal.fire({
          title: "Nhập mã xác thực",
          confirmButtonText: `Xác thực`,
          input: "number",
          width: 600,
          padding: "3em",     
          backdrop: `
    rgba(0,0,123,0.4)
    url(https://sweetalert2.github.io/images/nyan-cat.gif)
    left top
    no-repeat
  `,
        }).then((result) => {
          if (result.isConfirmed) {            
            //Thêm api xác thực phone vào đây            
             enterVerificateCode(phoneNumber,+result.value, listCart, autoRunInIndex)            
          }
        });
      }
    })
    .catch((error) => {
      console.log("Lỗi ở createVerificationCode, global", error);
      Swal.fire({
        title: "Số điện thoại không hợp lệ",
        icon: "error",
      }).then((result) => {});
    });
};


// 13. Api gửi mã xác thực
const enterVerificateCode = (phoneNumber, code, listCart, autoRunInIndex) => {
  axios({
    method: "POST",
    url: ENTER_VERIFICATION_CODE,
    params: {
      "phone_number": phoneNumber,
      "code": code
    },
    headers: {
      Accepts: "*"
    }
  }).then((result) => {
    
    if(result.status == 200){
      let newListCart = listCart.map((item) => {
        return new CartItemRequest(+item.amount, +item.product.id)
      })
      saveOrderPayment(phoneNumber, newListCart, autoRunInIndex);
    }
 
  }).catch((error) => {

  })
};

// 14. Api thanh toán
const saveOrderPayment = (phoneNumber, listCart, autoRunInIndex) => {
  axios({
    method: "POST",
    url: SAVE_ORDER_PAYMENT,
    data:{
      "phoneNumber": phoneNumber,
      "listCart" : listCart
    },
    headers:{
      Accept: "*"
    }

  }).then((result) => {
    if(result.status == 200){
      alert("Thanh toán thành công rồi nha ");
      document.getElementById("btn_close_phone_input").click();
      document.getElementById('btn_close_cart').click();     
      autoRunInIndex(); 
    }    
  }).catch((error) => {
    console.log("Lỗi ở saveOrderPayment, global", error);
  })
};

// 15. Api lấy 3 thông tin
const getThreeInformation = () => {
  axios({
    method: "GET",
    url: GET_THREE_INFORMATION,
    headers:{
      Accept: "*"
    }
  }).then((result) => {    
    document.getElementById("number_posts").innerHTML = result.data.numberOrder;
    document.getElementById("number_company").innerHTML = result.data.numberDrink;
    document.getElementById("number_freelancer").innerHTML = result.data.numberFood;
  }).catch((error) => {
    console.log("Lỗi ở getThreeInformation, global", error);
  })
};