// src/types/Patient.ts

export interface Permission {
    id: string;
    user_id: string;
    relationship_type: string;
    access_level: string;
    consent_date: string; // Consider using Date if you convert the string
    consent_version: number;
    consent_signed: boolean;
    is_active: boolean;
  }
  
  export interface GeneMutationInfo {
    spdi: string[];
    id: string[];
    hgvsp: string[];
    hgvsc: string[];
    hgvsg: string[];
    input: string;
  }
  
  export interface GeneMutationCollection {
    mutation_id: string;
    mutation_info: GeneMutationInfo;
  }
  
  export interface GeneMutation {
    gene_transcript: string;
    gene_variation: string;
    confidence: number;
    mutalyzer_model: Record<string, any>; // adjust if you have a specific type
  }
  
  export interface ProteinMutation {
    protein_transcript: string;
    protein_variation: string;
    confidence: number;
    mutalyzer_model: Record<string, any>;
  }
  
  export interface Mutation {
    id: string;
    created_at: string;
    created_by: string;
    version: number;
    last_updated_at: string;
    last_updated_by: string;
    is_deleted: boolean;
    gene_mutation_collection: GeneMutationCollection;
    protein_mutation: ProteinMutation;
    confidence: number;
    validation_status: string;
  }
  
  export interface Medication {
    id: string;
    created_at: string;
    created_by: string;
    version: number;
    last_updated_at: string;
    last_updated_by: string;
    is_deleted: boolean;
    name: string;
    dose: number;
    dose_unit: string;
    frequency: number;
    frequency_unit: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    notes: string;
  }
  
  export interface File {
    id: string;
    created_at: string;
    created_by: string;
    version: number;
    last_updated_at: string;
    last_updated_by: string;
    is_deleted: boolean;
    full_path: string;
    file_url: string;
    file_format: string;
    file_size: number;
    file_type: string;
    validation_status: string;
    validation_date: string;
    validation_description: string;
    description: string;
  }
  
  export interface Survey {
    id: string;
    created_at: string;
    created_by: string;
    version: number;
    last_updated_at: string;
    last_updated_by: string;
    is_deleted: boolean;
    patient_id: string;
    survey_version_id: string;
    start_date: string;
    end_date: string;
    multiple_responses_allowed: boolean;
    responses: any[]; // adjust if you have a type for responses
    survey_content: Record<string, any>;
  }
  
  export interface Patient {
    id: string;
    name: string;
    given_name: string;
    family_name: string;
    date_of_birth: string;
    country_of_birth: string;
    gender: string;
    deceased: boolean;
    deceased_date: string;
    permission: Permission;
    mutations: Mutation[];
    medications: Medication[];
    files: File[];
    surveys: Survey[];
  }
  