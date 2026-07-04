import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function SectionHeader({ eyebrow, title, link, linkText }) {
  return (
    <div className="mx-auto mb-10 flex max-w-7xl flex-col justify-between gap-4 px-5 sm:px-8 md:flex-row md:items-end">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8C6B3C]">{eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-serif text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">{title}</h2>
      </div>
      {link && <Link to={link} className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-stone-950">{linkText}<Icon name="arrow" className="h-4 w-4" /></Link>}
    </div>
  );
}
