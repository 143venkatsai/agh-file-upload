import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${(props) => props.theme.body.secondary.base};
  padding: 16px;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  gap: 14px;
`;

export const BackButton = styled.button`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${(props) => props.theme.text.primary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

export const ContentGrid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;

  @media (min-width: 900px) {
    grid-template-columns: 320px minmax(0, 1fr);
    align-items: start;
  }
`;

export const ThumbnailsPane = styled.div`
  order: 2;

  @media (min-width: 900px) {
    order: 1;
  }
`;

export const DetailsPane = styled.div`
  order: 1;

  @media (min-width: 900px) {
    order: 2;
  }
`;

export const InfoText = styled.p`
  margin: 0;
  color: ${(props) => props.theme.text.secondary};
  font-size: 14px;
`;
