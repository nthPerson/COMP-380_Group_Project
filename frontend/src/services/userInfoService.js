import {db, auth} from "../firebase"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export async function getUserInfo() {
    const uid = auth.currentUser?.uid;
    const email = auth.currentUser?.email;
    if (!uid) throw new Error("User not authenticated.");
  
    const defaultFields = {
      full_name: "",
      phone: "",
      email: email || "",
      linkedin: "",
      github: "",
      city: ""
    };
  
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
  
    if (!docSnap.exists()) {
      await setDoc(userRef, defaultFields);
      return defaultFields;
    }
  
    const data = docSnap.data();
    const filledData = { ...defaultFields, ...data };
    return filledData;
  }


export async function saveUserInfo(userInfo) {
    const uid = auth.currentUser.uid;
    const userRef = doc(db, "users", uid);
    return updateDoc(userRef, userInfo);
}
