import { Cookies } from "react-cookie";
const cookie =new Cookies()

const cookieOptions = {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: "/",
};

//Get A Cookie
export const  getCookie=(name)=>{
    const cookieValue = cookie.get(name);
    if (! cookieValue){
        return false;
    }
    return cookieValue
}
// Remove A Cookie

export const removeCookie=(name)=>{
    cookie.remove(name, cookieOptions);
}