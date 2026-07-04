import {
  STUDY_ACTIVITY_POINTS,
  STUDY_DAILY_GOAL_POINTS,
  STUDY_INTENSE_DAY_POINTS,
  studyActivityPoints,
  studyDayPoints,
  todayKey,
  type StudyActivity,
  type StudyDayRecord,
  type StudyPlanMode,
  loadStudyPlanMode,
  saveStudyPlanMode,
  studyPlanGoalPoints,
  STUDY_PLAN_CHANGE_EVENT,
} from "@/lib/studyTime";

export type { StudyPlanMode };
export { STUDY_PLAN_CHANGE_EVENT, loadStudyPlanMode, saveStudyPlanMode };

export type StudyAgendaLinkTarget =
  | "part1-shadow"
  | "part2-readback-shadow"
  | "part2-readback"
  | "part2-interaction"
  | "part2-any"
  | "part2-simulation"
  | "pronunciation"
  | "vocabulary";

export type StudyAgendaTask = {
  id: string;
  activity: StudyActivity;
  targetCount: number;
  title: string;
  hint: string;
  linkTarget: StudyAgendaLinkTarget;
  points: number;
};

export type StudyAgendaDay = {
  date: string;
  weekday: number;
  title: string;
  subtitle: string;
  tasks: StudyAgendaTask[];
  goalPoints: number;
  estimatedPoints: number;
  mode: StudyPlanMode;
};

const WEEKDAY_NAMES = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const INTENSE_RATIO = STUDY_INTENSE_DAY_POINTS / STUDY_DAILY_GOAL_POINTS;

function task(
  id: string,
  activity: StudyActivity,
  targetCount: number,
  title: string,
  hint: string,
  linkTarget: StudyAgendaLinkTarget,
): StudyAgendaTask {
  return {
    id,
    activity,
    targetCount,
    title,
    hint,
    linkTarget,
    points: studyActivityPoints(activity, targetCount),
  };
}

