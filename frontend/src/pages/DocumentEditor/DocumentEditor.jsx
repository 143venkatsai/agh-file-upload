import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ActionRow,
  BackButton,
  CancelButton,
  Card,
  DescriptionField,
  EmptyState,
  FooterActions,
  FormRow,
  Input,
  MainTitleField,
  Page,
  Preview,
  PreviewImage,
  SubmitButton,
  Subtitle,
  Thumbnail,
  ThumbnailImage,
  ThumbnailsRow,
  Title,
  WatermarkActions,
  WatermarkButton,
  WatermarkControls,
  WatermarkHeader,
  WatermarkInput,
  WatermarkMeta,
  WatermarkOverlay,
  WatermarkPanel,
  RangeGroup,
  RangeInput,
  RangeValue,
} from "./DocumentEditor.styles";

const buildInitialPage = (imageUrl, pageNumber) => ({
  imageUrl,
  pageNumber,
  pageTitle: `Page ${pageNumber}`,
  description: "",
});

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read watermark file."));
    reader.readAsDataURL(file);
  });

const burnWatermarkToCanvas = (baseImageUrl, watermark) => {
  return new Promise((resolve, reject) => {
    if (!watermark) return resolve(baseImageUrl);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const baseImg = new Image();
    const logoImg = new Image();

    baseImg.crossOrigin = "anonymous"; // Prevents CORS issues with Cloudinary
    logoImg.crossOrigin = "anonymous";

    baseImg.onload = () => {
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;
      ctx.drawImage(baseImg, 0, 0);

      logoImg.onload = () => {
        const w = (watermark.widthPercent / 100) * canvas.width;
        const h = (logoImg.height / logoImg.width) * w;
        const x = (watermark.position.xPercent / 100) * canvas.width;
        const y = (watermark.position.yPercent / 100) * canvas.height;

        ctx.save();
        ctx.globalAlpha = watermark.opacity;
        ctx.translate(x, y);
        ctx.drawImage(logoImg, -w / 2, -h / 2, w, h);
        ctx.restore();

        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      logoImg.src = watermark.logoData;
    };
    baseImg.onerror = () => reject(new Error("Failed to load base image"));
    baseImg.src = baseImageUrl;
  });
};

const DocumentEditor = () => {
  const { id } = useParams(); 
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const file = location.state?.uploadedFile || null;
  const uploadedMeta = location.state?.uploadedMeta || null;
  const createdObjectUrlsRef = useRef([]);
  const watermarkObjectUrlRef = useRef(null);
  const previewRef = useRef(null);

  const [mainTitle, setMainTitle] = useState("");
  const [pages, setPages] = useState([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sourceFileName, setSourceFileName] = useState("");
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState("");
  const [watermarkLogoPreviewUrl, setWatermarkLogoPreviewUrl] = useState("");
  const [watermarkLogoDataUrl, setWatermarkLogoDataUrl] = useState("");
  const [watermarkLogoName, setWatermarkLogoName] = useState("");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.35);
  const [watermarkWidthPercent, setWatermarkWidthPercent] = useState(28);
  const [watermarkXPercent, setWatermarkXPercent] = useState(50);
  const [watermarkYPercent, setWatermarkYPercent] = useState(50);
  const [isDraggingWatermark, setIsDraggingWatermark] = useState(false);

  const activePage = pages[activePageIndex] || null;

  const clearObjectUrls = () => {
    createdObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    createdObjectUrlsRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearObjectUrls();
      if (watermarkObjectUrlRef.current) {
        URL.revokeObjectURL(watermarkObjectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const loadAndExtract = async () => {
      if (!id && !file) return;

      setIsExtracting(true);
      setError("");
      setPages([]);
      setActivePageIndex(0);

      try {
        if (file) {
          const fileNameLower = file.name.toLowerCase();
          const isPdf =
            file.type === "application/pdf" || fileNameLower.endsWith(".pdf");

          setSourceFileName(file.name || "");
          setMainTitle((file.name || "Untitled").replace(/\.[^/.]+$/, ""));

          if (isPdf) {
            const arrayBuffer = await file.arrayBuffer();
            await extractFromArrayBuffer(arrayBuffer);
            return;
          }

          if (file.type.startsWith("image/")) {
            const imageUrl = URL.createObjectURL(file);
            createdObjectUrlsRef.current.push(imageUrl);
            setPages([buildInitialPage(imageUrl, 1)]);
            return;
          }

          throw new Error(
            "Unsupported file format. Please upload PDF, PNG, JPG, or JPEG.",
          );
        }

        const response = await fetch(
          `http://localhost:3000/api/files/get-pdf/${id}`,
        );
        if (!response.ok)
          throw new Error(`File not found (${response.status})`);
        const data = await response.json();

        const fileName = data.originalFileName || data.title || "Untitled";
        const pdfUrl = data.pdfUrl || data.originalPdf || "";
        if (!pdfUrl) {
          throw new Error("PDF URL missing in API response.");
        }

        setMainTitle(fileName.replace(/\.[^/.]+$/, ""));
        setSourceFileName(fileName);
        setUploadedPdfUrl(pdfUrl);

        const pdfResponse = await fetch(pdfUrl);
        if (!pdfResponse.ok) {
          throw new Error(`Failed to fetch PDF (${pdfResponse.status})`);
        }
        const blob = await pdfResponse.blob();
        await extractFromBlob(blob);
      } catch (err) {
        setError("Failed to load document: " + err.message);
      } finally {
        setIsExtracting(false);
      }
    };

    loadAndExtract();
  }, [id, file]);

  const extractFromArrayBuffer = async (arrayBuffer) => {
    const pdfjsLib = await import("pdfjs-dist");
    const pdfWorkerSrc = (
      await import("pdfjs-dist/build/pdf.worker.min.mjs?url")
    ).default;
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

    const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer })
      .promise;
    const extractedPages = [];

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      await page.render({ canvasContext: context, viewport }).promise;

      const imageUrl = canvas.toDataURL("image/jpeg", 0.9);
      extractedPages.push(buildInitialPage(imageUrl, i));
    }
    setPages(extractedPages);
  };

