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
    name: string;
    country_of_birth: string;
    date_of_birth: string;
  }>({
    name: "",
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
            name: data.name,
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
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Toggles the edit mode on
   */
  const handleEditClick = () => {
    setIsEditing(true);
  };

  /**
   * Saves the form data to the API,
   * then updates the displayed patient
   */
  const handleSaveClick = async () => {
    if (!id) return;
    try {
      setIsDataLoading(true);
      // Adjust PUT vs PATCH based on your API
      await httpClient.put<Patient>(`/patients/${id}`, formData);

      // Update local patient state to reflect changes
      setPatient((prev) =>
        prev ? { ...prev, ...formData } : null
      );

      setIsEditing(false);
      setIsDataLoading(false);
    } catch (error) {
      console.error("Failed to update patient:", error);
      setIsDataLoading(false);
    }
  };

  /**
   * Cancels edit mode, discarding unsaved changes
   */
  const handleCancelClick = () => {
    if (!patient) return;

    // Reset to original patient data
    setFormData({
      name: patient.name,
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
          <h1 className="text-3xl font-bold text-gray-800">
            Patient Details
          </h1>

          {!isEditing ? (
            <button
              onClick={handleEditClick}
              className="py-2 px-4 rounded-md bg-blue-600 text-white
                         hover:bg-blue-700 transition-colors"
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
                className="py-2 px-4 rounded-md bg-gray-300 text-gray-800
                           hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex items-center mb-6">
          <img
            src="/img/patient_avatar.png"
            alt="Patient Avatar"
            className="rounded-full w-24 h-24 object-cover mr-6"
          />
          <div>
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-semibold">{patient.name}</h2>
                <p className="text-gray-500">
                  Country of Birth: {patient.country_of_birth}
                </p>
                <p className="text-gray-500">
                  Date of Birth: {patient.date_of_birth}
                </p>
              </>
            ) : (
              <div className="space-y-3">
                {/* Name field */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md
                               py-2 px-3 text-gray-700"
                  />
                </div>
                {/* Country of Birth field */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Country of Birth
                  </label>
                  <input
                    type="text"
                    name="country_of_birth"
                    value={formData.country_of_birth}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md
                               py-2 px-3 text-gray-700"
                  />
                </div>
                {/* Date of Birth field */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md
                               py-2 px-3 text-gray-700"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Section (Customizable) */}
        <hr className="my-6" />
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Notes</h3>
          <p className="text-gray-700 leading-relaxed">
            Here’s where you can add any additional notes about this patient,
            such as medical history, allergies, or next appointment details.
            (This is just an example placeholder – you can customize as needed.)
          </p>
        </div>

        {/* Back Button (Optional) */}
        <div className="mt-6">
          <button
            onClick={() => navigate(-1)}
            className="py-2 px-4 rounded-md bg-gray-200 text-gray-800
                       hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
