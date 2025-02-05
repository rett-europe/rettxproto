// src/pages/home/home.tsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HeaderBar, NavLocation } from "../../components/headerBar/headerBar";
import { Spinner } from "@fluentui/react-components";
import { httpClient } from "../../utils/httpClient/httpClient";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/header/header";
import { useAuth0 } from "@auth0/auth0-react";
import { Patient } from "../../types/Patient"; // import the Patient type

export function Home() {
  const { t } = useTranslation();
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      setIsDataLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL; // get API URL from environment
      const patientsEndpoint = `${baseUrl}/patients`;
      httpClient
        .get<Patient[]>(patientsEndpoint)
        .then((data) => {
          setPatients(data);
          setIsDataLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch patients:", err);
          setIsDataLoading(false);
        });
    }
  }, [isAuthenticated]);

  return (
    <>
      <Header className="" size="large">
        <HeaderBar location={NavLocation.Home} />
        <div className="flex max-h-[60%] justify-between">
          <div>
            <h1 className="text-3xl">{t("pages.home.title")}</h1>
            <div className="text-lg">{t("pages.home.subtitle")}</div>
          </div>
          <div>
            <img
              src="/img/logo.png"
              className="h-20 w-auto object-contain"
              alt="logo"
            />
          </div>
        </div>
      </Header>
      <main className="px-8 pt-8 md:px-24">
        {(authLoading || isDataLoading) && (
          <div className="mt-16 w-full">
            <Spinner size="extra-large" />
          </div>
        )}
        {!(authLoading || isDataLoading) && isAuthenticated && user && (
          <div>
            <h2 className="text-2xl mb-4">Welcome, {user.name}</h2>
            <h3 className="text-xl mb-2">Your Patients:</h3>
            {patients.length > 0 ? (
              <ul>
                {patients.map((patient) => (
                  <li key={patient.id} className="mb-1">
                    {patient.name} ({patient.country_of_birth}, {patient.date_of_birth})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No patients found.</p>
            )}
          </div>
        )}
        {!(authLoading || isDataLoading) && !isAuthenticated && (
          <p>Please log in to view your patients.</p>
        )}
      </main>
    </>
  );
}
