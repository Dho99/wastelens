import React from "react";
import { ValidationStep } from "../services/validationService";

interface StepperListProps {
  steps: ValidationStep[];
}

export const StepperList: React.FC<StepperListProps> = ({ steps }) => {
  return (
    <div className="px-6 pb-6">
      <div className="max-w-[340px] mx-auto space-y-2">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          // Determine line, bullet styles
          let bulletNode = null;
          let titleColor = "text-gray-400";
          let descColor = "text-gray-400";
          let lineColor = "bg-gray-200";

          if (step.status === "DONE") {
            titleColor = "text-[#287A38]";
            descColor = "text-gray-500";
            lineColor = "bg-[#287A38]";
            bulletNode = (
              <div className="w-8 h-8 rounded-full bg-[#287A38] text-white flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
            );
          } else if (step.status === "PROSES") {
            titleColor = "text-[#287A38]";
            descColor = "text-gray-500";
            lineColor = "bg-gray-200";
            bulletNode = (
              <div className="w-8 h-8 rounded-full bg-white border-4 border-[#287A38] flex items-center justify-center shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-[#287A38]" />
              </div>
            );
          } else {
            // PENDING
            titleColor = "text-gray-400";
            descColor = "text-gray-400/80";
            lineColor = "bg-gray-100";
            bulletNode = (
              <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 text-gray-300 flex items-center justify-center">
                {/* MDI map-marker-outline */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" />
                </svg>
              </div>
            );
          }

          return (
            <div key={step.id} className="relative flex gap-4">
              {/* Stepper Bullet & Vertical Line */}
              <div className="flex flex-col items-center">
                <div className="relative z-10">{bulletNode}</div>
                {!isLast && (
                  <div className={`w-[2px] h-12 my-1 ${lineColor}`} />
                )}
              </div>

              {/* Text descriptions */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2">
                  <h3 className={`font-black text-sm ${titleColor}`}>
                    {step.title}
                  </h3>
                  {step.statusLabel && (
                    <span className="bg-[#FAF9F5] text-gray-400 border border-gray-100 text-[9px] font-black px-2 py-0.5 rounded-full">
                      {step.statusLabel}
                    </span>
                  )}
                </div>
                <p className={`text-[11px] font-semibold mt-0.5 ${descColor}`}>
                  {step.description}
                </p>

                {/* Specific Progress bar below processing step 2 */}
                {step.status === "PROSES" && step.id === 2 && (
                  <div className="w-full max-w-[280px] h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden border border-gray-100/50">
                    <div className="h-full bg-[#287A38] rounded-full w-2/3 animate-[pulse_1.2s_infinite]" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
