import { setCookie, getCookie, deleteCookie } from "cookies-next";

export function storeAuthData(data: any, rememberMe: boolean = false) {
    const options = {
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as "lax",
    };

    setCookie("token", data.access_token, options);
    setCookie("role", data.role, options);

    if (data.role === "seller") {
        setCookie("seller_id", data.seller_id || "", options);
        setCookie("seller_name", data.seller_name || "", options);
        setCookie("seller_logo", data.seller_logo || "", options);
    }
}
