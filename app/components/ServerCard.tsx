"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface ServerData {
  online: boolean;
  players?: { online: number; max: number };
  version?: string;
}

interface Mirror {
  ip: string;
  label: string;
}

interface Props {
  ip: string;
  label: string;
  mirrors?: Mirror[];
  delay?: number;
}

export default function ServerCard({ ip, label, mirrors, delay = 0 }: Props) {
  const [data, setData] = useState<ServerData | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/status?ip=${encodeURIComponent(ip)}`);
      const json = await res.json();
      setData(json);
    } catch {
      setData({ online: false });
    } finally {
      setLoading(false);
    }
  }, [ip]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60_000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const copyIP = () => {
    navigator.clipboard.writeText(ip).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="rounded-2xl border-2 border-border bg-surface"
    >
      {/* Main row */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-4">
          <StatusDot loading={loading} online={data?.online ?? false} />
          <div>
            <div className="mb-1 text-lg text-fg">{label}</div>
            <div className="text-sm text-muted">{ip}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {data?.online && data.players && (
            <div className="flex items-center gap-1.5 text-sm text-muted">
              <i className="bx bx-group text-lg" />
              <span>
                {data.players.online}/{data.players.max}
              </span>
            </div>
          )}
          <CopyButton ip={ip} copied={copied} onClick={copyIP} />
        </div>
      </div>

      {/* Mirrors */}
      {mirrors && mirrors.length > 0 && (
        <div className="border-t-2 border-border px-6 py-3 flex flex-col gap-2">
          {mirrors.map((mirror) => (
            <MirrorRow key={mirror.ip} mirror={mirror} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function MirrorRow({ mirror }: { mirror: Mirror }) {
  const [copied, setCopied] = useState(false);

  const copyIP = () => {
    navigator.clipboard.writeText(mirror.ip).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <span className="text-sm text-fg">{mirror.label}</span>
        <span className="ml-2 text-sm text-muted">{mirror.ip}</span>
      </div>
      <CopyButton ip={mirror.ip} copied={copied} onClick={copyIP} />
    </div>
  );
}

function CopyButton({ ip: _ip, copied, onClick }: { ip: string; copied: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex cursor-pointer items-center gap-1.5 rounded-xl border-2 bg-transparent px-3.5 py-2 font-minecraft text-sm transition-colors duration-200 ${
        copied
          ? "border-green text-green"
          : "border-border text-muted hover:border-fg hover:text-fg"
      }`}
    >
      <i className={`bx ${copied ? "bx-check" : "bx-copy"} text-base`} />
      {copied ? "Скопировано" : "Копировать IP"}
    </motion.button>
  );
}

function StatusDot({ loading, online }: { loading: boolean; online: boolean }) {
  if (loading) {
    return (
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        className="size-3 shrink-0 rounded-full bg-border"
      />
    );
  }

  return (
    <div className="relative shrink-0">
      {online && (
        <motion.div
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-green"
        />
      )}
      <div
        className={`relative size-3 rounded-full ${online ? "bg-green" : "bg-red"}`}
      />
    </div>
  );
}
