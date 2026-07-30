import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export interface ReportData {
    name: string;
    email: string;
    company: string;
    industry: string;
    status: string;
    salary: number;
    hours: number;
    firstDay: string;
    lastDay: string;
    linked: boolean;
    linkedFirstDay: string;
    linkedLastDay: string;
    estimate: any; // The estimate object from calculateEntitlement
    generatedDate: string;
}

interface ReportContextValue {
    report: ReportData | null;
    setReport: (data: ReportData | null) => void;
    clearReport: () => void;
    hasReport: boolean;
}

const ReportContext = createContext<ReportContextValue | undefined>(undefined);

export function ReportProvider({ children }: { children: ReactNode }) {
    const [report, setReportState] = useState<ReportData | null>(null);

    const setReport = (data: ReportData | null) => {
        setReportState(data);
    };

    const clearReport = () => {
        setReportState(null);
    };

    const hasReport = useMemo(() => report !== null, [report]);

    return (
        <ReportContext.Provider value={{ report, setReport, clearReport, hasReport }}>
            {children}
        </ReportContext.Provider>
    );
}

export function useReport() {
    const context = useContext(ReportContext);
    if (context === undefined) {
        throw new Error('useReport must be used within a ReportProvider');
    }
    return context;
}