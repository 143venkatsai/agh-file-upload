import React from "react";
import { Grid, ThumbButton, ThumbImage, ThumbIndex } from "./ThumbnailGrid.styles";

const ThumbnailGrid = ({ pages, activeIndex, onSelect }) => {
  if (!pages.length) return null;

  return (
    <Grid>
      {pages.map((page, index) => (
        <ThumbButton
          key={`${page.pageNo || index}-${index}`}
          type="button"
          $active={index === activeIndex}
          onClick={() => onSelect(index)}
        >
          <ThumbImage
            src={page.imageUrl}
            alt={`Page ${page.pageNo || index + 1} thumbnail`}
          />
          <ThumbIndex>{page.pageNo || index + 1}</ThumbIndex>
        </ThumbButton>
      ))}
    </Grid>
  );
};

export default ThumbnailGrid;
