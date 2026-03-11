// import React, { useEffect, useState } from "react";
// import { ArrowLeft, FileText, Upload } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { deleteFileApi, getFilesApi } from "../../services/apiClient";
// import {
//   ActionArea,
//   FileIconBox,
//   FileMeta,
//   FileName,
//   FilePrimary,
//   Container,
//   EmptyText,
//   FileCard,
//   Page,
//   RemoveButton,
//   UploadButton,
//   BackLink,
//   TopBar,
//   CenterNoFilesLoader,
//   ViewButton,
//   AccessButton,
// } from "./SubmittedFiles.styles";

// const formatModifiedText = (dateValue) => {
//   if (!dateValue) return "Modified recently";
//   const date = new Date(dateValue);
//   if (Number.isNaN(date.getTime())) return "Modified recently";
//   return `Modified ${date.toLocaleDateString("en-US", {
//     month: "short",
//     day: "2-digit",
//     year: "numeric",
//   })}`;
// };

// const SubmittedFiles = () => {
//   const navigate = useNavigate();
//   const [items, setItems] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchFiles = async () => {
//       setIsLoading(true);
//       setError("");
//       try {
//         const result = await getFilesApi();
//         const apiFiles = Array.isArray(result?.files) ? result.files : [];
//         setItems(apiFiles);

//         if (!apiFiles.length) {
//           setItems([]);
//           return;
//         }

//         const mapped = apiFiles.map((file) => ({
//           id: file._id,
//           name: file.title || "Untitled file",
//           meta: formatModifiedText(file.updatedAt),
//         }));
//         setItems(mapped);
//       } catch (fetchError) {
//         setError(fetchError.message || "Failed to load files.");
//         setItems([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchFiles();
//   }, []);

//   const handleRemove = async (item) => {

//     try {
//       setDeletingId(item.id);
//       setError("");
//       await deleteFileApi(item.id);

//       setItems((prevItems) =>
//         prevItems.filter((entry) => entry.id !== item.id),
//       );
//     } catch (deleteError) {
//       setError(deleteError.message || "Failed to delete file.");
//     } finally {
//       setDeletingId("");
//     }
//   };

//   const handleView = (item) => {
//     if (!item?.id) return;
//     navigate(`/file-view/${item.id}`);
//   };

//   const handleViewAccess = (item) => {
//     if (!item?.id) return;
//     navigate(`/view-access/${item.id}`);
//   };

//   return (
//     <Page>
//       <Container>
//         <TopBar>
//           <BackLink type="button" onClick={() => navigate("/")}>
//             <ArrowLeft size={16} />
//             Back
//           </BackLink>
//           <UploadButton type="button" onClick={() => navigate("/uploads")}>
//             <Upload size={15} />
//             Upload File
//           </UploadButton>
//         </TopBar>
//         {items.length > 0 && (
//           <>
//             {items.map((item) => (
//               <FileCard key={item.id}>
//                 <FilePrimary>
//                   <FileIconBox>
//                     <FileText size={16} />
//                   </FileIconBox>
//                   <div>
//                     <FileName>{item.name}</FileName>
//                     <FileMeta>{item.meta}</FileMeta>
//                   </div>
//                 </FilePrimary>

//                 <ActionArea>
//                   <AccessButton
//                     type="button"
//                     onClick={() => handleViewAccess(item)}
//                   >
//                     View Students
//                   </AccessButton>
//                   <ViewButton type="button" onClick={() => handleView(item)}>
//                     View
//                   </ViewButton>
//                   <RemoveButton
//                     type="button"
//                     onClick={() => handleRemove(item)}
//                     disabled={deletingId === item.id}
//                   >
//                     {deletingId === item.id ? "Removing..." : "Remove"}
//                   </RemoveButton>
//                 </ActionArea>
//               </FileCard>
//             ))}
//           </>
//         )}
//         {!isLoading && items.length <= 0 && (
//           <CenterNoFilesLoader>
//             <h2>No Files Available. Use Upload File to add more.</h2>
//           </CenterNoFilesLoader>
//         )}

//         {isLoading && (
//           <CenterNoFilesLoader>
//             <h2>Loading files...</h2>
//           </CenterNoFilesLoader>
//         )}
//         {error && <EmptyText>{error}</EmptyText>}
//       </Container>
//     </Page>
//   );
// };

// export default SubmittedFiles;

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
    totalPages: 1,
    totalFiles: 0,
  };

  const startIndex = pagination.totalFiles
    ? (currentPage - 1) * PAGE_LIMIT + 1
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
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Removing..." : "Remove"}
                </RemoveButton>
              </ActionArea>
            </FileCard>
          ))}

        {error && <EmptyText>{error.message}</EmptyText>}

        <Footer>
          <ResultText>
            Showing {startIndex} to {endIndex} of {pagination.totalFiles}{" "}
            results
          </ResultText>

          <Pagination>
            <PageButton
              disabled={!pagination.hasPrevPage || isPlaceholderData}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              {"<"}
            </PageButton>

            {[...Array(pagination.totalPages)].map((_, i) => (
              <PageButton
                key={i}
                $active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PageButton>
            ))}

            <PageButton
              disabled={!pagination.hasNextPage || isPlaceholderData}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              {">"}
            </PageButton>
          </Pagination>
        </Footer>
      </Container>
    </Page>
  );
};

export default SubmittedFiles;
