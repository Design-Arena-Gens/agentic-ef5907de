export type Recipient = {
  id: string;
  name: string;
  phone: string;
  variables: Record<string, string>;
};

export type CampaignMessage = {
  template: string;
  scheduledAt?: Date | null;
};
