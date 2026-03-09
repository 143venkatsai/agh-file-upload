import styled from "styled-components";

export const HomeContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 20px 16px 28px;
  background: ${(props) => props.theme.body.secondary.base};
`;

export const UploadPageTitle = styled.h1`
  margin: 0 0 16px;
  width: 100%;
  text-align: center;
  font-size: 44px;
  font-weight: 700;
  color: ${(props) => props.theme.text.primary};

  @media screen and (max-width: 860px) {
    font-size: 34px;
  }

  @media screen and (max-width: 560px) {
    font-size: 28px;
  }
`;

export const CardContainer = styled.div`
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  border-radius: 14px;
  border: 1px solid ${(props) => props.theme.border.primary};
  background: ${(props) => props.theme.body.primary.base};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 10px 24px ${(props) => props.theme.shadow.opacity_10};

  @media screen and (max-width: 560px) {
    padding: 14px;
  }
`;

export const BackButton = styled.button`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${(props) => props.theme.text.secondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

export const HeaderBlock = styled.div`
  text-align: center;
  display: grid;
  gap: 6px;
`;

export const UploadTitle = styled.h2`
  margin: 0;
  font-size: 38px;
  font-weight: 700;
  color: ${(props) => props.theme.text.primary};

  @media screen and (max-width: 560px) {
    font-size: 28px;
  }
`;

export const UploadSubTitle = styled.p`
  margin: 0;
  font-size: 22px;
  color: ${(props) => props.theme.text.secondary};

  @media screen and (max-width: 560px) {
    font-size: 18px;
  }
`;

export const UploadArea = styled.div`
  border: 2px dashed
    ${(props) =>
      props.$isDragActive
        ? props.theme.primary.base
        : props.theme.border.primary};
  border-radius: 10px;
  min-height: 290px;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 20px 14px;
  background: ${(props) => props.theme.body.secondary.base};
`;

export const UploadIconWrap = styled.button`
  width: 74px;
  height: 74px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${(props) => props.theme.submissionStatus.success};
  background: ${(props) => props.theme.body.primary.base};
  border: 1px solid ${(props) => props.theme.border.primary};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

export const UploadAreaText = styled.p`
  margin: 14px 0 0;
  font-size: 34px;
  font-weight: 700;
  color: ${(props) => props.theme.text.primary};

  @media screen and (max-width: 560px) {
    font-size: 24px;
  }
`;

export const UploadHintText = styled.p`
  margin: 8px 0 0;
  font-size: 18px;
  color: ${(props) => props.theme.text.secondary};

  @media screen and (max-width: 560px) {
    font-size: 14px;
  }
`;

export const SelectFilesButton = styled.button`
  margin-top: 14px;
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: 8px;
  background: ${(props) => props.theme.body.primary.base};
  color: ${(props) => props.theme.text.primary};
  font-size: 18px;
  font-weight: 600;
  padding: 10px 18px;
  cursor: pointer;
`;

export const UploadStatus = styled.div`
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: ${(props) => props.theme.text.secondary};
`;

export const Spinner = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid ${(props) => props.theme.border.primary};
  border-top-color: ${(props) => props.theme.submissionStatus.success};
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const SelectedFileCard = styled.div`
  width: 100%;
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: 10px;
  background: ${(props) => props.theme.body.secondary.base};
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const SelectedFileMeta = styled.div`
  min-width: 0;
`;

export const SelectedFileName = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SelectedFileSize = styled.p`
  margin: 3px 0 0;
  font-size: 13px;
  color: ${(props) => props.theme.text.secondary};
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
  box-shadow: 0 8px 16px ${(props) => props.theme.shadow.opacity_15};
  opacity: ${(props) => (props.disabled ? 0.55 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

export const RemoveTextButton = styled.button`
  color: ${(props) => props.theme.text.secondary};
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
`;

export const MessageText = styled.p`
  margin: 1.6px 0 0;
  font-size: 14px;
  color: ${(props) =>
    props.$isError
      ? props.theme.result_wrong_bg
      : props.theme.submissionStatus.success};
`;
