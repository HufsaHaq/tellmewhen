"use client";

import PageLoad from "@/components/PageLoad";
import { useEffect } from "react";
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
export default function Page()
{
    useEffect(() => {

            window.location.href = "/customer_view/" + getCookie("eji")
        
    }, [])
    return <PageLoad></PageLoad>
}