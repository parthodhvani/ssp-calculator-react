import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Download, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { generatePDF } from "@/lib/report/pdfGenerator";
import { sendReportEmail } from "@/lib/report/emailService";
import type { ReportData } from "@/context/ReportContext";

interface ReportDialogProps {
    open: boolean;
    onClose: () => void;
    report: ReportData;
}

export function ReportDialog({ open, onClose, report }: ReportDialogProps) {
    const [email, setEmail] = useState(report.email || "");
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const pdfBlob = await generatePDF(report);
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Recura_Report_${report.name.replace(/\s/g, "_")}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success("PDF downloaded successfully");
        } catch (error) {
            console.error("PDF generation error:", error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSendEmail = async () => {
        if (!email || !email.trim()) {
            toast.error("Please enter a valid email address.");
            return;
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setIsSending(true);
        try {
            const pdfBlob = await generatePDF(report);
            const pdfBase64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = (reader.result as string).split(",")[1];
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(pdfBlob);
            });

            await sendReportEmail({
                email: email.trim(),
                reportData: report,
                pdfBase64: pdfBase64,
            });

            toast.success("Report sent successfully! Check your inbox.");
            onClose();
        } catch (error) {
            console.error("Email sending error:", error);
            toast.error("Failed to send report. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    return (

        <Dialog open={open} onOpenChange={(open) => !open && onClose()}> <DialogContent className="sm:max-w-lg"> <DialogHeader> <DialogTitle className="font-serif text-xl">Professional Report</DialogTitle> <DialogDescription className="text-sm text-muted-foreground pt-1"> Your personalised Dutch sick leave entitlement report is ready. </DialogDescription> </DialogHeader> <div className="py-4 space-y-4"> {/* Preview summary */} <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm"> <div className="flex justify-between items-start"> <div> <p className="font-medium text-foreground">{report.name}</p> <p className="text-muted-foreground text-xs">{report.company}</p> <p className="text-muted-foreground text-xs">{report.industry} · {report.status}</p> </div> <div className="text-right"> <p className="font-serif text-lg font-bold text-primary"> € {report.estimate.currentMonthly?.toLocaleString() || "—"} </p> <p className="text-[10px] text-muted-foreground">per month</p> </div> </div> <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs"> <span className="text-muted-foreground">Salary</span> <span className="font-medium text-right">€ {report.salary.toLocaleString()}</span> <span className="text-muted-foreground">Hours</span> <span className="font-medium text-right">{report.hours} / week</span> <span className="text-muted-foreground">Sick leave</span> <span className="font-medium text-right">{report.firstDay} {report.lastDay ? `– ${report.lastDay}` : ""}</span> <span className="text-muted-foreground">Weeks remaining</span> <span className="font-medium text-right">{report.estimate.weeksRemaining ?? "—"}</span> </div> </div>
            {/* Email input */}

            <div className="space-y-1.5"> <label htmlFor="report-email" className="text-sm font-medium text-foreground"> Send by email </label> <div className="flex gap-2"> <Input id="report-email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1" /> <Button variant="outline" onClick={handleSendEmail} disabled={isSending} className="gap-2" > {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />} Send </Button> </div> </div> </div> <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-2"> <Button variant="outline" onClick={onClose}> Cancel </Button> <Button variant="default" onClick={handleDownload} disabled={isDownloading} className="gap-2" > {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download PDF </Button> </DialogFooter> </DialogContent> </Dialog>);
}
