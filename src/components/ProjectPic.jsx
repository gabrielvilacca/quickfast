import React, { useState } from "react";
import useStorage from "@/hooks/useStorage";

const ProjectPic = ({ onImageUpload }) => {
  const { uploadFile, url, progress, error } = useStorage();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      uploadFile(file);
    }
  };

  useEffect(() => {
    if (url) {
      onImageUpload(url);
    }
  }, [url, onImageUpload]);

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={progress > 0 && progress < 100}>
        {progress > 0 && progress < 100 ? `Uploading ${progress}%` : "Upload"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default ProjectPic;
