import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Empty } from "./UI";
export interface Point {
  name: string;
  value: number;
}
export function Chart({
  title,
  data,
  kind = "bar",
  description,
}: {
  title: string;
  data: Point[];
  kind?: "bar" | "area" | "pie";
  description?: string;
}) {
  return (
    <section className="panel chart">
      <h3>{title}</h3>
      {description && <p className="muted">{description}</p>}
      {!data.length || !data.some((x) => x.value) ? (
        <Empty />
      ) : (
        <>
          <div
            role="img"
            aria-label={`${title}: ${data.map((d) => `${d.name}: ${d.value}`).join("; ")}`}
            className="chart-box"
          >
            <ResponsiveContainer width="100%" height="100%">
              {kind === "pie" ? (
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={56}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {data.map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          ["#005035", "#A49665", "#a7bab0", "#4f8070"][i % 4]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : kind === "area" ? (
                <AreaChart
                  data={data}
                  margin={{ left: -20, right: 15, top: 10, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} stroke="#e5ebe7" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#005035"
                    fill="#dbe9df"
                    strokeWidth={3}
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={data}
                  margin={{ left: -20, right: 15, top: 10, bottom: 25 }}
                >
                  <CartesianGrid vertical={false} stroke="#e5ebe7" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-10}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#005035" radius={[3, 3, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          {kind === "pie" && (
            <div className="legend">
              {data.map((d) => (
                <span key={d.name}>
                  {d.name}: <b>{d.value}</b>
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
