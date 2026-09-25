import { site } from '../../data/site';
import Clients from './Clients';
import SmallerProjects from './SmallerProjects';
import Systems from './Systems';
import './work.css';

/** Work (SPEC §6.1.2): the client sites with their screenshots, the systems with their figures, the smaller projects. */
export default function Work(): JSX.Element {
  return (
    <section className="sec work" id="work" aria-labelledby="work-h">
      <div className="wrap">
        <header className="sec-head grid">
          <h2 className="h2" id="work-h">
            {site.work.heading}
          </h2>
        </header>
        <Clients />
        <Systems />
        <SmallerProjects />
      </div>
    </section>
  );
}
