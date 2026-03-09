import styled from "styled-components";

export const HomeContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
  padding: 24px 16px;
  background: ${(props) => (props.theme.mode === "DARK" ? "#0f0f0f" : "#f6f3f3")};
`;

export const CardContainer = styled.div`
  width: 100%;
  max-width: 520px;
  border-radius: 14px;
  border: 1px solid ${(props) => (props.theme.mode === "DARK" ? "#2a2a2a" : "#1a1a1a")};
  background: ${(props) => props.theme.body.primary.base};
  padding: 22.4px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.18);
`;

export const BackButton = styled.button`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 4.8px;
  color: ${(props) => props.theme.text.secondary};
  font-size: 14.4px;
  cursor: pointer;
`;

export const UploadArea = styled.div`
  border: 2px dashed
    ${(props) =>
      props.$isDragActive ? props.theme.primary.base : props.theme.border.primary};
  border-radius: 10px;
  min-height: 220px;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 20px 16px;
  background: ${(props) =>
    props.$isDragActive
      ? props.theme.mode === "DARK"
        ? "rgba(229, 57, 53, 0.12)" : "rgba(229, 57, 53, 0.06)"
      : "transparent"};
`;

export const UploadIconWrap = styled.button`
  width: 58px;
  height: 58px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${(props) => props.theme.primary.base};
  background: ${(props) =>
    props.theme.mode === "DARK"
      ? props.theme.body.secondary.base
      : props.theme.body.secondary.base};
  border: 1px solid ${(props) => (props.theme.mode === "DARK" ? "#2a2a2a" : "#1a1a1a")};
  cursor: pointer;
`;

export const UploadTitle = styled.h2`
  margin: 14.4px 0 5.6px;
  font-size: 30.4px;
  font-weight: 700;
  color: ${(props) => props.theme.text.primary};
`;

export const UploadSubTitle = styled.p`
  margin: 0;
  font-size: 15.36px;
  color: ${(props) => props.theme.text.secondary};
`;

export const UploadAreaText = styled.p`
  margin: 11.2px 0 0;
  font-size: 14.08px;
  color: ${(props) => props.theme.text.secondary};
`;

export const FileInput = styled.input`
  display: none;
`;

const buttonBase = `
  width: 100%;
  border-radius: 10px;
  padding: 14.72px 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
`;

export const ProceedButton = styled.button`
  ${buttonBase}
  border: 1px solid transparent;
  background: ${(props) => props.theme.primary.base};
  color: #ffffff;
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.35);
  opacity: ${(props) => (props.disabled ? 0.55 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

export const RemoveTextButton = styled.button`
  margin-left: 5.6px;
  color: ${(props) => props.theme.primary.base};
  text-decoration: underline;
  cursor: pointer;
`;

export const MessageText = styled.p`
  margin: 1.6px 0 0;
  font-size: 14.4px;
  color: ${(props) => (props.$isError ? "#d63a3a" : "#2b9b49")};
`;

