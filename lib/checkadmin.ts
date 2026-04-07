"use client"
import { useRouter } from "next/navigation";
import { getSessionData } from "./auth";

// export const checkAdmin = async () => {
//     const router = useRouter();
//     const hascookie = await getSessionData();
//     // console.log("cookies", hascookie)
//     if (!hascookie) {
//       console.log("unauthorized")
//       router.push("/");
//       return;
//     } else {
//       console.log(hascookie)
//       const usertype = hascookie.role;
//       console.log("usertype", usertype);

//       if (usertype !== "Admin") {
//         router.push("/");
//         console.log("only admin can access this page");
//       }
//     }
//   }

export const checkAdmin = async (router: any) => { 
    const hascookie = await getSessionData();
    
    if (!hascookie) {
      router.push("/");
      return;
    } 
    
    if (hascookie.role !== "admin") {
      router.push("/");
    }
}