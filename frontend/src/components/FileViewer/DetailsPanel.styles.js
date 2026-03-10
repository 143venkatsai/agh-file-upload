import styled from "styled-components";

export const Panel = styled.div`
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: 12px;
  background: ${(props) => props.theme.body.primary.base};
  padding: 14px;
  display: grid;
  gap: 12px;
`;

export const FieldWrap = styled.div`
  display: grid;
  gap: 6px;
`;

export const FieldLabel = styled.p`
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: ${(props) => props.theme.text.secondary};
  font-weight: 600;
`;

export const FileName = styled.h2`
  margin: 0;
  font-size: 24px;
  color: ${(props) => props.theme.text.primary};
  overflow-wrap: anywhere;

  @media (max-width: 700px) {
    font-size: 18px;
  }
`;

export const ImagePreview = styled.img`
  width: 100%;
  min-height: auto;
  height: auto;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.border.primary};
  object-fit: cover;
  background: transparent;
  display: block;

  @media (max-width: 900px) {
    min-height: auto;
    height: auto;
  }

  @media (max-width: 560px) {
    min-height: auto;
    height: auto;
  }
`;

export const FieldBody = styled.div`
  border: 1px solid ${(props) => props.theme.border.primary};
  border-radius: 8px;
  background: ${(props) => props.theme.body.secondary.base};
  color: ${(props) => props.theme.text.primary};
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.5;
  min-height: 42px;
`;