// Re-usable extraction logic
const extractFromBlob = async (blob) => {
  const data = await blob.arrayBuffer();
  await extractFromArrayBuffer(data);
};

  // useEffect(() => {
  //   const extractPages = async () => {
  //     if (!file) {
  //       return;
  //     }

  //     clearObjectUrls();
  //     setError("");
  //     setPages([]);
  //     setActivePageIndex(0);
  //     setMainTitle(file.name.replace(/\.[^/.]+$/, ""));
  //     setIsExtracting(true);

  //     try {
  //       const fileNameLower = file.name.toLowerCase();
  //       const isPdf =
  //         file.type === "application/pdf" || fileNameLower.endsWith(".pdf");

  //       if (isPdf) {
  //         const pdfjsLib = await import("pdfjs-dist");
  //         const pdfWorkerSrc = (
  //           await import("pdfjs-dist/build/pdf.worker.min.mjs?url")
  //         ).default;
  //         pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

  //         const data = await file.arrayBuffer();
  //         const pdfDocument = await pdfjsLib.getDocument({ data }).promise;
  //         const extractedPages = [];

  //         for (
  //           let pageIndex = 1;
  //           pageIndex <= pdfDocument.numPages;
  //           pageIndex += 1
  //         ) {
  //           const page = await pdfDocument.getPage(pageIndex);
  //           const viewport = page.getViewport({ scale: 1.3 });
  //           const canvas = document.createElement("canvas");
  //           const context = canvas.getContext("2d");
  //           if (!context) {
  //             throw new Error("Failed to initialize canvas rendering context.");
  //           }

  //           canvas.width = Math.floor(viewport.width);
  //           canvas.height = Math.floor(viewport.height);

  //           await page.render({
  //             canvasContext: context,
  //             viewport,
  //           }).promise;

  //           const imageUrl = canvas.toDataURL("image/jpeg", 0.9);
  //           extractedPages.push(buildInitialPage(imageUrl, pageIndex));
  //         }

  //         setPages(extractedPages);
  //         return;
  //       }

  //       if (file.type.startsWith("image/")) {
  //         const imageUrl = URL.createObjectURL(file);
  //         createdObjectUrlsRef.current.push(imageUrl);
  //         setPages([buildInitialPage(imageUrl, 1)]);
  //         return;
  //       }

  //       setError(
  //         "Unsupported file format. Please upload PDF, PNG, JPG, or JPEG.",
  //       );
  //     } catch (extractError) {
  //       setError(
  //         extractError.message || "Failed to process the uploaded file.",
  //       );
  //     } finally {
  //       setIsExtracting(false);
  //     }
  //   };

  //   extractPages();
  // }, [file]);

  const pageCounter = useMemo(() => {
    if (!pages.length) {
      return "PAGE 0 / 0";
    }
    return `PAGE ${activePageIndex + 1} / ${pages.length}`;
  }, [activePageIndex, pages.length]);

  const handlePageFieldChange = (field, value) => {
    setPages((prevPages) =>
      prevPages.map((page, index) =>
        index === activePageIndex ? { ...page, [field]: value } : page,
      ),
    );
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleWatermarkLogoChange = async (event) => {
    const logoFile = event.target.files?.[0] || null;
    if (!logoFile) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(logoFile);
      const objectUrl = URL.createObjectURL(logoFile);

      if (watermarkObjectUrlRef.current) {
        URL.revokeObjectURL(watermarkObjectUrlRef.current);
      }

      watermarkObjectUrlRef.current = objectUrl;
      setWatermarkLogoPreviewUrl(objectUrl);
      setWatermarkLogoDataUrl(dataUrl);
      setWatermarkLogoName(logoFile.name);
      setError("");
    } catch (logoError) {
      setError(logoError.message || "Failed to load watermark logo.");
    }
  };

  const handleClearWatermark = () => {
    if (watermarkObjectUrlRef.current) {
      URL.revokeObjectURL(watermarkObjectUrlRef.current);
      watermarkObjectUrlRef.current = null;
    }

    setWatermarkLogoPreviewUrl("");
    setWatermarkLogoDataUrl("");
    setWatermarkLogoName("");
  };

  const updateWatermarkPositionFromPointer = (event) => {
    const previewElement = previewRef.current;
    if (!previewElement) {
      return;
    }

    const rect = previewElement.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const relativeX = ((event.clientX - rect.left) / rect.width) * 100;
    const relativeY = ((event.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.min(100, Math.max(0, relativeX));
    const clampedY = Math.min(100, Math.max(0, relativeY));

    setWatermarkXPercent(Math.round(clampedX));
    setWatermarkYPercent(Math.round(clampedY));
  };

  const handleWatermarkPointerDown = (event) => {
    if (!watermarkLogoPreviewUrl) {
      return;
    }

    event.preventDefault();
    setIsDraggingWatermark(true);
    updateWatermarkPositionFromPointer(event);
  };

  const handlePreviewPointerMove = (event) => {
    if (!isDraggingWatermark || !watermarkLogoPreviewUrl) {
      return;
    }
    updateWatermarkPositionFromPointer(event);
  };

  const stopWatermarkDragging = () => {
    setIsDraggingWatermark(false);
  };

  const handleSubmit = async () => {
    if (!pages.length || isExtracting || isSubmitting) return;

  setIsSubmitting(true);
  setError("");

  try {
    const processedPages = await Promise.all(
      pages.map(async (page) => {
        const finalImageData = await burnWatermarkToCanvas(
          page.imageUrl,
          watermarkLogoDataUrl ? {
            logoData: watermarkLogoDataUrl,
            opacity: watermarkOpacity,
            widthPercent: watermarkWidthPercent,
            position: { xPercent: watermarkXPercent, yPercent: watermarkYPercent },
          } : null
        );

        return {
          pageNumber: page.pageNumber,
          pageTitle: page.pageTitle,
          description: page.description,
          imageData: page.imageUrl,
          isActive: index === activePageIndex,
        })),
      };

      // Ready for API integration.
      console.log("Document payload", payload);
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Failed to submit document.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!id) {
    return (
      <Page>
        <Card>
          <BackButton type="button" onClick={handleCancel}>
            <ArrowLeft size={16} />
            Back
          </BackButton>
          <Title>No Uploaded File Found</Title>
          <Subtitle>
            Please upload a file first and then click Proceed.
          </Subtitle>
          <ActionRow>
            <CancelButton type="button" onClick={handleCancel}>
              Back To Upload
            </CancelButton>
          </ActionRow>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <Card>
        <MainTitleField
          id="main-title"
          value={mainTitle}
          onChange={(event) => setMainTitle(event.target.value)}
          placeholder="Main Title (Input field)"
        />

        <Preview
          ref={previewRef}
          onPointerMove={handlePreviewPointerMove}
          onPointerUp={stopWatermarkDragging}
          onPointerLeave={stopWatermarkDragging}
        >
          {isExtracting ? (
            <EmptyState>
              <Loader2 size={22} />
              Extracting PDF pages...
            </EmptyState>
          ) : activePage ? (
            <>
              <PreviewImage
                src={activePage.imageUrl}
                alt={`Page ${activePage.pageNumber}`}
              />
              {watermarkLogoPreviewUrl && (
                <WatermarkOverlay
                  src={watermarkLogoPreviewUrl}
                  alt="Watermark logo"
                  draggable={false}
                  onDragStart={(event) => event.preventDefault()}
                  onPointerDown={handleWatermarkPointerDown}
                  style={{
                    left: `${watermarkXPercent}%`,
                    top: `${watermarkYPercent}%`,
                    opacity: watermarkOpacity,
                    width: `${watermarkWidthPercent}%`,
                    transform: "translate(-50%, -50%)",
                    cursor: isDraggingWatermark ? "grabbing" : "grab",
                  }}
                />
              )}
            </>
          ) : (
            <EmptyState>No page preview available.</EmptyState>
          )}
        </Preview>

        <WatermarkPanel>
          <WatermarkHeader>
            <Title>Watermark</Title>
            {watermarkLogoName && (
              <WatermarkMeta>Selected: {watermarkLogoName}</WatermarkMeta>
            )}
          </WatermarkHeader>

          <WatermarkActions>
            <WatermarkButton as="label" htmlFor="watermark-upload">
              Upload Logo
            </WatermarkButton>
            <WatermarkInput
              id="watermark-upload"
              type="file"
              accept=".png,.jpg,.jpeg,.svg,.webp"
              onChange={handleWatermarkLogoChange}
            />
            {watermarkLogoPreviewUrl && (
              <WatermarkButton type="button" onClick={handleClearWatermark}>
                Remove Logo
              </WatermarkButton>
            )}
          </WatermarkActions>

          <WatermarkControls>
            <RangeGroup>
              Opacity{" "}
              <RangeValue>{Math.round(watermarkOpacity * 100)}%</RangeValue>
              <RangeInput
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={watermarkOpacity}
                onChange={(event) =>
                  setWatermarkOpacity(Number(event.target.value))
                }
                disabled={!watermarkLogoPreviewUrl}
              />
            </RangeGroup>

            <RangeGroup>
              Size <RangeValue>{watermarkWidthPercent}%</RangeValue>
              <RangeInput
                type="range"
                min="10"
                max="80"
                step="1"
                value={watermarkWidthPercent}
                onChange={(event) =>
                  setWatermarkWidthPercent(Number(event.target.value))
                }
                disabled={!watermarkLogoPreviewUrl}
              />
            </RangeGroup>
          </WatermarkControls>
        </WatermarkPanel>

        <FormRow>
          <Input
            id="page-title"
            value={activePage?.pageTitle || ""}
            onChange={(event) =>
              handlePageFieldChange("pageTitle", event.target.value)
            }
            placeholder="Page Title (Input field)"
            disabled={!activePage}
          />
          <DescriptionField
            id="description"
            value={activePage?.description || ""}
            onChange={(event) =>
              handlePageFieldChange("description", event.target.value)
            }
            placeholder="Description (TextArea)"
            disabled={!activePage}
          />
        </FormRow>

        <ThumbnailsRow>
          {pages.map((pageItem, index) => (
            <Thumbnail
              key={`${pageItem.pageNumber}-${index}`}
              type="button"
              onClick={() => setActivePageIndex(index)}
              $active={index === activePageIndex}
            >
              <ThumbnailImage
                src={pageItem.imageUrl}
                alt={`Thumbnail page ${pageItem.pageNumber}`}
              />
              <span>{pageItem.pageNumber}</span>
            </Thumbnail>
          ))}
        </ThumbnailsRow>

        <FooterActions>
          <CancelButton type="button" onClick={handleCancel}>
            Cancel
          </CancelButton>
          <SubmitButton
            type="button"
            disabled={isExtracting || isSubmitting || !pages.length}
            onClick={handleSubmit}
          >
            {isSubmitting ? <Loader2 size={16} /> : <Check size={16} />}
            {isSubmitting ? "Submitting..." : "Submit"}
          </SubmitButton>
        </FooterActions>

        {error && <Subtitle>{error}</Subtitle>}
        {!error && <Subtitle>{pageCounter}</Subtitle>}
      </Card>
    </Page>
  );
};

export default DocumentEditor;
