import {
  ICAO_CRITERION_LABELS,
  ICAO_LEVEL_LABELS,
  type IcaoCriterion,
  type IcaoLevelRating,
} from "@/lib/evaluate/icaoLevel";

type Props = {
  rating: IcaoLevelRating;
};

const LEVEL_CLASS: Record<number, string> = {
  6: "icao-l6",
  5: "icao-l5",
  4: "icao-l4",
  3: "icao-l3",
  2: "icao-l2",
  1: "icao-l1",
};

export default function IcaoLevelPanel({ rating }: Props) {
  const info = ICAO_LEVEL_LABELS[rating.overall];
  const limitingLabel = ICAO_CRITERION_LABELS[rating.limiting];

  return (
    <div className="icao-level-panel">
      <div className={`icao-level-badge ${LEVEL_CLASS[rating.overall]}`}>
        <span className="icao-level-num">{rating.overall}</span>
        <div className="icao-level-meta">
          <strong>ICAO {info.title}</strong>
          <span>{info.short}</span>
        </div>
      </div>

      <p className="icao-level-note">
        Estimativa desta resposta · na prova real o nível = o <strong>menor</strong> dos 6 critérios.
        {rating.overall < 4 && " Meta para pilotos: nível 4 (Operational)."}
        {rating.overall >= 4 && rating.limiting && (
          <>
            {" "}
            Limitado por <strong>{limitingLabel}</strong>.
          </>
        )}
      </p>

      <ul className="icao-criteria-grid">
        {(Object.entries(rating.criteria) as [IcaoCriterion, number][]).map(([key, level]) => (
          <li key={key} className={`icao-criterion ${LEVEL_CLASS[level]}`}>
            <span className="icao-criterion-level">{level}</span>
            <span className="icao-criterion-label">{ICAO_CRITERION_LABELS[key]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
