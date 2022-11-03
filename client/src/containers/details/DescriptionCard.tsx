import React from 'react'
import CardTemplate from '../../components/CardTemplate';

function DescriptionCard({ description }: { description: string}) {
  return (
    <CardTemplate title="Description" className="mt-[10px]">

      <div className="py-[8px] pl-[15px] pr-[8px]">
        <p className='text-neutral-700 dark:text-neutral-400 text-base font-[400] whitespace-pre-line'>{description}</p>
      </div>
    </CardTemplate>
  );
}

export default DescriptionCard
