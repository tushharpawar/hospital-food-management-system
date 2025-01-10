'use client'
import DeliveryPersonnel from "@/components/DeliveryPersonnel/DeliveryPersonnel";
import FoodManagerPage from "@/components/FoodManager/FoodManagerPage";
import PantryStaff from "@/components/PantryStaff/PantryStaff";
import { useEffect, useState } from "react";


export default function Home() {
   const [session, setSession] = useState(null);

   useEffect(() => {
     const fetchSession = async () => {
       try {
         const response = await fetch('/api/auth/session');
         if (response.ok) {
           const sessionData = await response.json();
           setSession(sessionData);
         } else {
           setSession(null);
         }
       } catch (error) {
         console.error('Error fetching session:', error);
         setSession(null);
       }
     };
 
     fetchSession();
   }, []);

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const email = session.user.email;  

  if (email === "hospital_manager@xyz.com") {
    return <FoodManagerPage />;
  }else if (email === "hospital_pantry@xyz.com") {
    return <PantryStaff />;
  }else if (email === "hospital_delivery@xyz.com") {
    return <DeliveryPersonnel />;
  }

  return <div>Unauthorized</div>
}
