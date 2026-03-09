import React, { useMemo, useState } from "react";
import { ArrowLeft, FileText, Upload } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ActionArea,
  FileIconBox,
  FileMeta,
  FileName,
  FilePrimary,
  Container,
  EmptyText,
  FileCard,
  PreviewBox,
  PreviewImage,
  Page,
  RemoveButton,
  UploadButton,
  BackLink,
  TopBar,
} from "./SubmittedFiles.styles";

const DUMMY_FILES = [
  {
    id: "dummy-1",
    name: "Project Proposal.pdf",
    meta: "Modified 2h ago · 4.2 MB",
    previewType: "illustration",
  },
  {
    id: "dummy-2",
    name: "Brand_Asset_v2.png",
    meta: "Modified Yesterday · 12.8 MB",
    previewType: "sunset",
  },
  {
    id: "dummy-3",
    name: "Q4_Financial_Report.csv",
    meta: "Modified Oct 12 · 856 KB",
    previewType: "wave",
  },
  {
    id: "dummy-4",
    name: "Tutorial_Final_Cut.mp4",
    meta: "Modified Oct 05 · 245.0 MB",
    previewType: "darkWave",
  },
];

const SubmittedFiles = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const firstImage = location.state?.firstImage || "";

  const initialItems = useMemo(() => {
    const firstItem = DUMMY_FILES[0];
    return DUMMY_FILES.map((item) =>
      item.id === firstItem.id ? { ...item, thumbnail: firstImage } : item,
    );
  }, [firstImage]);

  const [items, setItems] = useState(initialItems);

  const handleRemove = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <Page>
      <Container>
        <TopBar>
          <BackLink type="button" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Back
          </BackLink>
          <UploadButton type="button" onClick={() => navigate("/")}>
            <Upload size={15} />
            Upload File
          </UploadButton>
        </TopBar>

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
              <PreviewBox $variant={item.previewType}>
                {item.thumbnail && (
                  <PreviewImage src={item.thumbnail} alt={`${item.name} preview`} />
                )}
              </PreviewBox>
              <RemoveButton type="button" onClick={() => handleRemove(item.id)}>
                Remove
              </RemoveButton>
            </ActionArea>
          </FileCard>
        ))}

        {!items.length && (
          <EmptyText>No cards left. Use Upload File to add more.</EmptyText>
        )}
      </Container>
    </Page>
  );
};

export default SubmittedFiles;
