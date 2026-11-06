import type { CvDoc } from '../../src/lib/cv';

/** The DOCX package parts, in zip order: [path, XML]. */
export function docxParts(d: CvDoc): Array<[string, string]>;
/** A reproducible ZIP of the parts, timestamped with `isoDate`. */
export function zip(files: Array<[string, string]>, isoDate: string): Buffer;
/** The CV as a .docx file (bytes). */
export function buildDocx(d: CvDoc): Buffer;
