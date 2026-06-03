import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, X, FileText, FileCode } from "lucide-react";
import { submissions, type Submission, type SubmissionStatus } from "@/lib/mock-articles";
import { SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Editör Paneli — Akademik Dergi" },
      { name: "description", content: "Editörler için yayın iş akışı paneli." },
    ],
  }),
  component: DashboardPage,
});

const statusStyles: Record<SubmissionStatus, string> = {
  "Hakem Sürecinde": "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200",
  "Yayına Hazırlanıyor": "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200",
  "Yayımlandı": "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function DashboardPage() {
  const [modalFor, setModalFor] = useState<Submission | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Editör Paneli
          </p>
          <h1 className="mt-2 font-serif-display text-3xl font-bold">
            Yayın İş Akışı
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gönderilen makalelerin sürecini takip edin ve mizanpaj dosyalarını yükleyin.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Gönderi No</th>
                <th className="px-4 py-3 font-medium">Başlık</th>
                <th className="px-4 py-3 font-medium">Sorumlu Yazar</th>
                <th className="px-4 py-3 font-medium">Tarih</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {submissions.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-secondary/30">
                  <td className="px-4 py-4 font-mono text-xs text-muted-foreground">{s.id}</td>
                  <td className="px-4 py-4 font-medium">{s.title}</td>
                  <td className="px-4 py-4 text-muted-foreground">{s.correspondingAuthor}</td>
                  <td className="px-4 py-4 text-muted-foreground">{formatDate(s.submittedAt)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[s.status]}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {s.status === "Yayına Hazırlanıyor" ? (
                      <button
                        onClick={() => setModalFor(s)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        <Upload className="h-3 w-3" />
                        Son Mizanpajı Yükle
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {modalFor && (
        <UploadGalleyModal submission={modalFor} onClose={() => setModalFor(null)} />
      )}
    </div>
  );
}

function UploadGalleyModal({
  submission,
  onClose,
}: {
  submission: Submission;
  onClose: () => void;
}) {
  const [doi, setDoi] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [xml, setXml] = useState<File | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-serif-display text-lg font-bold">Son Mizanpajı Yükle</h2>
            <p className="mt-1 text-xs text-muted-foreground">{submission.title}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert(`Yüklendi: ${submission.id}\nDOI: ${doi}`);
            onClose();
          }}
          className="space-y-5 px-6 py-5"
        >
          <FileField
            label="Final PDF (LaTeX ile üretilen)"
            accept="application/pdf"
            icon={<FileText className="h-5 w-5" />}
            file={pdf}
            onChange={setPdf}
          />
          <FileField
            label="JATS XML Dosyası (Etkileşimli okuyucu için)"
            accept=".xml,application/xml,text/xml"
            icon={<FileCode className="h-5 w-5" />}
            file={xml}
            onChange={setXml}
          />

          <div>
            <label htmlFor="doi" className="mb-1 block text-sm font-medium">
              DOI Numarası Ata
            </label>
            <input
              id="doi"
              type="text"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              placeholder="10.62847/akademik.2025.0099"
              className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              required
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
            >
              İptal
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Yayımla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FileField({
  label,
  accept,
  icon,
  file,
  onChange,
}: {
  label: string;
  accept: string;
  icon: React.ReactNode;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <label className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-border bg-secondary/30 px-4 py-3 transition-colors hover:border-ring">
        <span className="text-muted-foreground">{icon}</span>
        <span className="flex-1 text-sm">
          {file ? (
            <span className="font-medium">{file.name}</span>
          ) : (
            <span className="text-muted-foreground">Dosya seçmek için tıklayın</span>
          )}
        </span>
        <input
          type="file"
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          className="hidden"
          required
        />
      </label>
    </div>
  );
}
