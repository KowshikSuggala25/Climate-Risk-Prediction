import React from 'react';
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { useWeather } from "@/contexts/WeatherContext";
import { calculateFloodRisk, calculateHeatwaveRisk, calculateAirQualityRisk } from "@/utils/riskCalculations";
import { generateDynamicRecommendations } from "@/utils/dynamicRecommendations";
import { format } from "date-fns";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const PDFExport = () => {
  const { weatherData, airQualityData, currentLocation, loading } = useWeather();
  const [isExporting, setIsExporting] = React.useState(false);

  const generatePDF = async () => {
    if (!weatherData || !airQualityData || !currentLocation || loading) return;

    setIsExporting(true);
    
    try {
      // Create a temporary container for PDF content
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.background = 'white';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      
      // Calculate risks and recommendations
      const floodRisk = calculateFloodRisk(weatherData);
      const heatRisk = calculateHeatwaveRisk(weatherData);
      const airRisk = calculateAirQualityRisk(airQualityData);
      
      const recommendations = generateDynamicRecommendations(
        weatherData, 
        airQualityData, 
        currentLocation,
        floodRisk.level,
        heatRisk.level,
        airRisk.level
      );
      
      // Group recommendations by priority
      const highPriorityRecs = recommendations.filter(r => r.priority === 'high');
      const mediumPriorityRecs = recommendations.filter(r => r.priority === 'medium');
      const lowPriorityRecs = recommendations.filter(r => r.priority === 'low');
      
      tempContainer.innerHTML = `
        <div style="padding: 20px; color: #000;">
          <!-- Header with gradient background -->
          <div style="background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 30px; margin: -20px -20px 30px -20px; text-align: center; border-radius: 0 0 10px 10px;">
            <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Climate Risk Assessment</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Professional Weather Forecast Report</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">${format(new Date(), "EEEE, MMMM dd, yyyy 'at' HH:mm")}</p>
          </div>

          <!-- Location Information -->
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
            <h2 style="margin: 0 0 10px 0; color: #1e40af; font-size: 20px;">Location Details</h2>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Location:</strong> ${currentLocation.name}, ${currentLocation.country}</p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Coordinates:</strong> ${currentLocation.lat.toFixed(4)}°, ${currentLocation.lon.toFixed(4)}°</p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Report Generated:</strong> ${format(new Date(), "PPP 'at' p")}</p>
          </div>

          <!-- Current Weather Conditions -->
          <div style="background: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="margin: 0 0 15px 0; color: #1e40af; font-size: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">Current Weather Conditions</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <p style="margin: 8px 0; font-size: 16px;"><strong>Temperature:</strong> ${weatherData.temperature}°C</p>
                <p style="margin: 8px 0; font-size: 16px;"><strong>Humidity:</strong> ${weatherData.humidity}%</p>
                <p style="margin: 8px 0; font-size: 16px;"><strong>Wind Speed:</strong> ${weatherData.windSpeed} km/h</p>
              </div>
              <div>
                <p style="margin: 8px 0; font-size: 16px;"><strong>Conditions:</strong> ${weatherData.description}</p>
                <p style="margin: 8px 0; font-size: 16px;"><strong>Air Quality Index:</strong> ${airQualityData.aqi}/5</p>
                <p style="margin: 8px 0; font-size: 16px;"><strong>PM2.5:</strong> ${airQualityData.pm2_5} μg/m³</p>
              </div>
            </div>
          </div>

          <!-- Risk Assessment -->
          <div style="background: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="margin: 0 0 15px 0; color: #1e40af; font-size: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">Risk Assessment</h2>
            
            <div style="margin-bottom: 20px; padding: 15px; border-radius: 6px; background: ${floodRisk.level === 'critical' ? '#fee2e2' : floodRisk.level === 'high' ? '#fef3c7' : floodRisk.level === 'medium' ? '#fef3c7' : '#f0fdf4'};">
              <h3 style="margin: 0 0 8px 0; color: ${floodRisk.level === 'critical' ? '#dc2626' : floodRisk.level === 'high' ? '#d97706' : floodRisk.level === 'medium' ? '#d97706' : '#16a34a'}; font-size: 18px;">🌊 ${floodRisk.title}</h3>
              <p style="margin: 0; font-size: 14px; color: #374151;"><strong>Risk Level:</strong> ${floodRisk.level.toUpperCase()}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #374151;">${floodRisk.description}</p>
            </div>

            <div style="margin-bottom: 20px; padding: 15px; border-radius: 6px; background: ${heatRisk.level === 'critical' ? '#fee2e2' : heatRisk.level === 'high' ? '#fef3c7' : heatRisk.level === 'medium' ? '#fef3c7' : '#f0fdf4'};">
              <h3 style="margin: 0 0 8px 0; color: ${heatRisk.level === 'critical' ? '#dc2626' : heatRisk.level === 'high' ? '#d97706' : heatRisk.level === 'medium' ? '#d97706' : '#16a34a'}; font-size: 18px;">🌡️ ${heatRisk.title}</h3>
              <p style="margin: 0; font-size: 14px; color: #374151;"><strong>Risk Level:</strong> ${heatRisk.level.toUpperCase()}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #374151;">${heatRisk.description}</p>
            </div>

            <div style="margin-bottom: 0; padding: 15px; border-radius: 6px; background: ${airRisk.level === 'critical' ? '#fee2e2' : airRisk.level === 'high' ? '#fef3c7' : airRisk.level === 'medium' ? '#fef3c7' : '#f0fdf4'};">
              <h3 style="margin: 0 0 8px 0; color: ${airRisk.level === 'critical' ? '#dc2626' : airRisk.level === 'high' ? '#d97706' : airRisk.level === 'medium' ? '#d97706' : '#16a34a'}; font-size: 18px;">💨 ${airRisk.title}</h3>
              <p style="margin: 0; font-size: 14px; color: #374151;"><strong>Risk Level:</strong> ${airRisk.level.toUpperCase()}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #374151;">${airRisk.description}</p>
            </div>
          </div>

          <!-- Recommendations -->
          <div style="background: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="margin: 0 0 15px 0; color: #1e40af; font-size: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">Recommended Actions</h2>
            
            ${highPriorityRecs.length > 0 ? `
              <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; color: #dc2626; font-size: 16px;">🚨 High Priority</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  ${highPriorityRecs.map(rec => `<li style="margin: 5px 0; font-size: 14px; color: #374151;">${rec.title}: ${rec.message}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${mediumPriorityRecs.length > 0 ? `
              <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; color: #d97706; font-size: 16px;">⚠️ Medium Priority</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  ${mediumPriorityRecs.map(rec => `<li style="margin: 5px 0; font-size: 14px; color: #374151;">${rec.title}: ${rec.message}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${lowPriorityRecs.length > 0 ? `
              <div>
                <h3 style="margin: 0 0 10px 0; color: #16a34a; font-size: 16px;">ℹ️ General Recommendations</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  ${lowPriorityRecs.map(rec => `<li style="margin: 5px 0; font-size: 14px; color: #374151;">${rec.title}: ${rec.message}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; border-top: 3px solid #3b82f6;">
            <p style="margin: 0; font-size: 12px; color: #6b7280;">This report is generated based on current weather conditions and should be used for informational purposes only.</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #6b7280;">Generated by Climate Risk Assessment System • ${format(new Date(), "yyyy")}</p>
          </div>
        </div>
      `;

      document.body.appendChild(tempContainer);

      // Convert to canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save PDF
      const fileName = `climate-forecast-${currentLocation.name.replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      pdf.save(fileName);

      // Cleanup
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={generatePDF}
      disabled={isExporting || loading || !weatherData}
      className="gap-2"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4" />
      )}
      {isExporting ? 'Generating PDF...' : 'Export PDF'}
    </Button>
  );
};