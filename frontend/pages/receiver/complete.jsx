import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Shell } from "../../lib/layout";
import { getRequest } from "../../lib/api";
import { loadSession } from "../../lib/session";
import { getNativeBalance } from "../../lib/web3";

export default function ReceiverCompletePage() {
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
      // Delay slightly to let blockchain state settle if it just mined
      setTimeout(() => {
        getNativeBalance(current.address).then(setCurrBal).catch(() => {});
      }, 2000);
    }
  }, [router.query.id]);

  return (
    <Shell title="Receiver Session Complete" subtitle="Final receipt with escrow and delivery details.">
      <section className="card">
        <h3>Receipt</h3>
        <div className="kv" style={{ marginTop: 10 }}>
          <div className="item"><span>Previous amount (ETH)</span><span className="mono">{prevBal}</span></div>
          <div className="item"><span>Updated amount (ETH)</span><span className="mono">{currBal}</span></div>
          <div className="item"><span>Request ID</span><span>{request?.id || router.query.id || "-"}</span></div>
          <div className="item"><span>Status</span><span>{request?.statusLabel || "COMPLETED"}</span></div>
          <div className="item"><span>Energy delivered</span><span>{request?.energyDelivered || "-"} kWh</span></div>
          <div className="item"><span>Price per unit</span><span className="mono">{request?.pricePerUnitWei || "-"}</span></div>
          <div className="item"><span>Escrow remaining</span><span>{request?.escrowBalance || "0"}</span></div>
        </div>
        <div className="row" style={{ marginTop: 14 }}>
          <Link href="/receiver/dashboard"><button className="primary">Back to receiver dashboard</button></Link>
        </div>
      </section>
    </Shell>
  );
}
