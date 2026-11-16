
export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "PENDING_DOCUMENTS"
  | "APPROVED"
  | "REJECTED";

export type ParticipantRole =
  | "PRIMARY"
  | "CO_APPLICANT"
  | "ENTITY_MEMBER";

export interface ApplicationParticipant {
  id: string;
  applicantId: string;
  role: ParticipantRole;
}

export interface Application {
  id: string;
  status: ApplicationStatus;
  requestedAmount: number;
  submittedAt: string | null;
  farmId: string;
  loanProgramId: string;
  participants: ApplicationParticipant[];
  responseIds: string[];
  documentIds: string[];
}

export interface ApplicationResponse {
  id: string;
  applicationId: string;
  question: string;
  answer: string | null;
  updatedAt?: string | null;
}
