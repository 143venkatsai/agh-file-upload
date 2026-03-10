import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  padding: 14px 12px 28px;
  background: ${(props) => props.theme.body.secondary.base};

  @media (min-width: 681px) {
    padding: 14px 16px 28px;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  gap: 10px;
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${(props) => props.theme.text.primary};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
`;

export const UploadButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #08945f;
  color: #ffffff;
  border: 1px solid #0b8e5d;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  cursor: pointer;
`;

export const FileCard = styled.div`
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: 10px;
  background: ${(props) => props.theme.body.primary.base};
  min-height: 74px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 680px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }
`;

export const FilePrimary = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  width: 100%;
`;

export const FileIconBox = styled.div`
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: ${(props) =>
    props.theme.mode === "DARK" ? "#4b3a38" : "#fdf0eb"};
  color: #ef6a38;
`;

export const FileName = styled.h3`
  margin: 0;
  font-size: 22px;
  line-height: 1.1;
  font-weight: 700;
  color: ${(props) => (props.theme.mode === "DARK" ? "#cfdfff" : "#071f4a")};
  overflow-wrap: anywhere;
  word-break: break-word;

  @media (max-width: 680px) {
    font-size: 16px;
  }
`;

export const FileMeta = styled.p`
  margin: 3px 0 0;
  font-size: 13px;
  color: ${(props) => props.theme.text.secondary};
`;

export const ActionArea = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0;
  flex-shrink: 0;

  @media (max-width: 680px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const RemoveButton = styled.button`
  border: 1px solid transparent;
  border-radius: 8px;
  background: ${(props) =>
    props.theme.mode === "DARK" ? "#FFE6E6" : "#e62f22"};
  color: ${(props) => (props.theme.mode === "DARK" ? "#323f4b" : "#ffffff")};
  font-size: 12px;
  font-weight: 600;
  padding: 9px 14px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.65 : 1)};
`;

export const EmptyText = styled.p`
  margin: 8px 2px 0;
  color: ${(props) => props.theme.text.secondary};
  font-size: 14px;
`;

export const CenterNoFilesLoader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;

  h2 {
    color: ${(props) => props.theme.text.secondary};
    font-size: 22px;
    text-align: center;
    font-weight: bold;
  }
`;
