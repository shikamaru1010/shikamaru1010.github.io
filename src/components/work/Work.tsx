import { clientProjects, smallerProjects, systemProjects } from '../../data/projects';
import { site } from '../../data/site';
import { capitalize, fill, numberWord } from '../../lib/format';
import ClientIndex from './ClientIndex';
import SmallerProjects from './SmallerProjects';
import Systems from './Systems';
import './work.css';

/** Work (SPEC §6.1.2): the client index with its plate, the systems with their figures, the smaller projects. */
export default function Work(): JSX.Element {
  const note = capitalize(
    fill(site.work.note, {
      clients: numberWord(clientProjects.length),
      systems: numberWord(systemProjects.length),
      smaller: numberWord(smallerProjects.length),
    }),
  );

  return (
    <section className="sec work" id="work" aria-labelledby="work-h">
      <div className="wrap">
        <header className="sec-head grid">
          <h2 className="h2" id="work-h">
            {site.work.heading}
          </h2>
          <p className="sec-note">{note}</p>
        </header>
        <ClientIndex />
        <Systems />
        <SmallerProjects />
      </div>
    </section>
  );
}
