import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "lucide-react";

export default function AprPenaltySimulator() {
  const [currentApr, setCurrentApr] = useState<number>(85);
  const penaltyAmount = 7.73; // 7.73% penalización fija
  const minAprForPenalty = 30; // APR mínimo para aplicar penalización

  const calculatePenalty = () => {
    if (currentApr <= minAprForPenalty) {
      return {
        penaltyApplied: false,
        aprAfter: currentApr,
        penaltyAmount: 0,
        reason: "APR ≤ 30% - Sin penalización"
      };
    }

    const aprAfter = Math.max(currentApr - penaltyAmount, minAprForPenalty);
    const actualPenalty = currentApr - aprAfter;

    return {
      penaltyApplied: true,
      aprAfter,
      penaltyAmount: actualPenalty,
      reason: actualPenalty < penaltyAmount ? 
        `Limitado al mínimo de 30% APR` : 
        `Penalización completa por pérdida de interés compuesto`
    };
  };

  const result = calculatePenalty();

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Simulador de Penalización APR
        </CardTitle>
        <CardDescription className="text-blue-200">
          Simula el impacto de retiros en el APR por pérdida de interés compuesto
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Input APR */}
          <div className="space-y-2">
            <Label htmlFor="apr-input">APR Actual de la Pool (%)</Label>
            <Input
              id="apr-input"
              type="number"
              value={currentApr}
              onChange={(e) => setCurrentApr(parseFloat(e.target.value) || 0)}
              min="0"
              max="200"
              step="0.1"
              className="text-lg font-mono"
            />
          </div>

          {/* Reglas */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">Reglas de Penalización</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Penalización: <strong>7.73%</strong> por pérdida de interés compuesto</li>
              <li>• Solo aplica si APR <strong>&gt; 30%</strong></li>
              <li>• APR mínimo garantizado: <strong>30%</strong></li>
            </ul>
          </div>

          {/* Resultado */}
          <div className="bg-slate-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Resultado del Retiro</h4>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-sm text-gray-600">APR Antes</Label>
                <p className="text-2xl font-bold text-blue-800">{currentApr.toFixed(2)}%</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">APR Después</Label>
                <p className={`text-2xl font-bold ${result.penaltyApplied ? 'text-red-600' : 'text-green-600'}`}>
                  {result.aprAfter.toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {result.penaltyApplied ? (
                <>
                  <Badge variant="destructive" className="mb-2">
                    Penalización Aplicada: -{result.penaltyAmount.toFixed(2)}%
                  </Badge>
                  <p className="text-sm text-orange-700 font-medium">
                    {result.reason}
                  </p>
                </>
              ) : (
                <>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300 mb-2">
                    Sin Penalización
                  </Badge>
                  <p className="text-sm text-green-700 font-medium">
                    {result.reason}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Ejemplos */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold mb-2 text-yellow-800">Ejemplos</h4>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>85% APR → </span>
                <span className="font-mono text-red-600">77.27% APR (-7.73%)</span>
              </div>
              <div className="flex justify-between">
                <span>35% APR → </span>
                <span className="font-mono text-red-600">30.00% APR (-5.00%)</span>
              </div>
              <div className="flex justify-between">
                <span>25% APR → </span>
                <span className="font-mono text-green-600">25.00% APR (sin cambio)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}