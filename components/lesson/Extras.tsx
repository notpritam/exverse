import type { Exercise } from "@/lib/types";

const H = (h: string) => ({ dangerouslySetInnerHTML: { __html: h } });

export default function Extras({
  takeaways,
  exercises,
}: {
  takeaways?: string[];
  exercises?: Exercise[];
}) {
  return (
    <>
      {takeaways && takeaways.length > 0 && (
        <div className="lz-takeaways">
          <h4>The load-bearing points</h4>
          <ul>
            {takeaways.map((t, i) => (
              <li key={i} {...H(t)} />
            ))}
          </ul>
        </div>
      )}

      {exercises && exercises.length > 0 && (
        <div className="lz-exers">
          <div className="h">
            <span className="i">↗</span> Try it yourself
          </div>
          {exercises.map((e, i) => (
            <div key={i} className="lz-exer">
              <p className="t">{e.t}</p>
              <p className="p" {...H(e.p)} />
              {e.hint && (
                <details>
                  <summary>Show the point</summary>
                  <p {...H(e.hint)} />
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
