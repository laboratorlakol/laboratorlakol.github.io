"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, ShieldCheck, ShieldAlert, Ban, Gamepad2 } from "lucide-react";

interface AuditLogEntry {
  id: string;
  action: string;
  createdAt: string;
  user: { username: string } | null;
  metadata: Record<string, unknown> | null;
}

interface Stats {
  totalUsers: number;
  verifiedUsers: number;
  suspendedUsers: number;
  bannedUsers: number;
  linkedCharacters: number;
  recentLogs: AuditLogEntry[];
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number;
}) {
  return (
    <div className="panel rounded-md p-5">
      <Icon className="text-signal" size={20} />
      <div className="mt-3 font-mono text-2xl text-signal text-glow tabular-nums">
        {value.toLocaleString("ro-RO")}
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
        {label}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => null);
  }, []);

  return (
    <div>
      <h1 className="font-display uppercase text-2xl">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-faint">Privire generală asupra contului și activității.</p>

      {!stats ? (
        <div className="mt-10 flex justify-center">
          <Loader2 className="animate-spin text-signal" size={28} />
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard icon={Users} label="Useri Totali" value={stats.totalUsers} />
            <StatCard icon={ShieldCheck} label="Email Confirmat" value={stats.verifiedUsers} />
            <StatCard icon={ShieldAlert} label="Suspendați" value={stats.suspendedUsers} />
            <StatCard icon={Ban} label="Banați" value={stats.bannedUsers} />
            <StatCard icon={Gamepad2} label="Personaje Conectate" value={stats.linkedCharacters} />
          </div>

          <div className="mt-10">
            <h2 className="font-mono text-xs uppercase tracking-wider text-ink-faint">
              Activitate recentă
            </h2>
            <div className="mt-4 panel rounded-md divide-y divide-line">
              {stats.recentLogs.length === 0 && (
                <p className="px-4 py-4 text-sm text-ink-faint">Nicio activitate încă.</p>
              )}
              {stats.recentLogs.map((log) => (
                <div key={log.id} className="px-4 py-3 flex items-center justify-between text-sm">
                  <span>
                    <span className="text-signal font-mono text-xs">{log.action}</span>{" "}
                    <span className="text-ink-faint">— {log.user?.username ?? "sistem"}</span>
                  </span>
                  <span className="text-xs text-ink-faint font-mono">
                    {new Date(log.createdAt).toLocaleString("ro-RO")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
