import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AccessType,
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
  Th,
  Toolbar,
} from "./AccessTable.styles";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:3000/api/files";

const AccessTable = () => {
  const { id } = useParams();
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAddMode, setIsAddMode] = useState(false);
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
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: "10",
        });
        if (query.trim()) {
          params.set("keyword", query.trim());
        }

        const response = await fetch(
          `${API_BASE_URL}/students/access/${id}?${params.toString()}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch students (${response.status})`);
        }

        const payload = await response.json();
        const students = Array.isArray(payload?.data?.students)
          ? payload.data.students
          : [];
        const pageInfo = payload?.data?.pagination || {};

        const mappedRows = students.map((student) => ({
          id: student._id,
          name: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
          collegeName: student.collegeName || "-",
          level: student.ugOrPg || "-",
          yearPassing: student.year || "-",
          department: student.department || "-",
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
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message || "Failed to load access list.");
          setRows([]);
          setPagination((prev) => ({
            ...prev,
            totalStudents: 0,
            totalPages: 1,
            pageSize: 0,
            hasNextPage: false,
            hasPrevPage: false,
          }));
        }
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [id, query, currentPage]);

  const visibleRows = useMemo(() => rows, [rows]);

  const startIndex = pagination.totalStudents
    ? (pagination.currentPage - 1) * (pagination.pageSize || 10) + 1
    : 0;
  const endIndex = pagination.totalStudents
    ? Math.min(
        (pagination.currentPage - 1) * (pagination.pageSize || 10) +
          visibleRows.length,
        pagination.totalStudents,
      )
    : 0;

  const handleRemove = (studentId) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== studentId));
  };

  const fetchAllStudents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/students`);

      // if (!response.ok) {
      //   throw new Error("Failed to fetch students");
      // }

      const payload = await response.json();

      const students = payload?.data?.students || [];

      const mappedRows = students.map((student) => ({
        id: student._id,
        name: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
        collegeName: student.collegeName || "-",
        level: student.ugOrPg || "-",
        yearPassing: student.year || "-",
        department: student.department || "-",
        hasAccess: student.hasAccess,
      }));

      setRows(mappedRows);

      const selected = new Set(
        mappedRows.filter((s) => s.hasAccess).map((s) => s.id),
      );

      setSelectedStudents(selected);
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStudent = (id) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }

      return newSet;
    });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/access/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentIds: Array.from(selectedStudents),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update access");
      }

      toast.success("Access updated successfully");

      setIsAddMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page>
      <Container>
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
          <EditAccessButton
            type="button"
            onClick={() => {
              setIsAddMode(true);
              fetchAllStudents();
            }}
          >
            Add Students
          </EditAccessButton>
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
                <Th>ACTIONS</Th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, idx) => (
                <tr key={row.id}>
                  <Td>{startIndex + idx}</Td>
                  <Td>
                    {isAddMode && (
                      <input
                        type="checkbox"
                        checked={selectedStudents.has(row.id)}
                        onChange={() => toggleStudent(row.id)}
                      />
                    )}
                    {row.name}
                  </Td>
                  <Td>{row.collegeName}</Td>
                  <Td>
                    <AccessType>{row.level}</AccessType>
                  </Td>
                  <Td>{row.yearPassing}</Td>
                  <Td>{row.department}</Td>
                  <Td>
                    <RemoveButton
                      type="button"
                      onClick={() => handleRemove(row.id)}
                    >
                      REMOVE ACCESS
                    </RemoveButton>
                  </Td>
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
        {isAddMode && (
          <div style={{ marginTop: "10px", textAlign: "right" }}>
            <EditAccessButton onClick={handleSaveChanges}>
              Save Changes
            </EditAccessButton>
          </div>
        )}
      </Container>
    </Page>
  );
};

export default AccessTable;
