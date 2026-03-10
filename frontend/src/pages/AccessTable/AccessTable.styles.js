import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${(props) => props.theme.body.secondary.base};
  padding: 22px 16px 30px;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 14px;
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const SearchInput = styled.input`
  width: 100%;
  max-width: 420px;
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: 10px;
  background: ${(props) => props.theme.body.primary.base};
  color: ${(props) => props.theme.text.primary};
  padding: 10px 12px;
  font-size: 14px;

  &::placeholder {
    color: ${(props) => props.theme.text.secondary};
  }
`;

export const EditAccessButton = styled.button`
  border: 1px solid transparent;
  border-radius: 10px;
  background: ${(props) => props.theme.submissionStatus.success};
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  cursor: pointer;
`;

export const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: 12px;
  background: ${(props) => props.theme.body.primary.base};
`;

export const Table = styled.table`
  width: 100%;
  min-width: 920px;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: left;
  padding: 14px 12px;
  font-size: 12px;
  letter-spacing: 0.8px;
  color: ${(props) => props.theme.text.secondary};
  border-bottom: 1px solid ${(props) => props.theme.border.primary};
`;

export const CheckboxInput = styled.input`
  height: 20px;
  width: 20px;
  cursor: pointer;
  margin-right: 8px;
`;

export const Td = styled.td`
  padding: 14px 12px;
  font-size: 15px;
  color: ${(props) => props.theme.text.primary};
  border-bottom: 1px solid ${(props) => props.theme.border.primary};
  vertical-align: top;
`;

export const TdNew = styled.td`
  padding: 17px 12px;
  font-size: 15px;
  color: ${(props) => props.theme.text.primary};
  border-bottom: 1px solid ${(props) => props.theme.border.primary};
  vertical-align: top;

  display: flex;
  align-items: center;
  gap: 10px;
`;

export const AccessType = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 3px 9px;
  font-size: 12px;
  font-weight: 600;
  background: ${(props) => props.theme.result_btn_bg};
  color: ${(props) => props.theme.result_btn_text};
`;

export const RemoveButton = styled.button`
  color: ${(props) => props.theme.result_wrong_bg};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid;
  padding: 4px 8px;
  border-radius: 6px;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const ResultText = styled.p`
  margin: 0;
  color: ${(props) => props.theme.text.secondary};
  font-size: 14px;
`;

export const Pagination = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

export const PageButton = styled.button`
  min-width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.border.primary};
  background: ${(props) =>
    props.$active ? props.theme.primary.base : props.theme.body.primary.base};
  color: ${(props) => (props.$active ? "#ffffff" : props.theme.text.primary)};
  font-size: 13px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

export const EmptyText = styled.p`
  margin: 0;
  padding: 18px 12px;
  font-size: 14px;
  text-align: center;
  color: ${(props) => props.theme.text.secondary};
`;
