import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { httpClient } from "../../utils/httpClient/httpClient";
import { Spinner } from "@fluentui/react-components";
import { Patient } from "../../types/Patient";

export function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  // Editing state
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Editable form fields
  const [formData, setFormData] = useState<{
    given_name: string;
    family_name: string;
    country_of_birth: string;
    date_of_birth: string;
  }>({
    given_name: "",
    family_name: "",
    country_of_birth: "",
    date_of_birth: "",
  });

  useEffect(() => {
    if (id) {
      setIsDataLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL;
      const detailEndpoint = `${baseUrl}/patients/${id}`;

      httpClient
        .get<Patient>(detailEndpoint)
        .then((data) => {
          setPatient(data);

          // Initialize form data
          setFormData({
            given_name: data.given_name,
            family_name: data.family_name,
            country_of_birth: data.country_of_birth,
            date_of_birth: data.date_of_birth,
          });
          setIsDataLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch patient:", err);
          setIsDataLoading(false);
        });
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!id) return;
    try {
      setIsDataLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL;
      const detailEndpoint = `${baseUrl}/patients/${id}`;

      // We compute `name` by concatenating given_name and family_name
      const updatedData = {
        ...formData,
        name: `${formData.given_name} ${formData.family_name}`.trim(),
      };

      await httpClient.patch<
        typeof updatedData,
        Patient
      >(detailEndpoint, updatedData);

      // Update local patient state to reflect changes
      setPatient((prev) =>
        prev
          ? {
              ...prev,
              ...formData,
              name: updatedData.name,
            }
          : null
      );

      setIsEditing(false);
      setIsDataLoading(false);
    } catch (error) {
      console.error("Failed to update patient:", error);
      setIsDataLoading(false);
    }
  };

  const handleCancelClick = () => {
    if (!patient) return;

    // Reset form to original patient data
    setFormData({
      given_name: patient.given_name,
      family_name: patient.family_name,
      country_of_birth: patient.country_of_birth,
      date_of_birth: patient.date_of_birth,
    });
    setIsEditing(false);
  };

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
    <div className="p-8 md:p-16">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        {/* Header / Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-neutral-700">
            Patient Details
          </h1>

          {!isEditing ? (
            <button
              onClick={handleEditClick}
              className="py-2 px-4 rounded-md bg-yellow-500 text-white
                         hover:bg-yellow-700 transition-colors"
            >
              Edit
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleSaveClick}
                className="py-2 px-4 rounded-md bg-green-600 text-white
                           hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelClick}
                className="py-2 px-4 rounded-md bg-neutral-300 text-neutral-700
                           hover:bg-neutral-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex items-center mb-6">
          <img
            src="/img/girl_avatar.png"
            alt="Patient Avatar"
            className="rounded-full w-24 h-24 object-cover mr-6"
          />
          <div>
            {!isEditing ? (
              <>
                {/* Display computed name in read-only mode */}
                <h2 className="text-2xl font-semibold">
                  {patient.given_name} {patient.family_name}
                </h2>
                <p className="text-neutral-550">
                  Country of Birth: {patient.country_of_birth}
                </p>
                <p className="text-neutral-550">
                  Date of Birth: {patient.date_of_birth}
                </p>
              </>
            ) : (
              <div className="space-y-3">
                {/* Given Name field */}
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Given Name
                  </label>
                  <input
                    type="text"
                    name="given_name"
                    value={formData.given_name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md
                               py-2 px-3 text-neutral-600"
                  />
                </div>
                {/* Family Name field */}
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Family Name
                  </label>
                  <input
                    type="text"
                    name="family_name"
                    value={formData.family_name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md
                               py-2 px-3 text-neutral-600"
                  />
                </div>
                {/* Country of Birth field */}
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Country of Birth
                  </label>
                  <input
                    type="text"
                    name="country_of_birth"
                    value={formData.country_of_birth}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md
                               py-2 px-3 text-neutral-600"
                  />
                </div>
                {/* Date of Birth field */}
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md
                               py-2 px-3 text-neutral-600"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mutations Section */}
        <div>
          <h3 className="text-xl font-semibold text-neutral-700 mb-2">
            Mutations
          </h3>
          {patient.mutations && patient.mutations.length > 0 ? (
            <div className="space-y-4">
              {patient.mutations.map((mutation) => (
                <div
                  key={mutation.id}
                  className="border rounded-md p-4 flex flex-col space-y-2"
                >
                  <div>
                    <strong>Gene mutation:</strong>{" "}
                    {mutation.gene_mutation_collection?.mutation_id}
                  </div>
                  <div>
                    <strong>Protein mutation:</strong>{" "}
                    {mutation.gene_mutation_collection?.protein_mutation?.protein_transcript}
                    :
                    {
                      mutation.gene_mutation_collection?.protein_mutation
                        ?.protein_variation
                    }
                  </div>
                  <div>
                    <strong>Created at:</strong> {mutation.created_at}
                  </div>
                  <div>
                    <strong>Validation status:</strong>{" "}
                    {mutation.validation_status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-600">No mutations found.</p>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => navigate(-1)}
            className="py-2 px-4 rounded-md bg-neutral-600 text-neutral-200
                       hover:bg-neutral-700 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
