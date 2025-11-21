import "next-auth";
import { DefaultSession } from "next-auth";

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

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      permissions?: string[];
    } & DefaultSession["user"]; // merge with default name/email/image
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    permissions?: string[];
  }
}