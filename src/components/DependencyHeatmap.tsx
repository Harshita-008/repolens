interface HeatmapItem {
  path: string;
  score: number;
}

export default function DependencyHeatmap({
  data,
}: {
  data: HeatmapItem[];
}) {
  const maxScore = Math.max(
    ...data.map((item) => item.score)
  );

  return (
    <section className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            Dependency Heatmap
          </h2>

          <p className="text-zinc-400 text-sm mt-1">
            Most interconnected files in the repository
          </p>
        </div>

        <div className="text-xs text-zinc-500">
          Top 10 Files
        </div>
      </div>

      <div className="space-y-5">
        {data.map((item, index) => {
          const width =
            (item.score / maxScore) * 100;

          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-zinc-300 truncate max-w-[85%]">
                  {item.path
                    .replace(
                      /^.*repos\\[^\\]+\\/,
                      ""
                    )
                    .replaceAll("\\", "/")}
                </p>

                <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {item.score} imports
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 transition-all duration-700"
                  style={{
                    width: `${width}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}