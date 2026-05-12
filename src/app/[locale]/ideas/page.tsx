import dynamic from "next/dynamic";
const IdeasPanel = dynamic(() => import("@/components/ideas/ideas-panel").then((m) => m.IdeasPanel), { loading: () => <div className="h-24 animate-pulse rounded-xl bg-surface" /> });
export default function IdeasPage() { return <IdeasPanel />; }
