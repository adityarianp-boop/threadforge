import dynamic from "next/dynamic";
const HistoryList = dynamic(() => import("@/components/history/history-list").then((m) => m.HistoryList), { loading: () => <div className="h-24 animate-pulse rounded-xl bg-surface" /> });
export default function HistoryPage() { return <HistoryList />; }
