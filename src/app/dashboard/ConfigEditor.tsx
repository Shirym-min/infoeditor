"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./ConfigEditor.module.css";

type ApiConfig = {
  data: unknown;
  updatedAt: string | null;
};

export default function ConfigEditor() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("読み込み中...");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const apiPath = useMemo(() => "/api/config", []);
  const publicPath = useMemo(() => "/api/getjson/itcommitinfo", []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setError("");
      try {
        const res = await fetch(apiPath, { method: "GET" });
        if (!res.ok) throw new Error("読み込みに失敗しました");
        const json = (await res.json()) as ApiConfig;
        if (!mounted) return;
        setText(JSON.stringify(json.data ?? {}, null, 2));
        setUpdatedAt(json.updatedAt ?? null);
        setStatus("読み込み完了");
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "読み込みに失敗しました");
        setStatus("読み込み失敗");
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [apiPath]);

  async function onSave() {
    setError("");
    setSaving(true);
    try {
      const parsed = JSON.parse(text);
      const res = await fetch(apiPath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: parsed }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "保存に失敗しました");
      }
      const json = (await res.json()) as ApiConfig;
      setUpdatedAt(json.updatedAt ?? null);
      setStatus("保存しました");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2>JSON Config Editor</h2>
        <div className={styles.status}>{status}</div>
      </div>
      <textarea
        className={styles.textarea}
        value={text}
        onChange={e => setText(e.target.value)}
        spellCheck={false}
      />
      <div className={styles.actions}>
        <button className={styles.button} onClick={onSave} disabled={saving}>
          {saving ? "保存中..." : "保存"}
        </button>
        {error && <div className={styles.error}>{error}</div>}
      </div>
      <div className={styles.hint}>
        公開API: {publicPath}（GETで誰でも取得可能）
        {updatedAt ? ` / 最終更新: ${new Date(updatedAt).toLocaleString()}` : ""}
      </div>
    </section>
  );
}
