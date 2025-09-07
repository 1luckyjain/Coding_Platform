import React from "react";
import { useParams } from "react-router-dom";

const ContestDetails = () => {
  const { id } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Contest Details - ID: {id}</h1>
      <p className="mt-4 text-gray-600">Here you can load contest {id} details from API or state.</p>
    </div>
  );
};

export default ContestDetails;
