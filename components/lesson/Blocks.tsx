import Image from "next/image";
import type { Block, Accent } from "@/lib/types";
import { imgSrc } from "@/lib/content";

const H = (h: string) => ({ dangerouslySetInnerHTML: { __html: h } });
const TAG: Record<Accent, string> = { model: "mental model", tool: "tool", verify: "verify", think: "thinking", tip: "tip" };
const markCell = (c: string) =>
  c.replace(/✓/g, '<span class="yes">✓</span>').replace(/✗/g, '<span class="no">✗</span>');

export default function Blocks({ blocks, courseSlug }: { blocks: Block[]; courseSlug: string }) {
  return (
    <div className="lesson font-serif text-[1.06rem] leading-[1.68] text-ink">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "lead":
            return <p key={i} className="lead" {...H(b.h)} />;
          case "p":
            return <p key={i} {...H(b.h)} />;
          case "callout":
            return (
              <div key={i} className={`lz-callout ${b.k}`}>
                <div className="h">
                  <span className="tag">{TAG[b.k]}</span>
                  {b.title}
                </div>
                <p {...H(b.h)} />
              </div>
            );
          case "quote":
            return (
              <blockquote key={i} className="lz-quote">
                <p className="txt">“{<span {...H(b.h)} />}”</p>
                <div className="src">
                  <span className="who">Andrej Karpathy</span>
                  <span>·</span>
                  <span className="ts">{b.ts}</span>
                </div>
              </blockquote>
            );
          case "fig":
            return (
              <figure key={i} className="lz-fig">
                <div className="lz-chrome">
                  <div className="bar">
                    <span className="d" /> <span className="d" /> <span className="d" />
                    <span className="url">{b.url}</span>
                  </div>
                  <Image
                    src={imgSrc(courseSlug, b.src)}
                    alt={b.alt || ""}
                    width={1920}
                    height={776}
                    sizes="(max-width: 800px) 100vw, 760px"
                    className="block h-auto w-full"
                  />
                </div>
                {b.cap && <figcaption {...H(b.cap)} />}
              </figure>
            );
          case "steps":
            return (
              <div key={i} className="lz-steps">
                {b.title && <div className="h">{b.title}</div>}
                <ol>
                  {b.items.map((it, k) => (
                    <li key={k} {...H(it)} />
                  ))}
                </ol>
              </div>
            );
          case "list":
            return (
              <ul key={i} className="lz-list">
                {b.items.map((it, k) => (
                  <li key={k} {...H(it)} />
                ))}
              </ul>
            );
          case "code":
            return (
              <div key={i} className="lz-code">
                <div className="bar">
                  <span className="d" /> <span className="d" /> <span className="d" />
                  <span className="f">{b.file}</span>
                </div>
                <pre>
                  <code {...H(b.h)} />
                </pre>
              </div>
            );
          case "table":
            return (
              <div key={i} className="lz-table">
                <table>
                  <thead>
                    <tr>
                      {b.head.map((h, k) => (
                        <th key={k}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, k) => (
                      <tr key={k}>
                        {r.map((c, j) => (
                          <td key={j} {...H(markCell(c))} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
