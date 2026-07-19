import React from "react";
import { HelpTopic } from "../services/helpService";

interface PopularTopicsProps {
  topics: HelpTopic[];
  onTopicClick: (topicId: string) => void;
}

export const PopularTopics: React.FC<PopularTopicsProps> = ({
  topics,
  onTopicClick,
}) => {
  return (
    <div className="mb-6">
      {/* Section Title with Green Vertical Bar indicator */}
      <div className="border-l-4 border-l-[#1E7D38] px-3 mb-4 select-none ml-4">
        <h3 className="text-sm font-extrabold text-gray-800 tracking-wide">
          Topik Populer
        </h3>
      </div>

      {/* Cards list */}
      <div className="px-4 space-y-4">
        {topics.map((topic) => {
          let iconNode = null;
          let iconBg = "bg-gray-100 text-gray-500";

          if (topic.iconType === "ALERT") {
            iconBg = "bg-[#E2ECE4] text-[#1E7D38]";
            iconNode = (
              <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M12,2L1,21H23L12,2M13,16H11V14H13V16M13,12H11V8H13V12Z" />
              </svg>
            );
          } else if (topic.iconType === "INFO") {
            iconBg = "bg-[#FFF0E6] text-[#C55D2D]";
            iconNode = (
              <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
              </svg>
            );
          } else if (topic.iconType === "GIFT") {
            iconBg = "bg-[#F3EEF5] text-[#80509E]";
            iconNode = (
              <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M17,10V21H7V10H17M12,4.88c0.75,0 1.38,0.61 1.38,1.37a1.37,1.37 0 0,1 -1.38,1.38C11.25,7.63 10.63,7 10.63,6.25c0-.76.62-1.37 1.37-1.37M20,10v1.5a1.5,1.5 0 0,1 -1.5,1.5h-13A1.5,1.5 0 0,1 4,11.5V10c0-.83.67-1.5 1.5-1.5h13a1.5,1.5 0 0,1 1.5,1.5Z" />
              </svg>
            );
          }

          return (
            <div
              key={topic.id}
              onClick={() => onTopicClick(topic.id)}
              className="bg-white border border-gray-100 rounded-3xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:scale-[1.005] transition-all duration-200"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1 pr-2">
                {/* Topic icon circle wrapper */}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 ${iconBg}`}>
                  {iconNode}
                </div>

                <div className="flex flex-col gap-0.5 min-w-0">
                  <h4 className="text-xs font-black text-gray-805 truncate">
                    {topic.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-semibold truncate leading-normal">
                    {topic.description}
                  </p>
                </div>
              </div>

              {/* Chevron Right */}
              <svg className="w-5 h-5 text-gray-400 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};
