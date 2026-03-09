import React, { useRef, useState } from "react";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BackButton,
  CardContainer,
  FileInput,
  HomeContainer,
  MessageText,
  ProceedButton,
  RemoveTextButton,
  UploadArea,
  UploadStatus,
  UploadAreaText,
  UploadIconWrap,
  UploadSubTitle,
  UploadTitle,
  Spinner,
} from "./Home.styles";

const Home = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedMeta, setUploadedMeta] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const uploadUrl = "http://localhost:3000/api/files/upload";
  const uploadFile = async (file) => {
    if (!file) {
      setError("Please choose a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setSelectedFile(file);
      setIsUploading(true);
      setError("");
      setMessage("");

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed (${response.status})`);
      }

      const responseData = await response.json();
      setUploadedFile(file);
      setUploadedMeta({
        fileId: responseData.fileId || "",
        pdfUrl: responseData.pdfUrl || "",
      });
      setMessage("File uploaded successfully.");
    } catch (uploadError) {
      setError(uploadError.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0] || null;
    await uploadFile(file);
  };

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setIsDragActive(false);

    const file = event.dataTransfer.files?.[0] || null;
    await uploadFile(file);
  };

  const handleRemoveUploadedFile = () => {
    setSelectedFile(null);
    setUploadedFile(null);
    setUploadedMeta(null);
    setMessage("");
    setError("");
  };

  const handleProceed = () => {
    // if (!uploadedFile || isUploading) {
    //   return;
    // }
    if (!uploadedMeta?.fileId) return;
    navigate(`/document-editor/${uploadedMeta.fileId}`, {
      state: {
        uploadedFile,
        uploadedMeta,
      },
    });
    // navigate("/document-editor", {
    //   state: {
    //     uploadedFile,
    //     uploadedMeta,
    //   },
    // });
  };

  return (
    <HomeContainer>
      <CardContainer>
        <BackButton>
          <ArrowLeft size={16} />
          Back
        </BackButton>
        <UploadArea
          $isDragActive={isDragActive}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadIconWrap
            type="button"
            onClick={handlePickFile}
            disabled={isUploading}
          >
            <UploadCloud size={24} />
          </UploadIconWrap>
          <UploadTitle>File Upload</UploadTitle>
          <UploadSubTitle>
            Drag and drop your files here or browse to upload
          </UploadSubTitle>
          <FileInput
            id="file-upload-input"
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf,.mp4"
          />
          <UploadAreaText>
            Click cloud icon or drag and drop to upload
          </UploadAreaText>
          {selectedFile && <UploadAreaText>{selectedFile.name}</UploadAreaText>}
          {isUploading && (
            <UploadStatus>
              <Spinner aria-hidden="true" />
              Uploading...
            </UploadStatus>
          )}
        </UploadArea>

        <ProceedButton
          type="button"
          onClick={handleProceed}
          disabled={!uploadedFile || isUploading}
        >
          {isUploading ? "Uploading..." : "Proceed"}
        </ProceedButton>

        {uploadedFile && (
          <UploadAreaText>
            Uploaded: {uploadedFile.name}{" "}
            <RemoveTextButton type="button" onClick={handleRemoveUploadedFile}>
              remove
            </RemoveTextButton>
          </UploadAreaText>
        )}

        {message && <MessageText $isError={false}>{message}</MessageText>}
        {error && <MessageText $isError>{error}</MessageText>}
      </CardContainer>
    </HomeContainer>
  );
};

export default Home;
