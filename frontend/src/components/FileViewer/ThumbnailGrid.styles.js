import styled from "styled-components";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const ThumbButton = styled.button`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid
    ${(props) => (props.$active ? props.theme.primary.base : props.theme.border.primary)};
  background: ${(props) => props.theme.body.primary.base};
  cursor: pointer;
  padding: 0;
`;

export const ThumbImage = styled.img`
  width: 100%;
  height: 96px;
  object-fit: cover;
  display: block;
`;

export const ThumbIndex = styled.span`
  position: absolute;
  right: 6px;
  bottom: 6px;
  border-radius: 999px;
  padding: 2px 7px;
  font-size: 11px;
  font-weight: 600;
  background: ${(props) => props.theme.body.primary.base};
  color: ${(props) => props.theme.text.primary};
`;
