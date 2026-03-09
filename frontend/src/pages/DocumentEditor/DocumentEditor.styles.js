import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 24px 16px 40px;
  background: ${(props) => props.theme.body.secondary.base};
`;

export const Card = styled.div`
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const BackButton = styled.button`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${(props) => props.theme.text.secondary};
  font-size: 14px;
  cursor: pointer;
`;

export const Label = styled.label`
  margin: 0;
  color: ${(props) => props.theme.text.secondary};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
`;

const fieldBase = `
  width: 100%;
  border-radius: 10px;
  border: 1px solid;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
`;

export const MainTitleField = styled.input`
  ${fieldBase}
  border-color: ${(props) => props.theme.border.primary};
  background: ${(props) =>
    props.theme.mode === "DARK" ? props.theme.body.primary.base : props.theme.body.primary.base};
  color: ${(props) => props.theme.text.primary};
  padding: 12px 14px;
  font-size: 24px;
  font-weight: 500;
  border-radius: 12px;

  &:focus {
    border-color: ${(props) => props.theme.primary.base};
    box-shadow: 0 0 0 2px ${(props) => props.theme.shadow.opacity_10};
  }
`;

export const Preview = styled.div`
  position: relative;
  width: 100%;
  min-height: 400px;
  border-radius: 24px;
  border: 1px solid ${(props) => props.theme.border.primary};
  overflow: hidden;
  background: ${(props) =>
    props.theme.mode === "DARK" ? props.theme.body.primary.base : props.theme.body.primary.base};

  @media (max-width: 900px) {
    min-height: 300px;
  }
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  min-height: 400px;
  object-fit: contain;
  background: ${(props) => props.theme.body.primary.base};

  @media (max-width: 900px) {
    min-height: 300px;
  }
`;

export const WatermarkOverlay = styled.img`
  position: absolute;
  pointer-events: auto;
  cursor: grab;
  z-index: 3;
`;

export const EmptyState = styled.div`
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  color: ${(props) => props.theme.text.secondary};

  svg {
    animation: spin 0.9s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

export const Input = styled.input`
  ${fieldBase}
  border-color: ${(props) => props.theme.border.primary};
  background: ${(props) =>
    props.theme.mode === "DARK" ? props.theme.body.primary.base : props.theme.body.primary.base};
  color: ${(props) => props.theme.text.primary};
  padding: 12px 14px;
  margin-top: 0;
  font-size: 20px;
  border-radius: 12px;

  &:focus {
    border-color: ${(props) => props.theme.primary.base};
    box-shadow: 0 0 0 2px ${(props) => props.theme.shadow.opacity_10};
  }
`;

export const DescriptionField = styled.textarea`
  ${fieldBase}
  border-color: ${(props) => props.theme.border.primary};
  background: ${(props) =>
    props.theme.mode === "DARK" ? props.theme.body.primary.base : props.theme.body.primary.base};
  color: ${(props) => props.theme.text.primary};
  padding: 12px 14px;
  margin-top: 0;
  min-height: 140px;
  resize: vertical;
  font-size: 20px;
  line-height: 1.5;
  border-radius: 22px;

  &:focus {
    border-color: ${(props) => props.theme.primary.base};
    box-shadow: 0 0 0 2px ${(props) => props.theme.shadow.opacity_10};
  }
`;

export const ThumbnailsRow = styled.div`
  padding-top: 6px;
  display: flex;
  align-items: center;
  gap: 12px;
  overflow-x: auto;
`;

export const Thumbnail = styled.button`
  width: 78px;
  min-width: 78px;
  border-radius: 14px;
  border: 2px solid
    ${(props) => (props.$active ? props.theme.primary.base : props.theme.border.primary)};
  padding: 6px;
  background: ${(props) =>
    props.theme.mode === "DARK" ? props.theme.body.primary.base : props.theme.body.primary.base};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  font-size: 12px;
  color: ${(props) => props.theme.text.secondary};
`;

export const ThumbnailImage = styled.img`
  width: 100%;
  height: 74px;
  object-fit: cover;
  border-radius: 10px;
`;

export const FooterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  @media (max-width: 560px) {
    justify-content: stretch;
    width: 100%;
  }
`;

export const CancelButton = styled.button`
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.border.primary};
  color: ${(props) => props.theme.text.primary};
  background: ${(props) => props.theme.body.primary.base};
  padding: 12px 18px;
  font-weight: 600;
  cursor: pointer;

  @media (max-width: 560px) {
    flex: 1;
  }
`;

export const SubmitButton = styled.button`
  border-radius: 12px;
  border: 1px solid transparent;
  background: ${(props) => props.theme.primary.base};
  color: #ffffff;
  padding: 12px 18px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  @media (max-width: 560px) {
    flex: 1;
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  color: ${(props) => props.theme.text.primary};
`;

export const Subtitle = styled.p`
  margin: 0;
  color: ${(props) => props.theme.text.secondary};
  font-size: 14px;
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 10px;
`;

export const WatermarkPanel = styled.div`
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: 14px;
  background: ${(props) => props.theme.body.primary.base};
  padding: 12px;
  display: grid;
  gap: 10px;
`;

export const WatermarkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const WatermarkActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const WatermarkInput = styled.input`
  display: none;
`;

export const WatermarkButton = styled.button`
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.border.primary};
  color: ${(props) => props.theme.text.primary};
  background: ${(props) => props.theme.body.secondary.base};
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
`;

export const WatermarkMeta = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.text.secondary};
`;

export const WatermarkControls = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const RangeGroup = styled.label`
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: ${(props) => props.theme.text.secondary};
`;

export const RangeValue = styled.span`
  font-weight: 600;
  color: ${(props) => props.theme.text.primary};
`;

export const RangeInput = styled.input`
  width: 100%;
`;

