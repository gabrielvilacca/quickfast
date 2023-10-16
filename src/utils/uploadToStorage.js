import { storage } from "@/firebase/config";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";

const uploadToStorage = async (file, path, fileName) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(
      storage,
      `${path}/${fileName}.${file.type.split("/")[1]}`
    );

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
        // Progress handling can go here
      },
      (error) => {
        // Handle errors here
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("Arquivo disponível na URL: ", downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
};

export default uploadToStorage;
