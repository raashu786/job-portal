import React from 'react';
import TalentsCards from '../FindTalents/TalentsCards';
import { useParams } from 'react-router-dom';

const RecommendedTalent = (props:any) => {
  const {id}=useParams();
  return (
    <div>
      <div className="text-xl font-semibold mb-5">Recommended Talent</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {props?.talents?.map((talent:any, index:any) =>  index < 3 && talent.id !== Number(id) && (
          <TalentsCards key={index} {...talent} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedTalent;
