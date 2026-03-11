import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { finalizeFileApi, getFileByIdApi } from "../../services/apiClient";
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

const OUTPUT_IMAGE_QUALITY = 0.8;

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
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const baseImg = new Image();
    if (!ctx) return reject(new Error("Failed to initialize canvas."));
    const logoImg = watermark ? new Image() : null;

    baseImg.onload = () => {
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;
      ctx.drawImage(baseImg, 0, 0);
      if (!watermark || !logoImg) {
        return resolve(canvas.toDataURL("image/jpeg", OUTPUT_IMAGE_QUALITY));
      }
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
        resolve(canvas.toDataURL("image/jpeg", OUTPUT_IMAGE_QUALITY));
      };
      logoImg.src = watermark.logoData;
    };
    baseImg.src = baseImageUrl;
  });
};

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fileFromState = location.state?.uploadedFile || null;
  
  const createdObjectUrlsRef = useRef([]);
  const watermarkObjectUrlRef = useRef(null);
  const previewRef = useRef(null);

  const [mainTitle, setMainTitle] = useState("");
  const [pages, setPages] = useState([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState("");

  const [watermarkLogoPreviewUrl, setWatermarkLogoPreviewUrl] = useState("");
  const [watermarkLogoDataUrl, setWatermarkLogoDataUrl] = useState("");
  const [watermarkLogoName, setWatermarkLogoName] = useState("");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.35);
  const [watermarkWidthPercent, setWatermarkWidthPercent] = useState(28);
  const [watermarkXPercent, setWatermarkXPercent] = useState(50);
  const [watermarkYPercent, setWatermarkYPercent] = useState(50);
  const [isDraggingWatermark, setIsDraggingWatermark] = useState(false);

  const { data: apiData, isLoading: isFetching } = useQuery({
    queryKey: ["document-data", id],
    queryFn: () => getFileByIdApi(id),
    enabled: !!id && !fileFromState,
    staleTime: Infinity,
  });

  useEffect(() => {
    const loadAndExtract = async () => {
      if (fileFromState) {
        await processLocalFile(fileFromState);
      } else if (apiData) {
        await processRemoteData(apiData);
      }
    };
    loadAndExtract();
    return () => {
      createdObjectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      if (watermarkObjectUrlRef.current) URL.revokeObjectURL(watermarkObjectUrlRef.current);
    };
  }, [fileFromState, apiData]);

  const processLocalFile = async (file) => {
    setIsExtracting(true);
    try {
      setMainTitle((file.name || "Untitled").replace(/\.[^/.]+$/, ""));
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (isPdf) {
        const arrayBuffer = await file.arrayBuffer();
        await extractFromArrayBuffer(arrayBuffer);
      } else {
        const imageUrl = URL.createObjectURL(file);
        createdObjectUrlsRef.current.push(imageUrl);
        setPages([buildInitialPage(imageUrl, 1)]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const processRemoteData = async (data) => {
    setIsExtracting(true);
    try {
      const fileName = data.originalFileName || data.title || "Untitled";
      const pdfUrl = data.pdfUrl || data.originalPdf;
      setMainTitle(fileName.replace(/\.[^/.]+$/, ""));
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Failed to fetch PDF content");
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      await extractFromArrayBuffer(arrayBuffer);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const extractFromArrayBuffer = async (arrayBuffer) => {
    const pdfjsLib = await import("pdfjs-dist");
    const pdfWorkerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;
    const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const extractedPages = [];
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      await page.render({ canvasContext: context, viewport }).promise;
      extractedPages.push(buildInitialPage(canvas.toDataURL("image/jpeg", OUTPUT_IMAGE_QUALITY), i));
    }
    setPages(extractedPages);
  };

  const updateWatermarkPositionFromPointer = (event) => {
    const previewElement = previewRef.current;
    if (!previewElement) return;

    const rect = previewElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const relativeX = ((event.clientX - rect.left) / rect.width) * 100;
    const relativeY = ((event.clientY - rect.top) / rect.height) * 100;
    
    setWatermarkXPercent(Math.round(Math.min(100, Math.max(0, relativeX))));
    setWatermarkYPercent(Math.round(Math.min(100, Math.max(0, relativeY))));
  };

  const handlePreviewPointerMove = (event) => {
    if (isDraggingWatermark && watermarkLogoPreviewUrl) {
      updateWatermarkPositionFromPointer(event);
    }
  };

  const finalizeMutation = useMutation({
    mutationFn: finalizeFileApi,
    onSuccess: () => {
      toast.success("Document submitted successfully.");
      navigate("/", { replace: true });
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = async () => {
    if (!pages.length || isExtracting || finalizeMutation.isPending) return;
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
          return { ...page, imageData: finalImageData };
        })
      );
      finalizeMutation.mutate({ fileId: id, mainTitle, pages: processedPages });
    } catch (err) {
      toast.error("Submit failed: " + err.message);
    }
  };

  const handlePageFieldChange = (field, value) => {
    setPages(prev => prev.map((p, i) => i === activePageIndex ? { ...p, [field]: value } : p));
  };

  const activePage = pages[activePageIndex] || null;

  return (
    <Page>
      <Card>
        <MainTitleField
          value={mainTitle}
          onChange={(e) => setMainTitle(e.target.value)}
          placeholder="Main Title"
        />

        <Preview 
          ref={previewRef}
          onPointerMove={handlePreviewPointerMove}
          onPointerUp={() => setIsDraggingWatermark(false)}
          onPointerLeave={() => setIsDraggingWatermark(false)}
        >
          {(isFetching || isExtracting) ? (
            <EmptyState><Loader2 size={22} className="animate-spin" /> Processing...</EmptyState>
          ) : activePage ? (
            <>
              <PreviewImage src={activePage.imageUrl} alt="Preview" />
              {watermarkLogoPreviewUrl && (
                <WatermarkOverlay
                  src={watermarkLogoPreviewUrl}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setIsDraggingWatermark(true);
                    updateWatermarkPositionFromPointer(e);
                  }}
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
          ) : <EmptyState>No page preview available.</EmptyState>}
        </Preview>

        <WatermarkPanel>
          <Title>Watermark</Title>
          <WatermarkActions>
            <WatermarkButton as="label" htmlFor="w-upload">Upload Logo</WatermarkButton>
            <WatermarkInput id="w-upload" type="file" accept="image/*" onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) {
                if (!f.type.startsWith("image/")) {
                  toast.error("Please upload an image file for watermark.");
                  e.target.value = "";
                  return;
                }
                if (watermarkObjectUrlRef.current) {
                  URL.revokeObjectURL(watermarkObjectUrlRef.current);
                }
                const objectUrl = URL.createObjectURL(f);
                watermarkObjectUrlRef.current = objectUrl;
                setWatermarkLogoDataUrl(await readFileAsDataUrl(f));
                setWatermarkLogoPreviewUrl(objectUrl);
                setWatermarkLogoName(f.name);
              }
            }} />
            {watermarkLogoName && <WatermarkMeta>{watermarkLogoName}</WatermarkMeta>}
            {watermarkLogoPreviewUrl && (
              <WatermarkButton type="button" onClick={() => {
                if (watermarkObjectUrlRef.current) {
                  URL.revokeObjectURL(watermarkObjectUrlRef.current);
                  watermarkObjectUrlRef.current = null;
                }
                setWatermarkLogoPreviewUrl("");
                setWatermarkLogoDataUrl("");
                setWatermarkLogoName("");
              }}>Remove</WatermarkButton>
            )}
          </WatermarkActions>
          <WatermarkControls>
          <RangeGroup>Opacity <RangeValue>{Math.round(watermarkOpacity * 100)}%</RangeValue>
            <RangeInput type="range" min="0.1" max="1" step="0.05" value={watermarkOpacity} onChange={e => setWatermarkOpacity(Number(e.target.value))} /></RangeGroup>
          <RangeGroup>Size <RangeValue>{watermarkWidthPercent}%</RangeValue>            
            <RangeInput type="range" min="10" max="80" value={watermarkWidthPercent} onChange={e => setWatermarkWidthPercent(Number(e.target.value))} /></RangeGroup>
        </WatermarkControls>
        </WatermarkPanel>

        <FormRow>
          <Input value={activePage?.pageTitle || ""} onChange={e => handlePageFieldChange("pageTitle", e.target.value)} placeholder="Page Title" />
          <DescriptionField value={activePage?.description || ""} onChange={e => handlePageFieldChange("description", e.target.value)} placeholder="Description" />
        </FormRow>

        <ThumbnailsRow>
          {pages.map((p, i) => (
            <Thumbnail key={i} onClick={() => setActivePageIndex(i)} $active={i === activePageIndex}>
              <ThumbnailImage src={p.imageUrl} />
              <span>{p.pageNumber}</span>
            </Thumbnail>
          ))}
        </ThumbnailsRow>

        <FooterActions>
          <CancelButton onClick={() => navigate(-1)}>Cancel</CancelButton>
          <SubmitButton 
            disabled={isFetching || isExtracting || finalizeMutation.isPending} 
            onClick={handleSubmit}
          >
            {finalizeMutation.isPending ? "Submitting..." : "Submit"}
          </SubmitButton>
        </FooterActions>
        {error && <Subtitle style={{ color: "red" }}>{error}</Subtitle>}
      </Card>
    </Page>
  );
};

export default DocumentEditor;
