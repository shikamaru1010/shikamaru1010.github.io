import { site } from '../../data/site';

/** The visually hidden "(opens in a new tab)" after an external link's text. */
export default function NewTab(): JSX.Element {
  return <span className="sr-only"> {site.newTab}</span>;
}
