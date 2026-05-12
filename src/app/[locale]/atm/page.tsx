import dynamic from "next/dynamic";
const AtmAnalyzer = dynamic(() => import("@/components/atm/atm-analyzer").then((m) => m.AtmAnalyzer), { loading: () => <div className="h-24 animate-pulse rounded-xl bg-surface" /> });
export default function AtmPage() { return <AtmAnalyzer />; }
