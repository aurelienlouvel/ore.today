"use client";

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/assets/logo";

export default function PDFViewerPage() {
  const [language, setLanguage] = useState("en");
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Suivre la taille de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initialiser la taille
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculer l'échelle optimale en fonction de la taille de l'écran
  const getOptimalScale = useCallback((pageViewport: any) => {
    if (!containerRef.current) return 1;

    const container = containerRef.current;
    const containerWidth = container.clientWidth - 32; // padding
    const containerHeight = container.clientHeight - 32;

    // Calculer les échelles pour ajuster à la largeur et hauteur
    const scaleX = containerWidth / pageViewport.width;
    const scaleY = containerHeight / pageViewport.height;

    // Utiliser la plus petite échelle pour que tout tienne dans le conteneur
    const optimalScale = Math.min(scaleX, scaleY);

    // Limiter l'échelle pour éviter des rendus trop petits ou trop grands
    return Math.max(0.5, Math.min(optimalScale, 3));
  }, []);

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
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement du PDF:", error);
      setIsLoading(false);
    }
  };

  const renderPage = useCallback(
    async (num: number, pdf: any = pdfDoc) => {
      if (!pdf || !canvasRef.current || !containerRef.current) return;

      const page = await pdf.getPage(num);

      // Obtenir le viewport initial avec scale 1
      const initialViewport = page.getViewport({ scale: 1 });

      // Calculer l'échelle optimale
      const scale = getOptimalScale(initialViewport);

      // Créer le viewport final avec l'échelle optimale
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Définir la taille du canvas
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Pour les écrans haute résolution (Retina, etc.)
      const devicePixelRatio = window.devicePixelRatio || 1;
      if (devicePixelRatio > 1) {
        canvas.width = viewport.width * devicePixelRatio;
        canvas.height = viewport.height * devicePixelRatio;
        canvas.style.width = viewport.width + "px";
        canvas.style.height = viewport.height + "px";
        context?.scale(devicePixelRatio, devicePixelRatio);
      }

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    },
    [pdfDoc, getOptimalScale],
  );

  // Re-render quand la taille de la fenêtre change ou que le PDF est chargé
  useEffect(() => {
    if (pdfDoc && !isLoading) {
      renderPage(1);
    }
  }, [pdfDoc, isLoading, renderPage, windowSize]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `/resume/aurelien-louvel-resume-${language}.pdf`;
    link.download = `aurelien-louvel-resume-${language}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Conteneur PDF principal */}
      <Tabs value={language} onValueChange={setLanguage} className="w-auto">
        <TabsContent value="en">
          <div className="pt-12 pb-24 px-4 md:px-6">
            <div
              ref={containerRef}
              className="mx-auto overflow-hidden h-[calc(100vh-12rem)] max-w-5xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  {/* Zone d'affichage du PDF */}
                  <div className="flex-1 overflow-auto flex justify-center items-center p-4">
                    <canvas
                      ref={canvasRef}
                      className="max-w-full max-h-full shadow-lg bg-white rounded-lg md:rounded-3xl border border-border"
                      style={{
                        // Assurer que le canvas respecte les contraintes max-width/max-height
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fr">
          <div className="flex flex-col items-center justify-center"></div>
        </TabsContent>

        {/* Barre de contrôles fixe en bas */}
        <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-background border border-border rounded-xl md:rounded-2xl shadow-lg h-[48px] md:h-[52px] px-2 flex items-center gap-2 md:gap-3">
            <div className="pl-1 md:pl-2 pr-1">
              <Logo className="w-8 h-8 md:w-10 md:h-10" />
            </div>

            <div className="h-3 md:h-4">
              <Separator orientation="vertical" />
            </div>

            <TabsList className="grid w-full grid-cols-2 h-8 md:h-10">
              <TabsTrigger value="en" className="text-xs md:text-sm">
                en
              </TabsTrigger>
              <TabsTrigger value="fr" className="text-xs md:text-sm">
                fr
              </TabsTrigger>
            </TabsList>

            <div className="h-3 md:h-4">
              <Separator orientation="vertical" />
            </div>

            <Button className="cursor-pointer " onClick={handleDownload}>
              download
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
