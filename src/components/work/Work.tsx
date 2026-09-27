import { site } from '../../data/site';
import ClientIndex from './ClientIndex';
import SmallerProjects from './SmallerProjects';
import Systems from './Systems';
import './work.css';

/** Work: the client index with its plate, the systems of my own, the smaller projects. */
export default function Work(): JSX.Element {
  return (
    <section className="sec work" id="work" aria-labelledby="work-h">
      <div className="wrap">
        <header className="sec-head grid">
          <h2 className="h2" id="work-h">
            {site.work.heading}
          </h2>
        </header>
        <ClientIndex />
        <Systems />
        <SmallerProjects />
      </div>
    </section>
  );
}
