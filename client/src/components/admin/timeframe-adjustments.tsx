import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Check, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimeframeAdjustment {
  id?: number; // Optional ahora ya que podríamos no tenerlo
  timeframe: number;
  adjustmentPercentage: number;
  updatedBy?: string; // Optional porque puede no estar en el nuevo formato
  updatedAt?: string; // Optional porque puede no estar en el nuevo formato
}

const TimeframeAdjustments = () => {
  const { address } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [adjustments, setAdjustments] = useState<{[key: number]: number}>({});
  const [editedAdjustments, setEditedAdjustments] = useState<{[key: number]: number}>({});
  const [isEditing, setIsEditing] = useState<{[key: number]: boolean}>({});
  const [formattedAdjustments, setFormattedAdjustments] = useState<TimeframeAdjustment[]>([]);

  // Obtener los ajustes actuales
  const { data: timeframeAdjustmentsData, refetch } = useQuery<Record<string, number>>({
    queryKey: ['/api/timeframe-adjustments'],
    queryFn: async () => {
      try {
        const data = await apiRequest('GET', '/api/timeframe-adjustments');
        console.log("Datos de ajustes recibidos:", data);
        return data || {};
      } catch (error) {
        console.error("Error loading adjustments:", error);
        return {};
      }
    },
  });

  // Convertir el objeto de ajustes al formato requerido para la interfaz
  useEffect(() => {
    if (timeframeAdjustmentsData && typeof timeframeAdjustmentsData === 'object') {
      try {
        const formattedData: TimeframeAdjustment[] = Object.entries(timeframeAdjustmentsData).map(([timeframe, value]) => ({
          timeframe: parseInt(timeframe),
          adjustmentPercentage: typeof value === 'number' ? value : parseFloat(String(value)),
          // Estos valores no los tenemos en el formato actual, así que los generamos
          updatedBy: address || 'Unknown',
          updatedAt: new Date().toISOString()
        }));
        
        console.log("Datos formateados:", formattedData);
        setFormattedAdjustments(formattedData);
        
        // También actualizamos el estado de los ajustes
        const adjustmentsMap: {[key: number]: number} = {};
        const editingMap: {[key: number]: boolean} = {};
        
        formattedData.forEach(adjustment => {
          adjustmentsMap[adjustment.timeframe] = adjustment.adjustmentPercentage;
          editingMap[adjustment.timeframe] = false;
        });
        
        setAdjustments(adjustmentsMap);
        setEditedAdjustments(adjustmentsMap);
        setIsEditing(editingMap);
      } catch (error) {
        console.error("Error al formatear datos de ajustes:", error);
      }
    }
  }, [timeframeAdjustmentsData, address]);

  // Mutación para actualizar un ajuste
  const updateAdjustmentMutation = useMutation({
    mutationFn: async ({ timeframe, adjustmentPercentage }: { timeframe: number, adjustmentPercentage: number }) => {
      return await apiRequest('PUT', `/api/admin/timeframe-adjustments/${timeframe}`, { adjustmentPercentage }, {
        headers: {
          'x-wallet-address': address || '',
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/timeframe-adjustments'] });
      toast({
        title: "Ajuste actualizado",
        description: "El ajuste de timeframe ha sido actualizado correctamente",
      });
    },
    onError: (error) => {
      console.error("Error al actualizar ajuste:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el ajuste. Verifica que tienes permisos de administrador.",
        variant: "destructive",
      });
    },
  });

  // Handle changes with slider
  const handleSliderChange = (timeframe: number, value: number[]) => {
    setEditedAdjustments(prev => ({
      ...prev,
      [timeframe]: value[0],
    }));
  };

  // Handle changes with input
  const handleInputChange = (timeframe: number, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setEditedAdjustments(prev => ({
        ...prev,
        [timeframe]: numValue,
      }));
    }
  };

  // Start editing an adjustment
  const startEditing = (timeframe: number) => {
    setIsEditing(prev => ({
      ...prev,
      [timeframe]: true,
    }));
  };

  // Cancel editing
  const cancelEditing = (timeframe: number) => {
    setIsEditing(prev => ({
      ...prev,
      [timeframe]: false,
    }));
    setEditedAdjustments(prev => ({
      ...prev,
      [timeframe]: adjustments[timeframe],
    }));
  };

  // Save an adjustment
  const saveAdjustment = async (timeframe: number) => {
    try {
      await updateAdjustmentMutation.mutateAsync({
        timeframe,
        adjustmentPercentage: editedAdjustments[timeframe],
      });
      
      setAdjustments(prev => ({
        ...prev,
        [timeframe]: editedAdjustments[timeframe],
      }));
      
      setIsEditing(prev => ({
        ...prev,
        [timeframe]: false,
      }));
    } catch (error) {
      console.error("Error saving adjustment:", error);
    }
  };

  // Refresh data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      await refetch();
      toast({
        title: "Data updated",
        description: "Timeframe adjustments have been updated",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Error",
        description: "Could not update adjustments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render message for each timeframe
  const getTimeframeDisplay = (timeframe: number) => {
    switch (timeframe) {
      case 30:
        return "1 month";
      case 90:
        return "3 months";
      case 365:
        return "1 year";
      default:
        return `${timeframe} days`;
    }
  };

  // Determine percentage color (positive or negative)
  const getPercentageColor = (value: number) => {
    if (value > 0) return "text-green-500";
    if (value < 0) return "text-red-500";
    return "text-slate-500";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Timeframe Adjustments</CardTitle>
            <CardDescription>
              Configure percentage adjustments for different time periods
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        ) : formattedAdjustments.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No timeframe adjustments configured.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timeframe</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Percentage Adjustment
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-2 opacity-70" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Percentage adjustments are applied to the base APR of the position.
                            A negative value reduces the APR (conservative estimate),
                            a positive value increases it (optimistic estimate).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formattedAdjustments.map((adjustment) => (
                <TableRow key={adjustment.timeframe}>
                  <TableCell>
                    <Badge variant="outline" className="font-semibold">
                      {getTimeframeDisplay(adjustment.timeframe)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isEditing[adjustment.timeframe] ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editedAdjustments[adjustment.timeframe]}
                            onChange={(e) => handleInputChange(adjustment.timeframe, e.target.value)}
                            className="w-24"
                            step="0.01"
                          />
                          <span>%</span>
                        </div>
                        <Slider
                          value={[editedAdjustments[adjustment.timeframe]]}
                          min={-50}
                          max={50}
                          step={0.01}
                          onValueChange={(value) => handleSliderChange(adjustment.timeframe, value)}
                        />
                        <div className="flex justify-between text-xs">
                          <span>-50%</span>
                          <span>0%</span>
                          <span>+50%</span>
                        </div>
                      </div>
                    ) : (
                      <span className={getPercentageColor(adjustment.adjustmentPercentage)}>
                        {adjustment.adjustmentPercentage > 0 ? "+" : ""}
                        {Number(adjustment.adjustmentPercentage).toFixed(2)}%
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-500">
                      {adjustment.updatedAt ? formatDate(adjustment.updatedAt) : "N/A"}
                    </div>
                    <div className="text-xs">
                      {adjustment.updatedBy ? 
                        `By: ${adjustment.updatedBy.slice(0, 6)}...${adjustment.updatedBy.slice(-4)}` : 
                        "System"
                      }
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing[adjustment.timeframe] ? (
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => cancelEditing(adjustment.timeframe)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => saveAdjustment(adjustment.timeframe)}
                          disabled={updateAdjustmentMutation.isPending}
                        >
                          {updateAdjustmentMutation.isPending ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4 mr-2" />
                          )}
                          Save
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => startEditing(adjustment.timeframe)}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-sm text-slate-500">
          <p>
            These adjustments affect APR estimates in the rewards simulator.
            Negative values represent a conservative estimate, while positive values represent an optimistic estimate.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TimeframeAdjustments;