const WEEKDAY_PLANS: Record<number, Omit<StudyAgendaDay, "date" | "weekday" | "mode" | "goalPoints">> = {
  0: {
    title: "Domingo — shadow e revisão",
    subtitle: "Sem simulado — shadow, vocabulário e pronúncia",
    tasks: [
      task("sun-p1", "shadow", 6, "6 blocos Shadow PEEL (Part 1)", "Abra perguntas e treine bloco a bloco", "part1-shadow"),
      task("sun-p2", "shadowPart2", 3, "3 situações Part 2", "Readback com áudio ATC", "part2-readback-shadow"),
      task("sun-vocab", "vocabulary", 3, "3 termos de vocabulário", "Trainer ou shadowing de termos", "vocabulary"),
      task("sun-pron", "pronunciation", 2, "2 palavras no banco", "Corrija pronúncia fraca", "pronunciation"),
    ],
    estimatedPoints: 20,
  },
  1: {
    title: "Segunda — Part 1 + readback",
    subtitle: "PEEL, Part 2 e pronúncia",
    tasks: [
      task("mon-p1", "shadow", 8, "8 blocos Shadow PEEL (Part 1)", "Priorize perguntas difíceis", "part1-shadow"),
      task("mon-p2", "shadowPart2", 3, "3 readbacks Part 2", "Shadow readback com Azure", "part2-readback-shadow"),
      task("mon-pron", "pronunciation", 2, "2 palavras no banco", "Palavras que mais erram", "pronunciation"),
    ],
    estimatedPoints: 20,
  },
  2: {
    title: "Terça — vocabulário + shadow",
    subtitle: "Termos ICAO + PEEL + Part 2",
    tasks: [
      task("tue-vocab", "vocabulary", 4, "4 termos de vocabulário", "Priorize os vencidos no SRS", "vocabulary"),
      task("tue-p1", "shadow", 6, "6 blocos Shadow PEEL", "Conectores e entonação", "part1-shadow"),
      task("tue-p2", "shadowPart2", 2, "2 situações Part 2", "Interaction ou readback", "part2-interaction"),
      task("tue-pron", "pronunciation", 2, "2 palavras no banco", "Repetir até melhorar", "pronunciation"),
    ],
    estimatedPoints: 20,
  },
  3: {
    title: "Quarta — Part 2 intenso",
    subtitle: "Interaction, reported speech e PEEL",
    tasks: [
      task("wed-p2", "shadowPart2", 5, "5 situações Part 2", "Coach de voz em cada situação", "part2-interaction"),
      task("wed-p1", "shadow", 6, "6 blocos Shadow PEEL", "Manter Part 1 ativo", "part1-shadow"),
      task("wed-pron", "pronunciation", 2, "2 palavras no banco", "Antes de gravar no Part 2", "pronunciation"),
    ],
    estimatedPoints: 22,
  },
  4: {
    title: "Quinta — PEEL profundo",
    subtitle: "Muitos blocos Part 1 + Part 2",
    tasks: [
      task("thu-p1", "shadow", 10, "10 blocos Shadow PEEL", "Uma ou duas perguntas completas", "part1-shadow"),
      task("thu-p2", "shadowPart2", 3, "3 situações Part 2", "Shadow readback com áudio original", "part2-readback-shadow"),
      task("thu-vocab", "vocabulary", 2, "2 termos de vocabulário", "Revisão espaçada", "vocabulary"),
    ],
    estimatedPoints: 20,
  },
  5: {
    title: "Sexta — misto da semana",
    subtitle: "Revisar o que mais custou",
    tasks: [
      task("fri-vocab", "vocabulary", 4, "4 termos de vocabulário", "SRS — termos da sua prova", "vocabulary"),
      task("fri-p1", "shadow", 6, "6 blocos Shadow PEEL", "Blocos que ainda falham", "part1-shadow"),
      task("fri-p2", "shadowPart2", 2, "2 situações Part 2", "Readback ou interaction", "part2-any"),
      task("fri-pron", "pronunciation", 2, "2 palavras no banco", "Fechar a semana", "pronunciation"),
    ],
    estimatedPoints: 20,
  },
  6: {
    title: "Sábado — shadow leve",
    subtitle: "Recuperação sem simulado",
    tasks: [
      task("sat-p1", "shadow", 6, "6 blocos Shadow PEEL", "Só shadow — sem simulado", "part1-shadow"),
      task("sat-p2", "shadowPart2", 3, "3 situações Part 2", "Shadow readback devagar", "part2-readback-shadow"),
      task("sat-vocab", "vocabulary", 2, "2 termos de vocabulário", "Shadowing relaxado", "vocabulary"),
      task("sat-pron", "pronunciation", 1, "1 palavra no banco", "Uma palavra bem feita", "pronunciation"),
    ],
    estimatedPoints: 19,
  },
};

function scaleTasksForMode(tasks: StudyAgendaTask[], mode: StudyPlanMode): StudyAgendaTask[] {
  if (mode === "standard") return tasks;
  const scaled = tasks.map((t) => {
    const targetCount = Math.max(t.targetCount, Math.ceil(t.targetCount * INTENSE_RATIO));
    return {
      ...t,
      targetCount,
      points: studyActivityPoints(t.activity, targetCount),
    };
  });
  // Dia bom: always include at least one full simulation.
  if (!scaled.some((t) => t.activity === "simulate")) {
    scaled.push(
      task(
        "intense-sim",
        "simulate",
        1,
        "1 simulado completo",
        "Part 2 full sim ou Simulado ICAO",
        "part2-simulation",
      ),
    );
  }
  return scaled;
}

function agendaPointsFromTasks(tasks: StudyAgendaTask[]): number {
  return tasks.reduce((sum, t) => sum + t.points, 0);
}

