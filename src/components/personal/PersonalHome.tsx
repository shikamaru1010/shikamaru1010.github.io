import Brain from './Brain';
import Elsewhere from './Elsewhere';
import Now from './Now';
import OffScreen from './OffScreen';
import PersonalHero from './PersonalHero';
import Thought from './Thought';
import './personal.css';

/** Personal mode, in the order of its nav: first name and the drawing, now, a thought, side projects and where else to find me. */
export default function PersonalHome(): JSX.Element {
  return (
    <>
      <PersonalHero />
      <Now />
      <Thought />
      <Brain />
      <OffScreen />
      <Elsewhere />
    </>
  );
}
