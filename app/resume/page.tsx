"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/assets/logo";

export default function PDFViewerPage() {
  const [language, setLanguage] = useState("en");
  const [pdfDoc, setPdfDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef(null);

  // Charger PDF.js et le document PDF
  useEffect(() => {
    const loadPDFJS = async () => {
      if (typeof window !== "undefined" && !window.pdfjsLib) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          loadPDF();
        };
        document.head.appendChild(script);
      } else if (window.pdfjsLib) {
        loadPDF();
      }
    };

    loadPDFJS();
  }, [language]);

  const loadPDF = async () => {
    setIsLoading(true);
    try {
      const pdfUrl = `/resume/aurelien-louvel-resume-${language}.pdf`;
      const pdf = await window.pdfjsLib.getDocument(pdfUrl).promise;
      setPdfDoc(pdf);
      renderPage(1, pdf);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement du PDF:", error);
      setIsLoading(false);
    }
  };

  const renderPage = async (num, pdf = pdfDoc) => {
    if (!pdf || !canvasRef.current) return;

    const page = await pdf.getPage(num);
    const viewport = page.getViewport({ scale: 6 });
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
  };

  useEffect(() => {
    if (pdfDoc && !isLoading) {
      renderPage(1);
    }
  }, [pdfDoc, isLoading]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `/resume/aurelien-louvel-resume-${language}.pdf`;
    link.download = `aurelien-louvel-resume-${language}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const availableHeight = "calc(120vh)";

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Conteneur PDF principal */}
      <div className="pt-12 pb-24 px-6">
        <div
          className="mx-auto overflow-hidden"
          style={{ height: availableHeight, maxWidth: "1200px" }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Zone d'affichage du PDF */}
              <div className="flex-1 overflow-auto flex justify-center p-4">
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full shadow-lg bg-white rounded-3xl border-border"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-background border border-border rounded-2xl shadow-lg h-[52px] px-2 flex items-center gap-3">
          <div className="pl-2 pr-1">
            <Logo className="w-10 h-10" />
          </div>

          <div className="h-4">
            <Separator orientation="vertical" />
          </div>

          <Tabs value={language} onValueChange={setLanguage} className="w-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="en">en</TabsTrigger>
              <TabsTrigger value="fr">fr</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="h-4">
            <Separator orientation="vertical" />
          </div>

          <Button className="cursor-pointer" onClick={handleDownload}>
            download
          </Button>
        </div>
      </div>
    </div>
  );
}
