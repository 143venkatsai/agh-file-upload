import styled, { css } from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 14px 16px 28px;
  background: ${(props) => props.theme.body.secondary.base};
`;

export const Container = styled.div`
  width: 100%;
  max-width: 640px;
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
  }
`;

export const FilePrimary = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 680px) {
    font-size: 16px;
    white-space: normal;
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
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 680px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const previewVariantStyles = {
  illustration: css`
    background:
      radial-gradient(circle at 25% 65%, #d49664 7px, transparent 8px),
      radial-gradient(circle at 42% 58%, #efc695 7px, transparent 8px),
      radial-gradient(circle at 56% 65%, #5794a8 7px, transparent 8px),
      radial-gradient(circle at 45% 32%, #91bfca 7px, transparent 8px),
      radial-gradient(circle at 60% 39%, #e3b584 7px, transparent 8px),
      radial-gradient(circle at 32% 42%, #dbb88f 8px, transparent 9px), #efe9dd;
  `,
  sunset: css`
    background: linear-gradient(180deg, #ef8209 0%, #cd672d 55%, #8f4d7d 100%);
  `,
  wave: css`
    background:
      radial-gradient(
        circle at 20% 20%,
        #3c85b7 0,
        #d5e3ef 38%,
        transparent 56%
      ),
      repeating-radial-gradient(
        circle at 70% 55%,
        rgba(47, 121, 177, 0.2) 0 2px,
        transparent 2px 5px
      ),
      #f5f8fb;
  `,
  darkWave: css`
    background:
      radial-gradient(
        circle at 10% 30%,
        rgba(49, 80, 102, 0.4) 0 18%,
        transparent 35%
      ),
      repeating-radial-gradient(
        circle at 60% 70%,
        rgba(129, 162, 182, 0.22) 0 2px,
        transparent 2px 6px
      ),
      #0f1d25;
  `,
};

export const PreviewBox = styled.div`
  width: 90px;
  height: 42px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.border.primary};
  ${(props) =>
    previewVariantStyles[props.$variant] || previewVariantStyles.sunset}
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const RemoveButton = styled.button`
  border: 1px solid transparent;
  border-radius: 8px;
  background: ${(props) =>
    props.theme.mode === "DARK" ? "#3e4348" : "#edf1f5"};
  color: ${(props) => (props.theme.mode === "DARK" ? "#d9e2ee" : "#445c79")};
  font-size: 12px;
  font-weight: 600;
  padding: 9px 14px;
  cursor: pointer;
`;

export const EmptyText = styled.p`
  margin: 8px 2px 0;
  color: ${(props) => props.theme.text.secondary};
  font-size: 14px;
`;
