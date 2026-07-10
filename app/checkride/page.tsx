import CheckrideSession from "@/components/checkride/CheckrideSession";

export const dynamic = "force-dynamic";

export default function CheckridePage() {
  return (
    <div className="wrap checkride-wrap academy-page">
      <CheckrideSession />
    </div>
  );
}
