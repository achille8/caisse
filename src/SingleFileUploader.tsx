import React, { useState } from "react";

const SingleFileUploader = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
  
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        
        const result = await fetch("https://httpbin.org/post", {
          method: "POST",
          body: formData,
        });
  
        const data = await result.json();
  
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <div>
        <label htmlFor="file" className="sr-only">
          Choose a file
        </label>
        <input id="file" type="file" onChange={handleFileChange} />
      </div>
      {file && (
        <section>
          File details:
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>
        </section>
      )}

      {file && <button onClick={handleUpload}>Upload a file</button>}
    </>
  );
};

export default SingleFileUploader;