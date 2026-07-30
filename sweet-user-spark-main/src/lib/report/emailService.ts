import type { ReportData } from "@/context/ReportContext";

const API_BASE = import.meta.env.VITE_WP_API_BASE || "/wp-json";
const SEND_REPORT_ENDPOINT = `${API_BASE}/recura/v1/send-report`;

interface SendReportPayload {
  email: string;
  reportData: ReportData;
  pdfBase64: string;
}

interface SendReportResponse {
  ok: boolean;
  message?: string;
}

export async function sendReportEmail(
  payload: SendReportPayload
): Promise<SendReportResponse> {
  const response = await fetch(SEND_REPORT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: payload.email,
      reportData: payload.reportData,
      pdf: payload.pdfBase64,
    }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to send email";

    try {
      const errorData = await response.json();
      if (errorData?.message) errorMessage = errorData.message;
    } catch {
      // Ignore JSON parse errors
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
}