// Sets a PDF's document information (Title, Author, Subject, Keywords) with an incremental update:
// the original bytes stay as they are, and a new Info object, a one-entry xref section and a
// trailer pointing back (/Prev) at the old one are appended. Chrome's PDFs use a classic xref
// table, which this relies on; anything else is refused rather than guessed at.

/** A PDF text string: UTF-16BE with a byte-order mark, as hex, so Š, ć and · survive. */
function pdfText(s) {
  const buf = Buffer.from(String(s), 'utf16le');
  for (let i = 0; i < buf.length; i += 2) [buf[i], buf[i + 1]] = [buf[i + 1], buf[i]];
  return `<FEFF${buf.toString('hex').toUpperCase()}>`;
}

/** 'D:YYYYMMDD000000Z' from an ISO date. */
const pdfDate = (iso) => `(D:${iso.replace(/-/g, '')}000000Z)`;

/**
 * @param {Buffer} pdf
 * @param {{ title: string, author: string, subject: string, keywords: string, creator: string, date: string }} info
 */
export function setPdfInfo(pdf, info) {
  const text = pdf.toString('latin1');
  const sx = text.lastIndexOf('startxref');
  const trailerAt = text.lastIndexOf('trailer', sx);
  if (sx < 0 || trailerAt < 0) throw new Error('setPdfInfo: no classic trailer (xref streams are not supported)');
  const prev = Number(/startxref\s+(\d+)/.exec(text.slice(sx))?.[1]);
  const dict = text.slice(trailerAt, sx);
  const size = Number(/\/Size\s+(\d+)/.exec(dict)?.[1]);
  const root = /\/Root\s+(\d+\s+\d+\s+R)/.exec(dict)?.[1];
  const id = /\/ID\s*(\[[^\]]*\])/.exec(dict)?.[1];
  if (!Number.isFinite(prev) || !Number.isFinite(size) || !root) throw new Error('setPdfInfo: unreadable trailer');

  const n = size;
  const body = `${pdf.at(-1) === 0x0a ? '' : '\n'}${n} 0 obj\n<< /Title ${pdfText(info.title)} /Author ${pdfText(info.author)} /Subject ${pdfText(info.subject)} /Keywords ${pdfText(info.keywords)} /Creator ${pdfText(info.creator)} /CreationDate ${pdfDate(info.date)} /ModDate ${pdfDate(info.date)} >>\nendobj\n`;
  const objOffset = pdf.length + (body.startsWith('\n') ? 1 : 0);
  const xrefOffset = pdf.length + Buffer.byteLength(body, 'latin1');
  const entry = `${String(objOffset).padStart(10, '0')} 00000 n\r\n`; // exactly 20 bytes
  const tail = `xref\n${n} 1\n${entry}trailer\n<< /Size ${n + 1} /Root ${root} /Info ${n} 0 R /Prev ${prev}${id ? ` /ID ${id}` : ''} >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.concat([pdf, Buffer.from(body + tail, 'latin1')]);
}

/** Reads the Info dictionary back (for the audit): the strings the last trailer's /Info points at. */
export function readPdfInfo(pdf) {
  const text = pdf.toString('latin1');
  const sx = text.lastIndexOf('startxref');
  const dict = text.slice(text.lastIndexOf('trailer', sx), sx);
  const ref = /\/Info\s+(\d+)\s+0\s+R/.exec(dict)?.[1];
  if (!ref) return {};
  const at = text.lastIndexOf(`\n${ref} 0 obj`);
  const obj = text.slice(at, text.indexOf('endobj', at));
  const out = {};
  for (const m of obj.matchAll(/\/(\w+)\s*(<[0-9A-Fa-f]*>|\([^)]*\))/g)) {
    const raw = m[2];
    if (raw.startsWith('<FEFF') || raw.startsWith('<feff')) {
      const b = Buffer.from(raw.slice(5, -1), 'hex');
      for (let i = 0; i < b.length; i += 2) [b[i], b[i + 1]] = [b[i + 1], b[i]];
      out[m[1]] = b.toString('utf16le');
    } else out[m[1]] = raw.slice(1, -1);
  }
  return out;
}
