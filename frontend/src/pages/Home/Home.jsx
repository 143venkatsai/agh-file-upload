import React, { useRef, useState } from "react";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  BackButton,
  CardContainer,
  FileInput,
  HeaderBlock,
  HomeContainer,
  MessageText,
  ProceedButton,
  RemoveTextButton,
  SelectedFileCard,
  SelectedFileMeta,
  SelectedFileName,
  SelectedFileSize,
  SelectFilesButton,
  UploadArea,
  UploadStatus,
  UploadAreaText,
  UploadHintText,
  UploadPageTitle,
  UploadIconWrap,
  UploadSubTitle,
  UploadTitle,
  Spinner,
} from "./Home.styles";

const formatFileSize = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

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
      toast.error("Please choose a file first.");
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
      toast.success("File uploaded successfully.");
    } catch (uploadError) {
      setError(uploadError.message || "Upload failed. Please try again.");
      toast.error(uploadError.message || "Upload failed. Please try again.");
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
    if (!uploadedMeta?.fileId) return;
    navigate(`/document-editor/${uploadedMeta.fileId}`, {
      state: {
        uploadedFile,
        uploadedMeta,
      },
    });
  };

  return (
    <HomeContainer>
      <UploadPageTitle>Upload Files Here</UploadPageTitle>
      <CardContainer>
        <BackButton onClick={()=>navigate("/")}>
          <ArrowLeft size={16} />
          Back
        </BackButton>

        <HeaderBlock>
          <UploadTitle>File Upload</UploadTitle>
          <UploadSubTitle>Add your documents to the queue</UploadSubTitle>
        </HeaderBlock>

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
            <UploadCloud size={34} />
          </UploadIconWrap>
          <UploadAreaText>Drag and drop your files here</UploadAreaText>
          <UploadHintText>or click to browse files from your computer</UploadHintText>

          <FileInput
            id="file-upload-input"
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf,.mp4"
          />
          <SelectFilesButton type="button" onClick={handlePickFile}>
            Select Files
          </SelectFilesButton>
          {isUploading && (
            <UploadStatus>
              <Spinner aria-hidden="true" />
              Uploading...
            </UploadStatus>
          )}
        </UploadArea>

        {selectedFile && (
          <SelectedFileCard>
            <SelectedFileMeta>
              <SelectedFileName>{selectedFile.name}</SelectedFileName>
              <SelectedFileSize>{formatFileSize(selectedFile.size)}</SelectedFileSize>
            </SelectedFileMeta>
            <RemoveTextButton type="button" onClick={handleRemoveUploadedFile}>
              x
            </RemoveTextButton>
          </SelectedFileCard>
        )}

        <ProceedButton
          type="button"
          onClick={handleProceed}
          disabled={!uploadedFile || isUploading}
        >
          {isUploading ? "Uploading..." : "Proceed"}
        </ProceedButton>

        {message && <MessageText $isError={false}>{message}</MessageText>}
        {error && <MessageText $isError>{error}</MessageText>}
      </CardContainer>
    </HomeContainer>
  );
};

export default Home;
