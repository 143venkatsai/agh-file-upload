import React from "react";
import {
  FieldBody,
  FieldLabel,
  FieldWrap,
  FileName,
  ImagePreview,
  Panel,
} from "./DetailsPanel.styles";

const DetailsPanel = ({ fileName, activePage }) => {
  if (!activePage) return null;

  return (
    <Panel>
      <FieldWrap>
        <FieldLabel>Original Filename</FieldLabel>
        <FileName>{fileName || "Untitled"}</FileName>
      </FieldWrap>

      <ImagePreview
        src={activePage.imageUrl}
        alt={activePage.title || "Page preview"}
      />

      <FieldWrap>
        <FieldLabel>Title</FieldLabel>
        <FieldBody>{activePage.title || "-"}</FieldBody>
      </FieldWrap>

      <FieldWrap>
        <FieldLabel>Description</FieldLabel>
        <FieldBody>{activePage.description || "-"}</FieldBody>
      </FieldWrap>
    </Panel>
  );
};

export default DetailsPanel;
