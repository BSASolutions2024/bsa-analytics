export interface WorkArrangementTrendData {
    month: string
    wfh: number
    onsite: number
    hybrid: number
}

export interface ApiReportResponse {
  code: number;
  status: number;
  response: {
    data: any[];
    next: string;
    summary: Record<string, any>;
  };
}