import {collection, getDocs} from "firebase/firestore";
import db from "./db";

export function convertQuerySnapshot(querySnapshot) {
  return querySnapshot.docs.map((doc) => {
    return {...doc.data(), id: doc.id};
  });
}

export async function getDataByCollection(collectionName) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return convertQuerySnapshot(querySnapshot);
}

export const services = ["Állapotfelmérés", "Tömés", "Gyökérkezelés"];
