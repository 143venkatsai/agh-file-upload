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

const API_BASE_URL = "http://localhost:3000/api/files";
const PAGE_SIZE = 5;

const AccessTable = () => {
  const { id } = useParams();
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        const searchParam = query.trim()
          ? `?search=${encodeURIComponent(query.trim())}`
          : "";

        const response = await fetch(
          `${API_BASE_URL}/students/access/${id}${searchParam}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch students (${response.status})`);
        }

        const data = await response.json();
        const students = Array.isArray(data?.students) ? data.students : [];

        const mappedRows = students.map((student) => ({
          id: student._id,
          name: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
          collegeName: student.collegeName || "-",
          level: student.ugOrPg || "-",
          yearPassing: student.year || "-",
          department: student.department || "-",
        }));

        setRows(mappedRows);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message || "Failed to load access list.");
          setRows([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [id, query]);

  const filteredRows = useMemo(() => rows, [rows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const visibleRows = filteredRows.slice(startIndex, endIndex);

  const handleRemove = (studentId) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== studentId));
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
          <EditAccessButton type="button">Add Students</EditAccessButton>
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
                  <Td>{startIndex + idx + 1}</Td>
                  <Td>{row.name}</Td>
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
            Showing {filteredRows.length ? startIndex + 1 : 0} to{" "}
            {Math.min(endIndex, filteredRows.length)} of {filteredRows.length}{" "}
            results
          </ResultText>
          <Pagination>
            <PageButton
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={safePage === 1}
            >
              {"<"}
            </PageButton>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <PageButton
                  key={page}
                  type="button"
                  $active={page === safePage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PageButton>
              ),
            )}
            <PageButton
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={safePage === totalPages}
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
