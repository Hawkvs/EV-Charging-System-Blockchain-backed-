import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Shell } from "../../../lib/layout";
import { getSession as getSessionApi, startSessionCharging, stopSessionCharging } from "../../../lib/api";
import { loadSession } from "../../../lib/session";
import { getNativeBalance } from "../../../lib/web3";

export default function DonorSessionPage() {
  const router = useRouter();
  const id = router.query.id;
  const [soc, setSoc] = useState(0);
  const [payload, setPayload] = useState(null);
  const [log, setLog] = useState(["donor monitor ready", "watching escrow state"]);
  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    const current = loadSession();
    if (current?.address) {
      getNativeBalance(current.address).then((bal) => {
        if (!localStorage.getItem(`prevBal_${id}`)) {
          localStorage.setItem(`prevBal_${id}`, bal);
        }
      }).catch(() => {});
    }

    const poll = setInterval(async () => {
      try {
        const data = await getSessionApi(id);
        setPayload(data);
        setSoc(Number(data?.progress?.soc || 0));
        setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${data.request.statusLabel}`, ...prev].slice(0, 25));

        const effectiveStatus = Number(data.request.effectiveStatus ?? data.request.status ?? 0);
        if (effectiveStatus >= 3) {
          router.push(`/donor/complete?id=${id}`);
        }
      } catch {
        setLog((prev) => [`[${new Date().toLocaleTimeString()}] awaiting updates`, ...prev].slice(0, 25));
      }
    }, 3500);

    return () => {
      clearInterval(poll);
    };
  }, [id, router]);

  async function handleStartCharging() {
    if (!id) {
      return;
    }

    try {
      setStarting(true);
      setError("");
      await startSessionCharging(id);
      setLog((prev) => [`[${new Date().toLocaleTimeString()}] charging simulation started by backend`, ...prev].slice(0, 25));
    } catch (err) {
      setError(String(err?.message || "Unable to start charging"));
    } finally {
      setStarting(false);
    }
  }

  async function handleStopCharging() {
    if (!id) {
      return;
    }

    try {
      setStopping(true);
      setError("");
      await stopSessionCharging(id);
      setLog((prev) => [`[${new Date().toLocaleTimeString()}] charging stopped by donor`, ...prev].slice(0, 25));
    } catch (err) {
      setError(String(err?.message || "Unable to stop charging"));
    } finally {
      setStopping(false);
    }
  }

  const steps = useMemo(() => payload?.escrowSteps || [], [payload]);
  const telemetry = payload?.progress?.telemetry || null;
  const effectiveStatus = Number(payload?.request?.effectiveStatus ?? payload?.request?.status ?? 0);
  const completed = effectiveStatus >= 3 || soc >= 100;
  const simulating = Boolean(payload?.control?.simulating);
  const canStart = !simulating && !completed;
  const canStop = simulating && !completed;

  return (
    <Shell title={`Donor Live Session #${id || ""}`} subtitle="Start charging and let backend simulate delivery + payout.">
      <section className="grid two">
        <article className="card">
          <h3>Vehicle SOC</h3>
          <div className="progress" style={{ marginTop: 12 }}><span style={{ width: `${soc}%`, background: "linear-gradient(90deg, #f6c168, #f0a037)" }} /></div>
          <p className="muted" style={{ marginTop: 8 }}>{soc.toFixed(0)}%</p>

          <div className="row" style={{ marginTop: 12 }}>
            <button className="amber" onClick={handleStartCharging} disabled={!canStart || starting || stopping}>
              {starting ? "Starting..." : canStart ? "Start charging" : "Charging started"}
            </button>
            {canStop ? (
              <button className="ghost" onClick={handleStopCharging} disabled={stopping || starting}>
                {stopping ? "Stopping..." : "Stop charging"}
              </button>
            ) : null}
          </div>
          {error ? <p style={{ color: "#ff9393", marginTop: 8 }}>{error}</p> : null}

          <h3 style={{ marginTop: 16 }}>Escrow watch</h3>
          <div className="kv" style={{ marginTop: 8 }}>
            {steps.map((step) => (
              <div className="item" key={step.step}>
                <span>{step.step}</span>
                <span>{step.done ? "done" : "pending"}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h3>Live log</h3>
          <div className="log" style={{ marginTop: 10 }}>
            {log.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
          </div>

          <h3 style={{ marginTop: 16 }}>Pi telemetry</h3>
          <div className="kv" style={{ marginTop: 8 }}>
            <div className="item"><span>Voltage</span><span>{telemetry?.voltage ?? "-"} V</span></div>
            <div className="item"><span>Current</span><span>{telemetry?.current ?? "-"} A</span></div>
            <div className="item"><span>Power</span><span>{telemetry?.power ?? "-"} W</span></div>
            <div className="item"><span>Source time</span><span>{telemetry?.timestamp || "-"}</span></div>
          </div>
        </article>
      </section>
    </Shell>
  );
}
