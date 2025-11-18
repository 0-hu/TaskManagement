export type SubmissionStatus = "submitted" | "waiting" | "rejected" | "approved";

export type Submission = {
  id: string;
  title: string;
  team: string;
  owner: string;
  dueDate: string;
  status: SubmissionStatus;
};
