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
import type { Journal } from "@/lib/journals";
import { OJS_LOGIN_URL, OJS_SUBMIT_URL } from "@/lib/ojs";

export type ContentRenderer = (j: Journal) => ReactNode;

/* ------------------------------ Ortak içerik ------------------------------ */

const sharedContent: Record<string, ContentRenderer> = {
  /* --------------------------------- About -------------------------------- */

  "aims-and-scope": (j) => (
    <>
      <p>{j.scope}</p>
      <p>
        The journal welcomes original research articles, review articles, and letters to
        the editor in the following subject areas: {j.subjects.join(", ")}. Work that
        crosses disciplinary boundaries and speaks to both researchers and practitioners
        is particularly encouraged.
      </p>
    </>
  ),

  "about-the-journal": (j) => (
    <>
      <p>
        <em>{j.name}</em> ({j.shortName}) is a peer-reviewed, open access journal
        published on CF Open, the academic publishing platform of CF Education and
        Consulting. The language of publication is English.
      </p>
      <ul>
        {j.issn && <li>Print ISSN: {j.issn}</li>}
        {j.eissn && <li>Online ISSN: {j.eissn}</li>}
        <li>Publication frequency: two issues per year (June and December)</li>
        <li>Peer review model: double-blind</li>
        <li>Access: immediate open access under the CC BY 4.0 license</li>
        <li>Article processing charge: none</li>
      </ul>
    </>
  ),

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

  "editorial-board": (j) => (
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

  "journal-management-team": (j) => (
    <p>
      The management team of <em>{j.name}</em> will be announced before the first issue
      is published.
    </p>
  ),

  "publishing-credentials": (j) => (
    <>
      <p>
        <em>{j.name}</em> is published by CF Education and Consulting (Ankara, Türkiye)
        on the CF Open platform.
      </p>
      <ul>
        {j.issn && <li>Print ISSN: {j.issn}</li>}
        {j.eissn && <li>Online ISSN: {j.eissn}</li>}
        <li>Publisher: CF Education and Consulting</li>
        <li>Platform: CF Open (Open Journal Systems)</li>
      </ul>
    </>
  ),

  "open-access": (j) => (
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
  ),

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

  "contact-us": (j) => (
    <>
      <p>Editorial office of <em>{j.name}</em>:</p>
      <p>
        CF Education and Consulting
        <br />
        ASBU Sosyokent No: 209
        <br />
        Altındağ, Ankara, Türkiye
        <br />
        Tel: <a href="tel:+908503033719">+90 850 303 37 19</a>
        <br />
        Web:{" "}
        <a href="https://cfdanismanlik.com.tr/" target="_blank" rel="noopener noreferrer">
          cfdanismanlik.com.tr
        </a>
      </p>
    </>
  ),

  /* --------------------------- For authors and reviewers ------------------- */

  "instructions-for-authors": (j) => (
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
        Prepare your manuscript using the journal's article template:{" "}
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
        <a href={OJS_SUBMIT_URL} target="_blank" rel="noopener noreferrer">
          E-submission
        </a>
        .
      </p>
    </>
  ),

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
        <a href={OJS_LOGIN_URL} target="_blank" rel="noopener noreferrer">
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

  "for-reviewers": (j) => (
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
        <a href={OJS_LOGIN_URL} target="_blank" rel="noopener noreferrer">
          the journal management system
        </a>
        .
      </p>
    </>
  ),

  "e-submission": (j) => (
    <p>
      Manuscripts are submitted through the journal's online submission system. Log in
      with your ORCID-linked account and follow the five-step submission wizard:{" "}
      <a href={OJS_SUBMIT_URL} target="_blank" rel="noopener noreferrer">
        go to e-submission
      </a>
      .
    </p>
  ),

  checklist: (j) => (
    <>
      <p>Before submitting, please confirm that:</p>
      <ul>
        <li>the manuscript has not been published and is not under review elsewhere;</li>
        <li>
          the manuscript is prepared with the journal's{" "}
          <a href="/templates/article-template.docx" download>
            article template
          </a>
          ;
        </li>
        <li>title page, abstract (130–150 words), and 3–5 keywords are included;</li>
        <li>an anonymized version is provided for double-blind review;</li>
        <li>references follow APA 7 and include DOIs where available;</li>
        <li>all tables and figures are cited in the text;</li>
        <li>ethics approval information is stated (if applicable);</li>
        <li>all authors' ORCID iDs are provided;</li>
        <li>the conflict of interest statement is completed;</li>
        <li>the copyright/licensing form is signed by the corresponding author.</li>
      </ul>
    </>
  ),

  "copyright-transfer-agreement": (j) => (
    <>
      <p>
        Authors retain copyright in articles published in <em>{j.name}</em>. Upon
        acceptance, the corresponding author signs a publishing agreement granting the
        journal the right of first publication under the CC BY 4.0 license. The signed
        form is uploaded through the online submission system during the final
        submission step.
      </p>
    </>
  ),

  "conflict-of-interest-form": (j) => (
    <p>
      All authors must complete a conflict of interest disclosure covering financial
      support, employment, consultancies, and personal relationships relevant to the
      submitted work. The disclosure form is completed within the online submission
      system; the corresponding author is responsible for submitting it on behalf of all
      co-authors.
    </p>
  ),

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

export function getItemContent(journal: Journal, itemSlug: string): ReactNode | null {
  const renderer =
    journalOverrides[journal.slug]?.[itemSlug] ?? sharedContent[itemSlug] ?? null;
  return renderer ? renderer(journal) : null;
}
