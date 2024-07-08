import { useState, useEffect } from "react";
import { storage } from "../firebase/config"; // Certifique-se de que a configuração do Firebase está correta
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const useStorage = () => {
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);
  const [progress, setProgress] = useState(0);

  const uploadFile = (file) => {
    const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(percentage);
      },
      (err) => {
        setError(err);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUrl(downloadURL);
      }
    );
  };

  return { progress, url, error, uploadFile };
};

export default useStorage;
