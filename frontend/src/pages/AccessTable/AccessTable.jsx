import React, { useMemo, useState } from "react";
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

const DUMMY_ROWS = [
  {
    id: 1,
    name: "Johnathan Doe",
    collegeName: "Tech Institute of Technology",
    level: "UG",
    yearPassing: "2024",
    department: "Computer Science",
  },
  {
    id: 2,
    name: "Jane Sarah Smith",
    collegeName: "Metropolitan Science College",
    level: "PG",
    yearPassing: "2023",
    department: "Quantum Physics",
  },
];

const PAGE_SIZE = 1;

const AccessTable = () => {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState(DUMMY_ROWS);

  const filteredRows = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    if (!lowerQuery) return rows;

    return rows.filter((row) =>
      [row.name, row.collegeName, row.level, row.yearPassing, row.department]
        .join(" ")
        .toLowerCase()
        .includes(lowerQuery),
    );
  }, [query, rows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const visibleRows = filteredRows.slice(startIndex, endIndex);

  const handleRemove = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
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
          <EditAccessButton type="button">Edit Access</EditAccessButton>
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
          {!visibleRows.length && <EmptyText>No records found.</EmptyText>}
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
