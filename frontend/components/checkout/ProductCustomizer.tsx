"use client";

import { useState } from "react";
import { Download, Printer, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type LicenseType = "personal" | "commercial" | "exclusive";
export type PaperFinish = "hahnemuhle" | "metallic" | "velvet";

interface ProductCustomizerProps {
  photoTitle?: string;
  basePrice: number;
  onSelectOption?: (details: {
    type: "digital" | "print";
    license?: LicenseType;
    size?: string;
    finish?: PaperFinish;
    totalPrice: number;
  }) => void;
}

const DIGITAL_LICENSES = [
  { id: "personal", name: "Personal Use", multiplier: 1, desc: "For screens, personal wall displays, and non-profit use" },
  { id: "commercial", name: "Commercial License", multiplier: 2.5, desc: "For websites, marketing campaigns, and print media" },
  { id: "exclusive", name: "Full Exclusive Rights", multiplier: 6.0, desc: "1 of 1 unique ownership and commercial distribution" },
];

const PRINT_SIZES = [
  { id: "12x18", label: '12" × 18"', multiplier: 1.5 },
  { id: "24x36", label: '24" × 36"', multiplier: 2.8 },
  { id: "40x60", label: '40" × 60"', multiplier: 4.5 },
];

const PAPER_FINISHES = [
  { id: "hahnemuhle", name: "Hahnemühle Photo Rag", desc: "100% cotton museum grade textured archival paper" },
  { id: "metallic", name: "Metallic Glossy Print", desc: "Ultra-vibrant high gloss with three-dimensional depth" },
  { id: "velvet", name: "Somerset Velvet Fine Art", desc: "Soft matte finish for dramatic contrast and deep blacks" },
];

export function ProductCustomizer({ basePrice, onSelectOption }: ProductCustomizerProps) {
  const [productType, setProductType] = useState<"digital" | "print">("digital");
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>("personal");
  const [selectedSize, setSelectedSize] = useState(PRINT_SIZES[0]);
  const [selectedFinish, setSelectedFinish] = useState<PaperFinish>("hahnemuhle");

  const calculatePrice = () => {
    if (productType === "digital") {
      const lic = DIGITAL_LICENSES.find((l) => l.id === selectedLicense);
      return Math.round(basePrice * (lic?.multiplier || 1));
    } else {
      return Math.round(basePrice * selectedSize.multiplier * 1.2);
    }
  };

  const totalPrice = calculatePrice();

  return (
    <div className="p-6 rounded-3xl bg-card border border-border/60 glass-panel space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div>
          <h3 className="font-heading font-bold text-xl">Fulfillment Customizer</h3>
          <p className="text-xs text-muted-foreground">Select digital download license or museum fine-art print</p>
        </div>
        <Badge className="bg-amber-500 text-black font-bold">
          ${totalPrice} USD
        </Badge>
      </div>

      {/* Switcher: Digital vs Physical Print */}
      <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-muted/40 border border-border/40">
        <button
          onClick={() => setProductType("digital")}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition-all ${
            productType === "digital"
              ? "bg-amber-500 text-black shadow-md font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Download className="h-4 w-4" />
          <span>Digital Download</span>
        </button>
        <button
          onClick={() => setProductType("print")}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition-all ${
            productType === "print"
              ? "bg-amber-500 text-black shadow-md font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Printer className="h-4 w-4" />
          <span>Fine Art Print</span>
        </button>
      </div>

      {/* Digital License Selection */}
      {productType === "digital" ? (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            License Tier
          </label>
          <div className="space-y-2">
            {DIGITAL_LICENSES.map((lic) => (
              <div
                key={lic.id}
                onClick={() => setSelectedLicense(lic.id as LicenseType)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                  selectedLicense === lic.id
                    ? "border-amber-500 bg-amber-500/10 text-amber-500"
                    : "border-border/40 hover:bg-muted/30"
                }`}
              >
                <div>
                  <p className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    {lic.name}
                    {selectedLicense === lic.id && <Check className="h-4 w-4 text-amber-500" />}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{lic.desc}</p>
                </div>
                <span className="font-mono text-xs font-semibold">
                  ${Math.round(basePrice * lic.multiplier)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Physical Print Selection */
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Print Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRINT_SIZES.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedSize.id === size.id
                      ? "border-amber-500 bg-amber-500/10 text-amber-500 font-bold"
                      : "border-border/40 hover:bg-muted"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Paper Finish
            </label>
            <div className="space-y-2">
              {PAPER_FINISHES.map((finish) => (
                <div
                  key={finish.id}
                  onClick={() => setSelectedFinish(finish.id as PaperFinish)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedFinish === finish.id
                      ? "border-amber-500 bg-amber-500/10 text-amber-500"
                      : "border-border/40 hover:bg-muted/30"
                  }`}
                >
                  <p className="font-bold text-xs text-foreground flex items-center gap-1">
                    {finish.name}
                    {selectedFinish === finish.id && <Check className="h-3.5 w-3.5 text-amber-500" />}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{finish.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={() => {
          onSelectOption?.({
            type: productType,
            license: selectedLicense,
            size: selectedSize.label,
            finish: selectedFinish,
            totalPrice,
          });
        }}
        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-lg shadow-amber-500/20"
      >
        Confirm Selection (${totalPrice})
      </Button>
    </div>
  );
}
