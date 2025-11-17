import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as XLSX from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function downloadExcel<T>(data: T[], fileName: string = "data.xlsx") {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("No data available for export.");
    return;
  }

  const formatValue = (value: any): any => {
    if (Array.isArray(value)) {
      return value.join(", "); // join arrays
    } else if (typeof value === "object" && value !== null) {
      return JSON.stringify(value); // stringify nested objects
    }
    return value;
  };

  const formattedData = data.map((row: any) => {
    const formattedRow: Record<string, any> = {};
    for (const [key, value] of Object.entries(row)) {
      formattedRow[key] = formatValue(value);
    }
    return formattedRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, fileName);
}

export const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatDate(dateInput: string | Date): string {
  let date: Date;

  if (typeof dateInput === "string") {
    // Split dd-mm-yyyy string
    const [day, month, year] = dateInput.split("-").map(Number);
    date = new Date(year, month - 1, day); // JS months are 0-indexed
  } else {
    date = dateInput;
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function parseDateString(dateString: string): Date {
  if (!dateString) return new Date(0);
  const [day, month, year] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateWithTime(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}-${hours}${minutes}`;
}

export const separationColorMap: Record<string, string> = {
  voluntary: "var(--color-voluntary)",
  involuntary: "var(--color-involuntary)",
  transfer: "var(--color-transfer)",
}

// Convert "01-07-2020" → Date object (DD-MM-YYYY format)
export function parseDMY(dateStr: string) {
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}


// Format date to YYYY-MM
export function toYearMonth(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

// Generate list of months from joinDate → endDate
export function allMonthsFrom(startDate: Date, endDate = new Date()) {
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  let cursor = new Date(start);
  const months = [];

  while (cursor <= end) {
    months.push(toYearMonth(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return months;
}

// Check if two dates are in the same month
export function isSameMonth(date1: string, yearMonth: string) {
  const d = parseDMY(date1);
  return toYearMonth(d) === yearMonth;
}
