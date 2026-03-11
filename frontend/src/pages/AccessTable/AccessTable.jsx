import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  getAllStudentsForFileApi,
  getFileAccessStudentsApi,
  removeStudentAccessApi,
  updateFileStudentsAccessApi,
} from "../../services/apiClient";

import {
  AccessType,
  BackButton,
  CheckboxInput,
  Container,
  EditAccessButton,
  EmptyText,
  Footer,
  Page,
  PageButton,
  Pagination,
  RemoveButton,
  ResultText,
  SearchInput,
  Table,
  TableWrap,
  Td,
  TdNew,
  Th,
  Toolbar,
} from "./AccessTable.styles";

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

const AccessTable = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const isAddMode = searchParams.get("mode") === "add";
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState(new Set());

  useEffect(() => {
    if (!isAddMode || !id) return;

    let isMounted = true;

    const loadAlreadyAuthorizedStudents = async () => {
      try {
        const payload = await getFileAccessStudentsApi({
          fileId: id,
          search: "",
          page: 1,
          limit: 1000,
        });

        if (!isMounted) return;
        const authorizedIds = (payload?.data?.students || []).map(
          (student) => student._id,
        );
        setSelectedStudents(new Set(authorizedIds));
      } catch (err) {
        toast.error(
          err.message || "Failed to load existing access for selected file.",
        );
      }
    };

    loadAlreadyAuthorizedStudents();

    return () => {
      isMounted = false;
    };
  }, [isAddMode, id]);

  const { data, isLoading, isPlaceholderData, error } = useQuery({
    queryKey: ["students", id, isAddMode, query, currentPage],
    queryFn: () =>
      isAddMode
        ? getAllStudentsForFileApi({
            fileId: id,
            search: query.trim(),
            page: currentPage,
          })
        : getFileAccessStudentsApi({
            fileId: id,
            search: query.trim(),
            page: currentPage,
          }),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5000,
  });

  const removeMutation = useMutation({
    mutationFn: removeStudentAccessApi,
    onSuccess: () => {
      toast.success("Access removed successfully");
      queryClient.invalidateQueries(["students", id]);
    },
    onError: (err) => toast.error(err.message || "Failed to remove access"),
  });

  const saveMutation = useMutation({
    mutationFn: updateFileStudentsAccessApi,
    onSuccess: () => {
      toast.success("Access updated successfully");
      queryClient.invalidateQueries(["students", id]);
      handleDisableAddMode();
    },
    onError: (err) => toast.error(err.message || "Failed to update access"),
  });

  const rows = useMemo(() => {
    const students = data?.data?.students || [];
    return students.map((student) => ({
      id: student._id,
      name: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
      collegeName: student.collegeName || "-",
      level: student.ugOrPg || "-",
      yearPassing: student.year || "-",
      department: student.department || "-",
      hasAccess: Boolean(student.hasAccess),
    }));
  }, [data]);

  const pagination = data?.data?.pagination || {
    currentPage,
    totalPages: 1,
    totalStudents: 0,
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

  const toggleStudent = (studentId) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      next.has(studentId) ? next.delete(studentId) : next.add(studentId);
      return next;
    });
  };

  const handleDisableAddMode = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("mode");
    setSearchParams(nextParams);
    setCurrentPage(1);
    setSelectedStudents(new Set());
  };

  const startIndex = pagination.totalStudents
    ? (resolvedCurrentPage - 1) * PAGE_LIMIT + 1
    : 0;
  const endIndex = Math.min(
    startIndex + rows.length - 1,
    pagination.totalStudents,
  );

  return (
    <Page>
      <Container>
        <BackButton onClick={() => navigate("/")}>
          <ArrowLeft size={16} /> Back
        </BackButton>

        <Toolbar>
          <SearchInput
            placeholder="Search by name, email, college..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          {!isAddMode ? (
            <EditAccessButton onClick={() => setSearchParams({ mode: "add" })}>
              Add Students
            </EditAccessButton>
          ) : (
            <EditAccessButton
              onClick={() =>
                saveMutation.mutate({
                  fileId: id,
                  studentIds: Array.from(selectedStudents),
                })
              }
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? "Saving..." : "Save Changes"}
            </EditAccessButton>
          )}
        </Toolbar>

        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>S.NO</Th>
                <Th>NAME</Th>
                <Th>COLLEGE NAME</Th>
                <Th>UG/PG</Th>
                <Th>YEAR PASSING</Th>
                <Th>DEPARTMENT</Th>
                {!isAddMode && <Th>ACTIONS</Th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id}>
                  <Td>{startIndex + idx}</Td>
                  {isAddMode ? (
                    <TdNew>
                      <CheckboxInput
                        type="checkbox"
                        checked={selectedStudents.has(row.id)}
                        onChange={() => toggleStudent(row.id)}
                      />
                      {row.name}
                    </TdNew>
                  ) : (
                    <Td>{row.name}</Td>
                  )}
                  <Td>{row.collegeName}</Td>
                  <Td>
                    <AccessType>{row.level}</AccessType>
                  </Td>
                  <Td>{row.yearPassing}</Td>
                  <Td>{row.department}</Td>
                  {!isAddMode && (
                    <Td>
                      <RemoveButton
                        onClick={() =>
                          removeMutation.mutate({
                            fileId: id,
                            studentId: row.id,
                          })
                        }
                        disabled={removeMutation.isPending}
                      >
                        {removeMutation.isPending &&
                        removeMutation.variables?.studentId === row.id
                          ? "REMOVING..."
                          : "REMOVE ACCESS"}
                      </RemoveButton>
                    </Td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>

          {isLoading && (
            <EmptyText>
              <Loader2 size={20} className="animate-spin" /> Loading...
            </EmptyText>
          )}
          {error && <EmptyText color="red">{error.message}</EmptyText>}
          {!isLoading && rows.length === 0 && (
            <EmptyText>No records found.</EmptyText>
          )}
        </TableWrap>

        {rows.length!==0 && <Footer>
          <ResultText>
            Showing {startIndex} to {endIndex} of {pagination.totalStudents}{" "}
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
                $active={resolvedCurrentPage === pageNumber}
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

export default AccessTable;
