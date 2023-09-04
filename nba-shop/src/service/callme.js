import axios from "axios";
export default async (token)=>{
    await axios.post(`${process.env.VUE_APP_SHOP}me`, null, {
        headers: {
            "auth-token": `Bearer ${token}`,
        },
    }).catch((err) => {
        if (err.response.status === 408) {
            window.location.reload();
        }
    })
}