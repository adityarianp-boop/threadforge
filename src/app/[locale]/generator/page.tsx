import dynamic from "next/dynamic";
const GeneratorForm = dynamic(() => import("@/components/generator/generator-form").then((m) => m.GeneratorForm), { loading: () => <div className="h-24 animate-pulse rounded-xl bg-surface" /> });
export default function GeneratorPage() { return <GeneratorForm />; }
