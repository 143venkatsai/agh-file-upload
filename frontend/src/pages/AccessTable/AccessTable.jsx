import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import { toast } from "react-toastify";
import {
  getAllStudentsForFileApi,
  getFileAccessStudentsApi,
  removeStudentAccessApi,
  updateFileStudentsAccessApi,
} from "../../services/apiClient";
import { ArrowLeft } from "lucide-react";

const PAGE_LIMIT = 10;

const AccessTable = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isAddMode = searchParams.get("mode") === "add";

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [removingStudentId, setRemovingStudentId] = useState("");
  const [error, setError] = useState("");
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    pageSize: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    if (!id) {
      setRows([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError("");

      try {
        const payload = isAddMode
          ? await getAllStudentsForFileApi({
              fileId: id,
              search: query.trim(),
              page: currentPage,
              limit: PAGE_LIMIT,
            })
          : await getFileAccessStudentsApi({
              fileId: id,
              search: query.trim(),
              page: currentPage,
              limit: PAGE_LIMIT,
            });

        if (controller.signal.aborted) return;

        const students = payload?.data?.students || [];
        const pageInfo = payload?.data?.pagination || {};

        const mappedRows = students.map((student) => ({
          id: student._id,
          name: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
          collegeName: student.collegeName || "-",
          level: student.ugOrPg || "-",
          yearPassing: student.year || "-",
          department: student.department || "-",
          hasAccess: Boolean(student.hasAccess),
        }));

        setRows(mappedRows);
        setPagination({
          currentPage: pageInfo.currentPage || currentPage,
          totalPages: pageInfo.totalPages || 1,
          totalStudents: pageInfo.totalStudents || 0,
          pageSize: pageInfo.pageSize || mappedRows.length,
          hasNextPage: Boolean(pageInfo.hasNextPage),
          hasPrevPage: Boolean(pageInfo.hasPrevPage),
        });

        if (isAddMode) {
          setSelectedStudents((prev) => {
            const next = new Set(prev);
            mappedRows.forEach((row) => {
              if (row.hasAccess) {
                next.add(row.id);
              }
            });
            return next;
          });
        }
      } catch (fetchError) {
        if (!controller.signal.aborted) {
          setError(fetchError.message || "Failed to load access list.");
          setRows([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [id, query, currentPage, isAddMode]);

  const visibleRows = useMemo(() => rows, [rows]);

  const startIndex = pagination.totalStudents
    ? (pagination.currentPage - 1) * PAGE_LIMIT + 1
    : 0;
  const endIndex = pagination.totalStudents
    ? Math.min(
        (pagination.currentPage - 1) * PAGE_LIMIT + visibleRows.length,
        pagination.totalStudents,
      )
    : 0;

  const handleRemove = async (studentId) => {
    if (!id || !studentId) return;

    try {
      setRemovingStudentId(studentId);
      await removeStudentAccessApi({ fileId: id, studentId });
      toast.success("Access removed successfully");

      setRows((prevRows) => prevRows.filter((row) => row.id !== studentId));
      setSelectedStudents((prev) => {
        const next = new Set(prev);
        next.delete(studentId);
        return next;
      });
      setPagination((prev) => ({
        ...prev,
        totalStudents: Math.max(0, prev.totalStudents - 1),
      }));
    } catch (removeError) {
      toast.error(removeError.message || "Failed to remove access");
    } finally {
      setRemovingStudentId("");
    }
  };

  const toggleStudent = (studentId) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }
      return next;
    });
  };

  const handleEnableAddMode = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("mode", "add");
    setSearchParams(nextParams);
    setCurrentPage(1);
  };

  const handleDisableAddMode = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("mode");
    setSearchParams(nextParams);
    setCurrentPage(1);
  };

  const handleSaveChanges = async () => {
    try {
      await updateFileStudentsAccessApi({
        fileId: id,
        studentIds: Array.from(selectedStudents),
      });
      toast.success("Access updated successfully");
      handleDisableAddMode();
    } catch (saveError) {
      toast.error(saveError.message || "Failed to update access");
    }
  };

  const navigate = useNavigate();

  return (
    <Page>
      <Container>
        <BackButton type="button" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Back
        </BackButton>
        <Toolbar>
          <SearchInput
            type="search"
            placeholder="Search records..."
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
          />
          {!isAddMode ? (
            <EditAccessButton type="button" onClick={handleEnableAddMode}>
              Add Students
            </EditAccessButton>
          ) : (
            <EditAccessButton type="button" onClick={handleSaveChanges}>
              Save Changes
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
              {visibleRows.map((row, idx) => (
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
                        type="button"
                        onClick={() => handleRemove(row.id)}
                        disabled={removingStudentId === row.id}
                      >
                        {removingStudentId === row.id
                          ? "REMOVING..."
                          : "REMOVE ACCESS"}
                      </RemoveButton>
                    </Td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>

          {isLoading && <EmptyText>Loading students...</EmptyText>}
          {!id && <EmptyText>File id is missing in route.</EmptyText>}
          {!isLoading && !error && !visibleRows.length && (
            <EmptyText>No records found.</EmptyText>
          )}
          {error && <EmptyText>{error}</EmptyText>}
        </TableWrap>

        <Footer>
          <ResultText>
            Showing {startIndex} to {endIndex} of {pagination.totalStudents}{" "}
            results
          </ResultText>
          <Pagination>
            <PageButton
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={!pagination.hasPrevPage}
            >
              {"<"}
            </PageButton>
            {Array.from(
              { length: Math.max(1, pagination.totalPages) },
              (_, index) => index + 1,
            ).map((page) => (
              <PageButton
                key={page}
                type="button"
                $active={page === pagination.currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PageButton>
            ))}
            <PageButton
              type="button"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(Math.max(1, pagination.totalPages), prev + 1),
                )
              }
              disabled={!pagination.hasNextPage}
            >
              {">"}
            </PageButton>
          </Pagination>
        </Footer>
      </Container>
    </Page>
  );
};

export default AccessTable;
