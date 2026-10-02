import { personal } from '../../data/personal';
import Monolith from '../hero/Monolith';
import ContourArt from './ContourArt';

/**
 * The Personal hero: the Professional composition in the Personal inks (Monolith), with the
 * first name, where I am and the Personal sentence, and a contour drawing in the same circle,
 * so a switch keeps the circle where it is and the wipe swaps the code loop for the drawing.
 * The drawing is inline SVG, so there is nothing to fetch or decode before the wipe reveals it.
 */
export default function PersonalHero(): JSX.Element {
  return (
    <Monolith
      nameId="p-name"
      name={personal.firstName}
      lines={[personal.intro]}
      lede={personal.line}
      disc={<ContourArt alt={personal.art.alt} />}
    />
  );
}
