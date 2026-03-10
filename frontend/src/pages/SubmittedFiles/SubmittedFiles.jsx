import React, { useEffect, useState } from "react";
import { ArrowLeft, FileText, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteFileApi, getFilesApi } from "../../services/apiClient";
import {
  ActionArea,
  FileIconBox,
  FileMeta,
  FileName,
  FilePrimary,
  Container,
  EmptyText,
  FileCard,
  Page,
  RemoveButton,
  UploadButton,
  BackLink,
  TopBar,
  CenterNoFilesLoader,
  ViewButton,
  AccessButton,
} from "./SubmittedFiles.styles";

const formatModifiedText = (dateValue) => {
  if (!dateValue) return "Modified recently";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Modified recently";
  return `Modified ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })}`;
};

const SubmittedFiles = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);
      setError("");
      try {
        const result = await getFilesApi();
        const apiFiles = Array.isArray(result?.files) ? result.files : [];
        setItems(apiFiles);

        if (!apiFiles.length) {
          setItems([]);
          return;
        }

        const mapped = apiFiles.map((file) => ({
          id: file._id,
          name: file.title || "Untitled file",
          meta: formatModifiedText(file.updatedAt),
          isDummy: false,
        }));
        setItems(mapped);
      } catch (fetchError) {
        setError(fetchError.message || "Failed to load files.");
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleRemove = async (item) => {
    if (item.isDummy) {
      setItems((prevItems) =>
        prevItems.filter((entry) => entry.id !== item.id),
      );
      return;
    }

    try {
      setDeletingId(item.id);
      setError("");
      await deleteFileApi(item.id);

      setItems((prevItems) =>
        prevItems.filter((entry) => entry.id !== item.id),
      );
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete file.");
    } finally {
      setDeletingId("");
    }
  };

  const handleView = (item) => {
    if (!item?.id) return;
    navigate(`/file-view/${item.id}`);
  };

  const handleViewAccess = (item) => {
    if (!item?.id) return;
    navigate(`/view-access/${item.id}`);
  };

  return (
    <Page>
      <Container>
        <TopBar>
          <BackLink type="button" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Back
          </BackLink>
          <UploadButton type="button" onClick={() => navigate("/uploads")}>
            <Upload size={15} />
            Upload File
          </UploadButton>
        </TopBar>
        {items.length > 0 && (
          <>
            {items.map((item) => (
              <FileCard key={item.id}>
                <FilePrimary>
                  <FileIconBox>
                    <FileText size={16} />
                  </FileIconBox>
                  <div>
                    <FileName>{item.name}</FileName>
                    <FileMeta>{item.meta}</FileMeta>
                  </div>
                </FilePrimary>

                <ActionArea>
                  <AccessButton
                    type="button"
                    onClick={() => handleViewAccess(item)}
                  >
                    View Students
                  </AccessButton>
                  <ViewButton type="button" onClick={() => handleView(item)}>
                    View
                  </ViewButton>
                  <RemoveButton
                    type="button"
                    onClick={() => handleRemove(item)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? "Removing..." : "Remove"}
                  </RemoveButton>
                </ActionArea>
              </FileCard>
            ))}
          </>
        )}
        {!isLoading && items.length <= 0 && (
          <CenterNoFilesLoader>
            <h2>No Files Available. Use Upload File to add more.</h2>
          </CenterNoFilesLoader>
        )}

        {isLoading && (
          <CenterNoFilesLoader>
            <h2>Loading files...</h2>
          </CenterNoFilesLoader>
        )}
        {error && <EmptyText>{error}</EmptyText>}
      </Container>
    </Page>
  );
};

export default SubmittedFiles;
