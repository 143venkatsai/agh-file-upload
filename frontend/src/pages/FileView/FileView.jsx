import React, { useMemo, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import DetailsPanel from "../../components/DetailsPanel/DetailsPanel";
import ThumbnailGrid from "../../components/ThumbnailGrid/ThumbnailGrid";
import { getFileByIdApi } from "../../services/apiClient";

import {
  BackButton,
  Container,
  ContentGrid,
  DetailsPane,
  InfoText,
  Page,
  ThumbnailsPane,
} from "./FileView.styles";

const FileView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["file", id],
    queryFn: () => getFileByIdApi(id),
    enabled: !!id,
    staleTime: 1000 * 30,
  });

  const fileName = data?.originalFileName || "Untitled";

  const pages = useMemo(() => {
    const apiPages = Array.isArray(data?.pages) ? data.pages : [];
    return apiPages;
  }, [data]);

  const activePage = useMemo(() => {
    return pages[activeIndex] || null;
  }, [pages, activeIndex]);

  return (
    <Page>
      <Container>
        <BackButton type="button" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Back
        </BackButton>

        {isLoading && (
          <InfoText>
            <Loader2 size={18} className="animate-spin" /> Loading file...
          </InfoText>
        )}

        {!isLoading && error && (
          <InfoText color="red">
            {error.message || "Failed to load file"}
          </InfoText>
        )}

        {!isLoading && !error && !pages.length && (
          <InfoText>No pages available</InfoText>
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
