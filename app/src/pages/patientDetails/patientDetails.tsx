// src/pages/patientDetails/patientDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { httpClient } from "../../utils/httpClient/httpClient";
import { Spinner } from "@fluentui/react-components";
import { Patient } from "../../types/Patient";

export function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setIsDataLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL;
      const detailEndpoint = `${baseUrl}/patients/${id}`;

      httpClient
        .get<Patient>(detailEndpoint)
        .then((data) => {
          setPatient(data);
          setIsDataLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch patient:", err);
          setIsDataLoading(false);
        });
    }
  }, [id]);

  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center mt-16">
        <Spinner size="extra-large" />
      </div>
    );
  }

  if (!patient) {
    return <div className="mt-16 text-center">Patient not found</div>;
  }

  return (
    <div className="p-8 md:p-24">
      <h1 className="text-2xl mb-4">Patient Details</h1>
      <div className="border rounded p-4 bg-white shadow">
        <p><strong>Id:</strong> {patient.id}</p>
        <p><strong>Name:</strong> {patient.name}</p>
        <p><strong>Country of Birth:</strong> {patient.country_of_birth}</p>
        <p><strong>Date of Birth:</strong> {patient.date_of_birth}</p>
        <p><strong>Gender:</strong> {patient.gender}</p>
      </div>
    </div>
  );
}
