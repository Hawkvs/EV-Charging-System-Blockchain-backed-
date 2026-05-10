import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Shell } from "../../lib/layout";
import { getRequest } from "../../lib/api";
import { loadSession } from "../../lib/session";
import { getNativeBalance } from "../../lib/web3";

export default function DonorCompletePage() {
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [prevBal, setPrevBal] = useState("-");
  const [currBal, setCurrBal] = useState("-");

  useEffect(() => {
    const id = router.query.id;
    if (!id) {
      return;
    }
    getRequest(id).then(setRequest).catch(() => setRequest(null));

    const pb = localStorage.getItem(`prevBal_${id}`);
    if (pb) setPrevBal(pb);

    const current = loadSession();
    if (current?.address) {
      setTimeout(() => {
        getNativeBalance(current.address).then(setCurrBal).catch(() => {});
      }, 2000);
    }
  }, [router.query.id]);

  return (
    <Shell title="Donor Session Complete" subtitle="Token receipt and transaction reference.">
      <section className="card">
        <div className="kv">
          <div className="item"><span>Previous amount (ETH)</span><span className="mono">{prevBal}</span></div>
          <div className="item"><span>Updated amount (ETH)</span><span className="mono">{currBal}</span></div>
          <div className="item"><span>Request</span><span>{request?.id || router.query.id || "-"}</span></div>
          <div className="item"><span>Status</span><span>{request?.statusLabel || "COMPLETED"}</span></div>
          <div className="item"><span>Energy delivered</span><span>{request?.energyDelivered || "-"} kWh</span></div>
          <div className="item"><span>Token receipt (wei)</span><span className="mono">{request ? Number(request.energyRequired) * Number(request.pricePerUnitWei) : "-"}</span></div>
          <div className="item"><span>Tx hash</span><span className="mono">Use wallet history</span></div>
        </div>
        <div className="row" style={{ marginTop: 14 }}>
          <Link href="/donor/dashboard"><button className="amber">Back to donor dashboard</button></Link>
        </div>
      </section>
    </Shell>
  );
}
