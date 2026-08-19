// Dergi bölüm sayfalarının içerik modeli.
//
// MANTIK: Her alt başlığın (nav item) bir VARSAYILAN içeriği vardır ve tüm
// dergiler için ortaktır. Dergiye özel alanlar ({journal.name}, ISSN vb.)
// render sırasında Journal nesnesinden dinamik olarak dolar. Bir dergi için
// farklı içerik gerekirse `journalOverrides[slug]` altına aynı anahtarla
// eklenir — override varsa varsayılanın yerine o gösterilir.
//
// Anahtarlar navItemSlug(item) çıktısıdır (örn. "Aims and scope" → "aims-and-scope").

import type { ReactNode } from "react";
import type { BoardMember, Journal } from "@/lib/journals";
import { ojsLoginUrl, ojsSubmitUrl } from "@/lib/ojs";
import type { OjsJournalSettings } from "@/lib/ojs.server";

/** Yayıncının resmi tüzel kişilik unvanı — ISSN/indeks başvurularında bu kullanılır. */
const PUBLISHER = "CF Eğitim Danışmanlık ve Organizasyon Limited Şirketi";

// İÇERİK KAYNAĞI KURALI
// Her bölüm önce OJS'e bakar: dergi ayarlarında o alan doldurulmuşsa OJS'teki
// metin gösterilir, boşsa buradaki varsayılan. Böylece aynı metin iki yerde
// tutulmaz, dergi ekibi metni OJS'ten yönetebilir ve hiçbir sayfa boş kalmaz.

export type ContentRenderer = (j: Journal, s: OjsJournalSettings) => ReactNode;

/** OJS'ten gelen zengin metni gösterir. İçerik yalnızca dergi yöneticileri
 *  tarafından OJS panelinden girilir; dışarıdan gelen veri değildir. */
