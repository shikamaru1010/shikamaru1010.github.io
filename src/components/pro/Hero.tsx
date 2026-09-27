import { education, experience } from '../../data/experience';
import { profile } from '../../data/profile';
import { site } from '../../data/site';
import { fill, ordinal } from '../../lib/format';
import Monolith from '../hero/Monolith';
import CodeLoop from './CodeLoop';

const H = site.hero;
const now = experience[0];

/**
 * The Professional hero: the name, what and where, the current role and the year of study;
 * one sentence and View CV; the circle holds the code loop.
 */
export default function Hero(): JSX.Element {
  return (
    <Monolith
      nameId="name"
      name={profile.name}
      lines={[
        fill(H.role, { role: profile.role, city: profile.city }),
        <>
          <span className="nw">{fill(H.now, { role: now.roleShort ?? now.role, org: now.org })}</span>
          <span aria-hidden="true">&nbsp;· </span>
          <span className="sr-only">, </span>
          <span className="nw">{fill(H.study, { school: education.short, ordinal: ordinal(education.year) })}</span>
        </>,
      ]}
      lede={profile.lede}
      action={
        <a className="mono-cv" href="#resume">
          {H.viewCv}
          <span aria-hidden="true">&nbsp;→</span>
        </a>
      }
      disc={<CodeLoop />}
      decorative
    />
  );
}
