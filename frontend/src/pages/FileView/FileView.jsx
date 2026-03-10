import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DetailsPanel from "../../components/DetailsPanel/DetailsPanel";
import ThumbnailGrid from "../../components/ThumbnailGrid/ThumbnailGrid";
import {
  BackButton,
  Container,
  ContentGrid,
  DetailsPane,
  InfoText,
  Page,
  ThumbnailsPane,
} from "./FileView.styles";

const API_BASE_URL = "http://localhost:3000/api/files";

const FileView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [pages, setPages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchFile = async () => {
      if (!id) return;
      setIsLoading(true);
      setError("");
      setPages([]);
      setActiveIndex(0);

      try {
        const response = await fetch(`${API_BASE_URL}/get-pdf/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to load file (${response.status})`);
        }
        const data = await response.json();
        const apiPages = Array.isArray(data?.pages) ? data.pages : [];

        setFileName(data.originalFileName || "Untitled");
        setPages(apiPages);
      } catch (fetchError) {
        setError(fetchError.message || "Failed to load file details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [id]);

  const activePage = useMemo(
    () => pages[activeIndex] || null,
    [pages, activeIndex],
  );

  return (
    <Page>
      <Container>
        <BackButton type="button" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Back
        </BackButton>

        {isLoading && <InfoText>Loading file details...</InfoText>}
        {!isLoading && error && <InfoText>{error}</InfoText>}
        {!isLoading && !error && !pages.length && (
          <InfoText>No pages available for this file.</InfoText>
        )}

        {!isLoading && !error && pages.length > 0 && (
          <ContentGrid>
            <ThumbnailsPane>
              <ThumbnailGrid
                pages={pages}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
              />
            </ThumbnailsPane>

            <DetailsPane>
              <DetailsPanel fileName={fileName} activePage={activePage} />
            </DetailsPane>
          </ContentGrid>
        )}
      </Container>
    </Page>
  );
};

export default FileView;