function OjsHtml({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

/** OJS'te doluysa onu, değilse koddaki varsayılanı gösterir. */
function fromOjs(value: string | undefined, fallback: ReactNode): ReactNode {
  return value ? <OjsHtml html={value} /> : fallback;
}

/** OJS'in zengin metin alanlarını düz satırlara indirger (adres, kurum adı gibi
 *  tek satırlık alanlarda kullanılır). */
function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

/** Yayın kurulu / yönetim ekibi listesi. */
function MemberList({ members }: { members: BoardMember[] }) {
  return (
    <ul className="not-prose mt-4 space-y-4">
      {members.map((m) => (
        <li key={`${m.name}-${m.role}`}>
          <div className="font-semibold">{m.name}</div>
          <div className="text-sm text-muted-foreground">
            {m.role}
            {m.affiliation ? ` · ${m.affiliation}` : ""}
            {m.country ? `, ${m.country}` : ""}
          </div>
          {m.orcid && (
            <a
              href={`https://orcid.org/${m.orcid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline"
            >
              ORCID {m.orcid}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------ Ortak içerik ------------------------------ */

const sharedContent: Record<string, ContentRenderer> = {
  /* --------------------------------- About -------------------------------- */

  "aims-and-scope": (j, s) =>
    fromOjs(s.description, (
    <>
      <p>{j.scope}</p>
      <p>
        The journal welcomes original research articles, review articles, and letters to
        the editor in the following subject areas: {j.subjects.join(", ")}. Work that
        crosses disciplinary boundaries and speaks to both researchers and practitioners
        is particularly encouraged.
      </p>
    </>
  )),

  "about-the-journal": (j, s) =>
    fromOjs(s.about, (
    <>
      <p>
        <em>{j.name}</em> ({j.shortName}) is a peer-reviewed, open access journal
        published on CF Open, the academic publishing platform of {PUBLISHER}. The
        language of publication is English.
      </p>
      <ul>
        {j.eissn && <li>e-ISSN: {j.eissn}</li>}
        <li>Publication frequency: two issues per year (June and December)</li>
        <li>Peer review model: double-blind</li>
        <li>Access: immediate open access under the CC BY 4.0 license</li>
        <li>Article processing charge: none</li>
      </ul>
    </>
  )),

  "abstracting-and-indexing-services": (j) => (
    <>
      <p>
        <em>{j.name}</em> is a newly launched journal and is not yet included in
        abstracting or indexing services. Following the publication of the first issues,
        applications will be made to relevant services, including Crossref (DOI), Google
        Scholar, DOAJ, and TR Dizin. This page will be updated as the journal is accepted
        by each service.
      </p>
    </>
  ),

  "editorial-board": (j) =>
    j.editorialBoard?.length ? (
      <MemberList members={j.editorialBoard} />
    ) : (
      <p>
        The editorial board of <em>{j.name}</em> will be announced before the first issue
        is published.
      </p>
    ),

  "best-practice": (j) => (
    <>
      <p>
        <em>{j.name}</em> adheres to the Principles of Transparency and Best Practice in
        Scholarly Publishing jointly issued by COPE, DOAJ, OASPA, and WAME. The journal is
        committed to transparent peer review, clearly stated ethics policies, accurate
        identification of its ownership and management, and honest communication of its
        indexing status and metrics.
      </p>
    </>
  ),

  "journal-management-team": (j) =>
    j.managementTeam?.length ? (
      <MemberList members={j.managementTeam} />
    ) : (
      <p>
        The management team of <em>{j.name}</em> will be announced before the first issue
        is published.
      </p>
    ),

  "publishing-credentials": (j, s) => {
    const publisher = s.publisherInstitution ?? PUBLISHER;
    const eissn = s.onlineIssn ?? j.eissn;
    return (
      <>
        <p>
          <em>{j.name}</em> is published by {publisher} (Ankara, Türkiye) on the CF Open
          platform.
        </p>
        <ul>
          {eissn && <li>e-ISSN: {eissn}</li>}
          {s.printIssn && <li>Print ISSN: {s.printIssn}</li>}
          <li>Publisher: {publisher}</li>
          <li>Platform: CF Open (Open Journal Systems)</li>
        </ul>
      </>
    );
  },

  "open-access": (j, s) =>
    fromOjs(s.openAccessPolicy, (
    <>
      <p>
        <em>{j.name}</em> is a fully open access journal. All articles are freely
        available to read, download, and share immediately upon publication, with no
        embargo period and no subscription or registration requirement.
      </p>
      <p>
        Articles are published under the Creative Commons Attribution 4.0 International
        (CC BY 4.0) license. This license permits unrestricted use, distribution, and
        reproduction in any medium, provided the original work is properly cited. Authors
        retain copyright in their work.
      </p>
    </>
  )),

  readership: (j) => (
    <p>
      The journal primarily serves researchers, graduate students, educators, and
      practitioners working in {j.subjects.join(", ").toLowerCase()} and related fields,
      as well as policy makers and institutions that draw on evidence from these areas.
    </p>
  ),

  "subscription-information": (j) => (
    <p>
      <em>{j.name}</em> is an online-only, open access publication. No subscription is
      required: the full text of all articles is freely available on this site. For
      questions about institutional arrangements, please contact the editorial office.
    </p>
  ),

  "mass-media": (j) => (
    <p>
      Members of the press are welcome to report on articles published in{" "}
      <em>{j.name}</em>, provided the journal is cited as the source. For interview
      requests or press inquiries, please contact the editorial office.
    </p>
  ),

  disclaimer: (j) => (
    <p>
      The views and opinions expressed in articles published in <em>{j.name}</em> are
      those of the authors and do not necessarily reflect the views of the editors, the
      editorial board, or the publisher. The publisher and editors accept no
      responsibility for any use of the information contained in published articles.
    </p>
  ),

  "contact-us": (j, s) => {
    // Adres/telefon/e-posta OJS'te doluysa oradan gelir; boşsa merkez ofis bilgisi.
    const phone = s.contactPhone ?? "+90 850 303 37 19";
    const address = s.mailingAddress
      ? stripTags(s.mailingAddress).split("\n")
      : [
          "ASBÜ Sosyokent, Hacı Bayram Mah., Mahmut Atalay Sk. L Blok No: 6, İç Kapı No: 209",
          "06050 Altındağ, Ankara, Türkiye",
        ];
    return (
      <>
        <p>Editorial office of <em>{j.name}</em>:</p>
        <p>
          {s.contactName && (
            <>
              {s.contactName}
              <br />
            </>
          )}
          {s.contactAffiliation ? stripTags(s.contactAffiliation) : PUBLISHER}
          <br />
          {address.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
          {s.contactEmail && (
            <>
              E-mail: <a href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a>
              <br />
            </>
          )}
          Tel: <a href={`tel:${phone.replace(/[^+0-9]/g, "")}`}>{phone}</a>
          <br />
          Web:{" "}
          <a
            href={s.publisherUrl ?? "https://cfdanismanlik.com.tr/"}
            target="_blank"
            rel="noopener noreferrer"
          >
            {(s.publisherUrl ?? "https://cfdanismanlik.com.tr/").replace(/^https?:\/\/|\/$/g, "")}
          </a>
        </p>
      </>
    );
  },

  /* --------------------------- For authors and reviewers ------------------- */

  "instructions-for-authors": (j, s) =>
    fromOjs(s.authorGuidelines, (
    <>
      <h3>General requirements</h3>
      <ul>
        <li>
          Manuscripts must be original, must not have been published elsewhere, and must
          not be under consideration by another journal.
        </li>
        <li>Manuscripts must be written in English; submissions in other languages are not accepted.</li>
        <li>An ORCID iD is required for all authors at submission.</li>
      </ul>
      <h3>Article types</h3>
      <ul>
        <li>
          <strong>Original research article:</strong> up to 8,000 words (excluding
          references, tables, and figures).
        </li>
        <li>
          <strong>Review article:</strong> critical synthesis of the literature, up to
          10,000 words.
        </li>
        <li>
          <strong>Letter to the Editor:</strong> commentary on articles published in the
          journal or on current issues in the field, up to 1,500 words.
        </li>
      </ul>
      <h3>Manuscript preparation</h3>
      <p>
        The initial submission may be made in your own format, provided the main file is
        editable (DOCX or LaTeX); PDF-only submissions cannot be processed. Once the
        manuscript is returned for revision or accepted, the revised version must be
        prepared using the journal's article template:{" "}
        <a href="/templates/article-template.docx" download>
          download the article template (DOCX)
        </a>
        .
      </p>
      <ul>
        <li>Abstract of 130–150 words, followed by 3–5 keywords.</li>
        <li>Number all headings; cite every table and figure in the text.</li>
        <li>Prepare a separate anonymized version for double-blind review.</li>
      </ul>
      <h3>References — APA style</h3>
      <p>
        References must follow the Publication Manual of the American Psychological
        Association, 7th edition. In-text citations use the author–date format, e.g.
        (Yılmaz, 2024) or (Demir &amp; Kaya, 2023, p. 15). Include a DOI for every source
        that has one. Examples:
      </p>
      <ul>
        <li>
          Journal article: Author, A. A., &amp; Author, B. B. (2024). Title of the
          article. <em>Journal Name, 12</em>(3), 45–67. https://doi.org/xx.xxxx/xxxx
        </li>
        <li>
          Book: Author, C. C. (2022). <em>Title of the book</em> (2nd ed.). Publisher.
        </li>
        <li>
          Chapter: Author, D. D. (2023). Chapter title. In E. E. Editor (Ed.),{" "}
          <em>Book title</em> (pp. 101–120). Publisher.
        </li>
      </ul>
      <p>
        Submissions are made through the online system; see{" "}
        <a href={ojsSubmitUrl(j.ojsPath)} target="_blank" rel="noopener noreferrer">
          E-submission
        </a>
        .
      </p>
    </>
  )),

  "research-and-publication-ethics": (j) => (
    <>
      <p>
        <em>{j.name}</em> follows the guidelines of the Committee on Publication Ethics
        (COPE) at every stage of the publication process. The principles below are
        binding for authors, reviewers, and editors alike.
      </p>
      <h3>Research integrity</h3>
      <p>
        Fabrication, falsification, or selective reporting of data is a serious ethical
        violation and results in rejection or, if discovered after publication,
        retraction.
      </p>
      <h3>Plagiarism</h3>
      <p>
        All submissions are screened with similarity-detection software before review.
        Text, ideas, or findings of others must be properly attributed; this includes
        self-citation of the author's own earlier work.
      </p>
      <h3>Authorship</h3>
      <p>
        Only individuals who have made a substantial scholarly contribution should be
        listed as authors, and all authors must approve the final manuscript. Disputes
        over author order must be resolved before submission.
      </p>
      <h3>Ethics approval</h3>
      <p>
        Research involving human participants requires approval from an institutional
        ethics committee; the approval number and date must be stated in the manuscript.
        Informed consent must be obtained from all participants.
      </p>
      <h3>Conflicts of interest</h3>
      <p>
        Authors, reviewers, and editors must disclose any financial or personal
        relationships that could influence the evaluation of the work. Editors and
        reviewers with a conflict withdraw from the process.
      </p>
      <h3>Use of artificial intelligence</h3>
      <p>
        Generative AI tools may not be listed as authors. Any use of AI tools in the
        preparation of a manuscript must be transparently described in the methods or
        acknowledgements section.
      </p>
      <h3>Corrections and retractions</h3>
      <p>
        If a significant error or ethical breach is identified after publication, the
        journal publishes a correction (erratum) or retracts the article with a
        transparent notice that remains permanently accessible.
      </p>
      <p>
        To raise an ethical concern, contact the editorial office through{" "}
        <a href={ojsLoginUrl(j.ojsPath)} target="_blank" rel="noopener noreferrer">
          your account
        </a>
        . All reports are handled confidentially.
      </p>
    </>
  ),

  "editorial-policy": (j) => (
    <>
      <p>
        All submissions to <em>{j.name}</em> undergo double-blind peer review: the
        identities of authors and reviewers are mutually concealed throughout the
        process.
      </p>
      <ol>
        <li>
          <strong>Initial screening (≈1 week):</strong> the editor checks scope fit and
          formal requirements.
        </li>
        <li>
          <strong>Reviewer assignment:</strong> at least two independent experts are
          appointed.
        </li>
        <li>
          <strong>Review (≈4–6 weeks):</strong> originality, methodology, coherence of
          findings, and contribution are assessed.
        </li>
        <li>
          <strong>Decision:</strong> accept, minor revision, major revision, or reject,
          based on the reviewers' reports.
        </li>
        <li>
          <strong>Production:</strong> accepted articles are copy-edited, typeset, and
          published with a DOI.
        </li>
      </ol>
      <p>
        The average time to first decision is 6–8 weeks. Authors may appeal an editorial
        decision once, with a reasoned letter to the editorial office; the editor's
        decision following an appeal is final.
      </p>
    </>
  ),

  "for-reviewers": (j, s) =>
    fromOjs(s.reviewGuidelines, (
    <>
      <p>
        Reviewers safeguard the scholarly quality of <em>{j.name}</em>. Reviewers are
        expected to:
      </p>
      <ul>
        <li>provide objective, constructive, and timely evaluations;</li>
        <li>keep all information about the manuscript strictly confidential;</li>
        <li>not use the content of a manuscript under review for personal advantage;</li>
        <li>decline the assignment when a conflict of interest exists;</li>
        <li>
          point out relevant published work that is not cited, and flag suspected
          plagiarism or data problems to the editor.
        </li>
      </ul>
      <p>
        Reviews are conducted through the online system. Reviewer accounts are created at{" "}
        <a href={ojsLoginUrl(j.ojsPath)} target="_blank" rel="noopener noreferrer">
          the journal management system
        </a>
        .
      </p>
    </>
  )),

  "e-submission": (j) => (
    <p>
      Manuscripts are submitted through the journal's online submission system. Log in
      with your ORCID-linked account and follow the five-step submission wizard:{" "}
      <a href={ojsSubmitUrl(j.ojsPath)} target="_blank" rel="noopener noreferrer">
        go to e-submission
      </a>
      .
    </p>
  ),

  checklist: (j, s) =>
    fromOjs(s.submissionChecklist, (
    <>
      <p>Before submitting, please confirm that:</p>
      <ul>
        <li>the manuscript has not been published and is not under review elsewhere;</li>
        <li>
          the main manuscript file is editable (DOCX or LaTeX), not PDF only — the{" "}
          <a href="/templates/article-template.docx" download>
            article template
          </a>{" "}
          becomes mandatory at the revision stage;
        </li>
        <li>title page, abstract (130–150 words), and 3–5 keywords are included;</li>
        <li>an anonymized version is provided for double-blind review;</li>
        <li>references follow APA 7 and include DOIs where available;</li>
        <li>all tables and figures are cited in the text;</li>
        <li>ethics approval information is stated (if applicable);</li>
        <li>all authors' ORCID iDs are provided;</li>
        <li>a conflict of interest statement is included in the manuscript;</li>
        <li>
          the corresponding author accepts the CC BY 4.0 licensing terms on behalf of
          all authors when completing the submission.
        </li>
      </ul>
    </>
  )),

  "copyright-and-licensing": (j, s) =>
    fromOjs(s.copyrightNotice ?? s.licenseTerms, (
    <>
      <p>
        Authors retain copyright in articles published in <em>{j.name}</em>. By
        completing a submission, the corresponding author confirms on behalf of all
        authors that the work may be published under the Creative Commons Attribution
        4.0 International (CC BY 4.0) licence, granting the journal the right of first
        publication.
      </p>
      <p>
        This confirmation is given electronically in the submission system. No signed
        document is required and nothing needs to be printed, scanned or posted.
      </p>
    </>
  )),

  "conflict-of-interest": (j, s) =>
    fromOjs(s.competingInterests, (
    <>
      <p>
        Authors must disclose any financial support, employment, consultancy or personal
        relationship that could be seen to influence the work submitted to{" "}
        <em>{j.name}</em>. Where there is nothing to disclose, this should be stated
        explicitly.
      </p>
      <p>
        The declaration is made electronically during submission, by the corresponding
        author on behalf of all co-authors, and is repeated in the manuscript itself.
        There is no separate form to complete, sign or upload.
      </p>
    </>
  )),

  "article-processing-charge": (j) => (
    <p>
      <em>{j.name}</em> does not charge any fee at any stage of the publication process.
      There is no submission fee, no page charge, and no article processing charge; all
      publication costs are covered by the publisher.
    </p>
  ),
};

/* ------------------------- Dergiye özel override'lar ---------------------- */
// Örnek kullanım:
// "social-solutions": {
//   "editorial-board": (j) => <p>...</p>,
// },
const journalOverrides: Record<string, Partial<Record<string, ContentRenderer>>> = {};

/* --------------------------------- Erişim -------------------------------- */

export function getItemContent(
  journal: Journal,
  itemSlug: string,
  settings: OjsJournalSettings = {},
): ReactNode | null {
  const renderer =
    journalOverrides[journal.slug]?.[itemSlug] ?? sharedContent[itemSlug] ?? null;
  return renderer ? renderer(journal, settings) : null;
}
