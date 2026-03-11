import React, { useMemo, useState } from "react";
import { ArrowLeft, FileText, Upload, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  Footer,
  Pagination,
  PageButton,
  ResultText,
} from "./SubmittedFiles.styles";

const PAGE_LIMIT = 10;

const getVisiblePageNumbers = ({
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
}) => {
  if (totalPages <= 0) {
    return [1];
  }

  if (!hasPrevPage) {
    return Array.from(
      { length: Math.min(3, totalPages) },
      (_, index) => index + 1,
    );
  }

  if (!hasNextPage) {
    const startPage = Math.max(1, totalPages - 2);
    return Array.from(
      { length: totalPages - startPage + 1 },
      (_, index) => startPage + index,
    );
  }

  return [currentPage - 1, currentPage, currentPage + 1].filter(
    (page) => page >= 1 && page <= totalPages,
  );
};

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
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: ["files", currentPage],
    queryFn: () =>
      getFilesApi({
        page: currentPage,
        limit: PAGE_LIMIT,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 5000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });

  const files = useMemo(() => {
    const apiFiles = data?.files || [];

    return apiFiles.map((file) => ({
      id: file._id,
      name: file.title || "Untitled file",
      meta: formatModifiedText(file.updatedAt),
    }));
  }, [data]);

  const pagination = data?.pagination || {
    currentPage,
    totalPages: 1,
    totalFiles: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const resolvedCurrentPage = pagination.currentPage || currentPage;
  const visiblePageNumbers = getVisiblePageNumbers({
    currentPage: resolvedCurrentPage,
    totalPages: pagination.totalPages || 1,
    hasPrevPage: Boolean(pagination.hasPrevPage),
    hasNextPage: Boolean(pagination.hasNextPage),
  });

  const startIndex = pagination.totalFiles
    ? (resolvedCurrentPage - 1) * PAGE_LIMIT + 1
    : 0;

  const endIndex = Math.min(
    startIndex + files.length - 1,
    pagination.totalFiles,
  );

  const handleRemove = (fileId) => {
    deleteMutation.mutate(fileId);
  };

  const handleView = (item) => {
    navigate(`/file-view/${item.id}`);
  };

  const handleViewAccess = (item) => {
    navigate(`/view-access/${item.id}`);
  };

  return (
    <Page>
      <Container>
        <TopBar>
          <BackLink onClick={() => navigate("/")}>
            <ArrowLeft size={16} /> Back
          </BackLink>

          <UploadButton onClick={() => navigate("/uploads")}>
            <Upload size={15} />
            Upload File
          </UploadButton>
        </TopBar>

        {isLoading && (
          <CenterNoFilesLoader>
            <Loader2 size={20} className="animate-spin" />
            <h2>Loading files...</h2>
          </CenterNoFilesLoader>
        )}

        {!isLoading && files.length === 0 && (
          <CenterNoFilesLoader>
            <h2>No Files Available. Upload new files.</h2>
          </CenterNoFilesLoader>
        )}

        {!isLoading &&
          files.map((item) => (
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
                <AccessButton onClick={() => handleViewAccess(item)}>
                  View Students
                </AccessButton>

                <ViewButton onClick={() => handleView(item)}>View</ViewButton>

                <RemoveButton
                  onClick={() => handleRemove(item.id)}
                  disabled={deleteMutation.isPending && deleteMutation.variables === item.id}
                >
                  {deleteMutation.isPending && deleteMutation.variables === item.id ? "Removing..." : "Remove"}
                </RemoveButton>
              </ActionArea>
            </FileCard>
          ))}

        {error && <EmptyText>{error.message}</EmptyText>}

      {files.length !== 0 && <Footer>
        <ResultText>
          Showing {startIndex} to {endIndex} of {pagination.totalFiles}{" "}
          results
        </ResultText>

        <Pagination>
          <PageButton
            disabled={!pagination.hasPrevPage || isPlaceholderData}
            onClick={() =>
              setCurrentPage((page) => Math.max(1, page - 1))
            }
          >
            {"<"}
          </PageButton>

          {visiblePageNumbers.map((pageNumber) => (
            <PageButton
              key={pageNumber}
              $active={Number(resolvedCurrentPage) === pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </PageButton>
          ))}

          <PageButton
            disabled={!pagination.hasNextPage || isPlaceholderData}
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(pagination.totalPages || 1, page + 1),
              )
            }
          >
            {">"}
          </PageButton>
        </Pagination>
      </Footer>}
      </Container>
    </Page>
  );
};

export default SubmittedFiles;
