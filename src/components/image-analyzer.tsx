import { useState } from "react";
import { Button } from "./ui/button";
import { analyzeFoodImage } from "../lib/food-analysis/service";
import { FoodAnalysisResult } from "../lib/food-analysis/types";
import { Card } from "./ui/card";

export function ImageAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const analysisResult = await analyzeFoodImage(file);
      setResult(analysisResult);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze image");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 p-4">
      <div className="flex flex-col items-center gap-4">
        <Button asChild>
          <label className="cursor-pointer">
            Upload Food Image
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
            />
          </label>
        </Button>

        {loading && <p className="text-muted-foreground">Analyzing image...</p>}
        
        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {result && (
          <Card className="p-4 w-full">
            <h3 className="font-semibold mb-2">Analysis Result</h3>
            <div className="space-y-2">
              <p>
                Quality: <span className={
                  result.qualityState === "fresh" ? "text-green-500" :
                  result.qualityState === "close to expiry" ? "text-yellow-500" :
                  "text-red-500"
                }>{result.qualityState}</span>
              </p>
              <p>
                Predicted Expiry: <span className="font-medium">
                  {new Date(result.predictedExpiryDate).toLocaleDateString()}
                </span>
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
