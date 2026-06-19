import { Link } from "react-router-dom";
import { PageHero } from "../components/Hero";
import Icon from "../components/Icon";
import { posts } from "../data";

export default function Blog() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Notes from the studio." text="Material guides, designer interviews, and practical ideas for rooms that feel deeply considered." image="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1500&q=85" />
      <section className="section bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-3">
          {posts.map(([title, text]) => (
            <article key={title} className="rounded-3xl border border-stone-200 bg-[#fbfaf7] p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9c6f32]">Journal</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold">{title}</h2>
              <p className="mt-4 leading-7 text-stone-600">{text}</p>
              <Link className="mt-6 inline-flex items-center gap-2 text-sm font-semibold" to="/blog">Read article <Icon name="arrow" className="h-4 w-4" /></Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