export function buildStudyAgenda(date = todayKey(), mode = loadStudyPlanMode()): StudyAgendaDay {
  const weekday = weekdayFromKey(date);
  const plan = WEEKDAY_PLANS[weekday];
  const tasks = scaleTasksForMode(plan.tasks, mode);
  const goalPoints = studyPlanGoalPoints(mode);

  return {
    date,
    weekday,
    mode,
    title: mode === "intense" ? `${plan.title} — dia bom` : plan.title,
    subtitle:
      mode === "intense"
        ? `Meta ${STUDY_INTENSE_DAY_POINTS} pts — mais repetições`
        : plan.subtitle,
    tasks,
    goalPoints,
    estimatedPoints: agendaPointsFromTasks(tasks),
  };
}

export function dateFromKey(key: string): Date {
  return new Date(`${key}T12:00:00`);
}

export function weekdayFromKey(key: string): number {
  return dateFromKey(key).getDay();
}

export function isAgendaTaskDone(task: StudyAgendaTask, day: StudyDayRecord): boolean {
  return day[task.activity] >= task.targetCount;
}

export function agendaTaskProgress(task: StudyAgendaTask, day: StudyDayRecord): {
  done: number;
  target: number;
  complete: boolean;
} {
  const done = Math.min(day[task.activity], task.targetCount);
  return {
    done,
    target: task.targetCount,
    complete: done >= task.targetCount,
  };
}

export type StudyAgendaProgress = {
  tasksDone: number;
  tasksTotal: number;
  pointsEarned: number;
  goalPoints: number;
  globalPoints: number;
  globalGoal: number;
  globalGoalMet: boolean;
  agendaComplete: boolean;
  estimatedPoints: number;
  remainingPoints: number;
};

export function getAgendaProgress(
  agenda: StudyAgendaDay,
  day: StudyDayRecord,
): StudyAgendaProgress {
  const tasksDone = agenda.tasks.filter((t) => isAgendaTaskDone(t, day)).length;
  const pointsEarned = agenda.tasks.reduce(
    (sum, t) =>
      sum + studyActivityPoints(t.activity, Math.min(day[t.activity], t.targetCount)),
    0,
  );
  const globalPoints = studyDayPoints(day);
  const donePoints = agenda.tasks
    .filter((t) => isAgendaTaskDone(t, day))
    .reduce((sum, t) => sum + t.points, 0);

  return {
    tasksDone,
    tasksTotal: agenda.tasks.length,
    pointsEarned,
    goalPoints: agenda.goalPoints,
    globalPoints,
    globalGoal: agenda.goalPoints,
    globalGoalMet: globalPoints >= agenda.goalPoints,
    agendaComplete: tasksDone === agenda.tasks.length,
    estimatedPoints: agenda.estimatedPoints,
    remainingPoints: Math.max(0, agenda.estimatedPoints - donePoints),
  };
}

export type StudyWeekPreview = {
  date: string;
  weekdayLabel: string;
  title: string;
  goalPoints: number;
  isToday: boolean;
};

export function buildWeekPreview(fromDate = todayKey(), mode = loadStudyPlanMode()): StudyWeekPreview[] {
  const start = dateFromKey(fromDate);
  const dayOfWeek = start.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(start);
  monday.setDate(start.getDate() + mondayOffset);

  const items: StudyWeekPreview[] = [];
  for (let i = 0; i < 7; i += 1) {
    const cursor = new Date(monday);
    cursor.setDate(monday.getDate() + i);
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    const agenda = buildStudyAgenda(key, mode);
    items.push({
      date: key,
      weekdayLabel: WEEKDAY_NAMES[cursor.getDay()].slice(0, 3),
      title: agenda.title.split("—")[1]?.trim() ?? agenda.title,
      goalPoints: agenda.goalPoints,
      isToday: key === fromDate,
    });
  }
  return items;
}

export function activityPointLabel(activity: StudyActivity): string {
  const pts = STUDY_ACTIVITY_POINTS[activity];
  return `${pts} pt${pts > 1 ? "s" : ""}`;
}
