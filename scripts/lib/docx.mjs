// The CV as a Word document, from the same structure as every other format (src/lib/cv.ts).
// Plain OOXML written by hand and zipped with Node's zlib: no dependency, and the same input
// always gives the same bytes (fixed timestamps), so cv.test.ts can compare the committed file.
// Built for parsers first: one column, real Word headings and bullets, text in the body (nothing
// in headers, footers, text boxes or tables), dates on the title line after a right tab.
import { crc32, deflateRawSync } from 'node:zlib';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// A4, 18 mm top/bottom and 20 mm side margins; the text column is 170 mm (9638 twips).
const TEXT_WIDTH = 9638;

/** @param {import('../../src/lib/cv.ts').CvDoc} d */
export function docxParts(d) {
  const rels = []; // hyperlinks: rId3… (rId1 styles, rId2 numbering)
  const link = (l) => {
    if (!l.href) return run(l.text);
    const id = `rId${rels.length + 3}`;
    rels.push(`<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${esc(l.href)}" TargetMode="External"/>`);
    return `<w:hyperlink r:id="${id}">${run(l.text, '<w:rStyle w:val="Hyperlink"/>')}</w:hyperlink>`;
  };
  const run = (text, rPr = '') => `<w:r>${rPr ? `<w:rPr>${rPr}</w:rPr>` : ''}<w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
  const para = (style, content, pPr = '') => `<w:p><w:pPr><w:pStyle w:val="${style}"/>${pPr}</w:pPr>${content}</w:p>`;
  const sep = run(' · ', '<w:color w:val="6B6964"/>');
  const bullet = (text) => para('ListBullet', run(text), '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>');
  const entryHead = (e) =>
    para('Heading2', `${run(e.title)}${e.org ? run(` · ${e.org}`, '<w:b w:val="0"/>') : ''}<w:r><w:tab/></w:r>${run(e.when, '<w:b w:val="0"/><w:color w:val="4A4843"/>')}`,
      `<w:tabs><w:tab w:val="right" w:pos="${TEXT_WIDTH}"/></w:tabs>`);
  const entryMeta = (e) => {
    const bits = [e.detail && run(e.detail), e.link && link(e.link)].filter(Boolean);
    return bits.length ? para('Meta', bits.join(sep)) : '';
  };
  const entry = (e) => entryHead(e) + entryMeta(e) + e.points.map(bullet).join('');

  const body = [
    para('Title', run(d.name)),
    para('Subtitle', run(d.title)),
    para('Contact', d.contact.map(link).join(sep)),
    para('Heading1', run(d.headings.summary)),
    para('Normal', run(d.summary)),
    para('Heading1', run(d.headings.skills)),
    ...d.skills.map((g) => para('Skill', `${run(`${g.label}: `, '<w:b/>')}${run(g.items.join(', '))}`)),
    para('Heading1', run(d.headings.experience)),
    ...d.experience.map(entry),
    para('Heading1', run(d.headings.projects)),
    ...d.projects.map(entry),
    para('Heading1', run(d.headings.education)),
    entryHead({ title: d.education.degree, when: d.education.when }),
    para('Meta', `${run(d.education.school)}${sep}${run(d.education.status)}`),
    para('Normal', `${run('Relevant coursework: ', '<w:b/>')}${run(`${d.education.coursework}.`)}`),
    para('Heading1', run(d.headings.languages)),
    para('Normal', run(d.languages.join(' · '))),
  ].join('');

  const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
  const R = 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
  const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document ${W} ${R}><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1021" w:right="1134" w:bottom="1021" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>`;

  const style = (id, name, { type = 'paragraph', pPr = '', rPr = '', basedOn = 'Normal', extra = '' } = {}) =>
    `<w:style w:type="${type}" w:styleId="${id}"><w:name w:val="${name}"/>${basedOn ? `<w:basedOn w:val="${basedOn}"/>` : ''}${extra}${pPr ? `<w:pPr>${pPr}</w:pPr>` : ''}${rPr ? `<w:rPr>${rPr}</w:rPr>` : ''}</w:style>`;
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles ${W}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Calibri" w:cs="Calibri"/><w:sz w:val="20"/><w:szCs w:val="20"/><w:color w:val="111110"/><w:lang w:val="en-GB"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="40" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
${style('Normal', 'Normal', { basedOn: '', extra: '<w:qFormat/>' })}
${style('Title', 'Title', { extra: '<w:qFormat/>', pPr: '<w:spacing w:after="0"/>', rPr: '<w:b/><w:sz w:val="40"/><w:szCs w:val="40"/>' })}
${style('Subtitle', 'Subtitle', { extra: '<w:qFormat/>', pPr: '<w:spacing w:after="40"/>', rPr: '<w:sz w:val="22"/><w:szCs w:val="22"/><w:color w:val="4A4843"/>' })}
${style('Contact', 'Contact', { pPr: '<w:spacing w:after="120"/>', rPr: '<w:sz w:val="19"/><w:szCs w:val="19"/>' })}
${style('Heading1', 'heading 1', { extra: '<w:next w:val="Normal"/><w:qFormat/>', pPr: '<w:keepNext/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="111110"/></w:pBdr><w:spacing w:before="160" w:after="60"/><w:outlineLvl w:val="0"/>', rPr: '<w:b/><w:caps/><w:spacing w:val="10"/><w:sz w:val="21"/><w:szCs w:val="21"/>' })}
${style('Heading2', 'heading 2', { extra: '<w:next w:val="Normal"/><w:qFormat/>', pPr: '<w:keepNext/><w:spacing w:before="100" w:after="0"/><w:outlineLvl w:val="1"/>', rPr: '<w:b/><w:sz w:val="21"/><w:szCs w:val="21"/>' })}
${style('Meta', 'CV meta', { pPr: '<w:keepNext/><w:spacing w:after="20"/>', rPr: '<w:sz w:val="19"/><w:szCs w:val="19"/><w:color w:val="4A4843"/>' })}
${style('Skill', 'CV skill line', { pPr: '<w:spacing w:after="20"/>' })}
${style('ListBullet', 'List Bullet', { pPr: '<w:spacing w:after="20"/><w:ind w:left="284" w:hanging="227"/>' })}
${style('Hyperlink', 'Hyperlink', { type: 'character', basedOn: '', rPr: '<w:color w:val="111110"/><w:u w:val="single"/>' })}
</w:styles>`;

  const numbering = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering ${W}><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="284" w:hanging="227"/></w:pPr><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;

  const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>${rels.join('')}</Relationships>`;

  const when = `${d.meta.updated}T00:00:00Z`;
  const core = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${esc(`${d.name} – CV`)}</dc:title><dc:subject>${esc(d.meta.subject)}</dc:subject><dc:creator>${esc(d.name)}</dc:creator><cp:keywords>${esc(d.meta.keywords.join(', '))}</cp:keywords><dc:language>en-GB</dc:language><dcterms:created xsi:type="dcterms:W3CDTF">${when}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${when}</dcterms:modified></cp:coreProperties>`;
  const app = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>shikamaru1010.github.io export-cv</Application></Properties>`;
  const types = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`;
  const pkgRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`;

  return [
    ['[Content_Types].xml', types],
    ['_rels/.rels', pkgRels],
    ['docProps/core.xml', core],
    ['docProps/app.xml', app],
    ['word/document.xml', document],
    ['word/styles.xml', styles],
    ['word/numbering.xml', numbering],
    ['word/_rels/document.xml.rels', docRels],
  ];
}

/** A minimal ZIP (deflate, no ZIP64) with one fixed timestamp, so the output is reproducible. */
export function zip(files, isoDate) {
  const [y, m, day] = isoDate.split('-').map(Number);
  const dosDate = ((y - 1980) << 9) | (m << 5) | day;
  const dosTime = 0;
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const [name, content] of files) {
    const nameBuf = Buffer.from(name, 'utf8');
    const data = Buffer.from(content, 'utf8');
    const packed = deflateRawSync(data, { level: 9 });
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8 names
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(packed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, nameBuf, packed);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(dosTime, 12);
    central.writeUInt16LE(dosDate, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(packed.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBuf);
    offset += local.length + nameBuf.length + packed.length;
  }
  const cd = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(cd.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, cd, end]);
}

export function buildDocx(d) {
  return zip(docxParts(d), d.meta.updated);
}
