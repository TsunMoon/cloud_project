
// 1. Kiểm tra xem username và password có rỗng ko 
const validateLogin = (username, password) => {
    if(username === null || username === "" || password === null || password === ""){
        return false;
    }
    return true;
}


const login = () => {
    let username = document.getElementById("inp_username").value;
    let password = document.getElementById("inp_password").value;

    if(validateLogin(username, password)){
        loginRequest(username, password);
    }else{
        alert("Nhập đầy đủ username và password !!!!");
    }


}