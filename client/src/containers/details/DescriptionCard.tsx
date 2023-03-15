import React from "react";
import CardTemplate from "../../components/CardTemplate";

const DescriptionCard: React.FC<{ description: string }> = ({
  description,
}) => {
  return (
    <CardTemplate title="Description" className="mt-8">
      <div className="py-[8px] pl-[15px] pr-[8px]">
        <p className="text-neutral-700 dark:text-neutral-400 text-base font-[400] whitespace-pre-line">
          {description}
        </p>
      </div>
    </CardTemplate>
  );
};

export default DescriptionCard;
