import {
  SIMULATE_PART2_UNITS,
  STUDY_ACTIVITY_POINTS,
  STUDY_DAILY_GOAL_POINTS,
  studyActivityPoints,
  studyDayPoints,
  todayKey,
  type StudyActivity,
  type StudyDayRecord,
} from "@/lib/studyTime";

export type StudyPlanMode = "standard" | "light";

export type StudyAgendaTask = {
  id: string;
  activity: StudyActivity;
  targetCount: number;
  title: string;
  hint: string;
  href: string;
  minutes: number;
};

export type StudyAgendaDay = {
  date: string;
  weekday: number;
  title: string;
  subtitle: string;
  tasks: StudyAgendaTask[];
  goalPoints: number;
  estimatedMinutes: number;
  mode: StudyPlanMode;
};

export const STUDY_PLAN_CHANGE_EVENT = "icao-study-plan-change";

const PLAN_MODE_KEY = "icao_study_plan_mode_v1";

const WEEKDAY_NAMES = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

function task(
  id: string,
  activity: StudyActivity,
  targetCount: number,
  title: string,
  hint: string,
  href: string,
  minutes: number,
): StudyAgendaTask {
  return { id, activity, targetCount, title, hint, href, minutes };
}

const LIGHT_TASKS: StudyAgendaTask[] = [
  task(
    "light-sim",
    "simulate",
    1,
    "1 pergunta no simulado Part 1",
    "Toque em Simulado na página Part 1",
    "/?view=exam",
    8,
  ),
  task(
    "light-shadow",
    "shadow",
    2,
    "2 blocos Shadow PEEL",
    "Abra uma pergunta e treine bloco a bloco",
    "/",
    6,
  ),
  task(
    "light-pron",
    "pronunciation",
    1,
    "1 palavra no banco de pronúncia",
    "Grave e corrija com Azure",
    "/pronunciation",
    5,
  ),
];

const WEEKDAY_PLANS: Record<number, Omit<StudyAgendaDay, "date" | "weekday" | "mode">> = {
  0: {
    title: "Domingo — revisão leve",
    subtitle: "Só o essencial para manter o ritmo (~20 min)",
    tasks: LIGHT_TASKS,
    goalPoints: agendaGoalFromTasks(LIGHT_TASKS),
    estimatedMinutes: 20,
  },
  1: {
    title: "Segunda — Part 1 + pronúncia",
    subtitle: "Simulado curto e shadow PEEL nas perguntas",
    tasks: [
      task("mon-sim", "simulate", 1, "1 pergunta no simulado Part 1", "Prep 5s → fale 45s → revise", "/?view=exam", 8),
      task("mon-shadow", "shadow", 4, "4 blocos Shadow PEEL", "Ouça e repita cada bloco da resposta", "/", 10),
      task("mon-pron", "pronunciation", 1, "1 palavra no banco", "Foque nas palavras que mais erra", "/pronunciation", 5),
      task("mon-vocab", "vocabulary", 2, "2 termos de vocabulário", "Trainer ou shadowing de termos", "/vocabulario", 6),
    ],
    goalPoints: 12,
    estimatedMinutes: 30,
  },
  2: {
    title: "Terça — vocabulário ICAO",
    subtitle: "Dia para termos técnicos e frases curtas",
    tasks: [
      task("tue-vocab", "vocabulary", 5, "5 termos de vocabulário", "Priorize os que estão vencidos no SRS", "/vocabulario", 12),
      task("tue-shadow", "shadow", 3, "3 blocos Shadow PEEL", "Mantenha o Part 1 ativo", "/", 8),
      task("tue-pron", "pronunciation", 1, "1 palavra no banco", "Reforce pronúncia fraca", "/pronunciation", 5),
    ],
    goalPoints: 12,
    estimatedMinutes: 28,
  },
  3: {
    title: "Quarta — simulação Part 2",
    subtitle: "Um bloco focado na prova de interação",
    tasks: [
      task(
        "wed-part2",
        "simulate",
        SIMULATE_PART2_UNITS,
        "Simulação completa Part 2",
        "Modo Simulação — grave cada situação com Azure",
        "/part2?mode=simulation",
        35,
      ),
    ],
    goalPoints: 12,
    estimatedMinutes: 35,
  },
  4: {
    title: "Quinta — pronúncia + revisão",
    subtitle: "Corrigir palavras fracas e revisar PEEL",
    tasks: [
      task("thu-pron", "pronunciation", 1, "1 palavra no banco", "Repita até passar no vault", "/pronunciation", 5),
      task("thu-shadow", "shadow", 4, "4 blocos Shadow PEEL", "Conectores e entonação", "/", 10),
      task("thu-vocab", "vocabulary", 2, "2 termos de vocabulário", "Revisão espaçada", "/vocabulario", 6),
      task("thu-sim", "simulate", 1, "1 pergunta no simulado Part 1", "Feche o dia com uma pergunta", "/?view=exam", 8),
    ],
    goalPoints: 12,
    estimatedMinutes: 30,
  },
  5: {
    title: "Sexta — misto Part 1",
    subtitle: "Equilíbrio antes do fim de semana",
    tasks: [
      task("fri-sim", "simulate", 1, "1 pergunta no simulado Part 1", "Simule condição de prova", "/?view=exam", 8),
      task("fri-shadow", "shadow", 3, "3 blocos Shadow PEEL", "Blocos que ainda falham", "/", 8),
      task("fri-vocab", "vocabulary", 2, "2 termos de vocabulário", "Termos da sua prova alvo", "/vocabulario", 6),
      task("fri-pron", "pronunciation", 1, "1 palavra no banco", "Última rodada da semana", "/pronunciation", 5),
    ],
    goalPoints: 12,
    estimatedMinutes: 28,
  },
  6: {
    title: "Sábado — dia leve",
    subtitle: "Recuperação ou compensação da semana",
    tasks: LIGHT_TASKS,
    goalPoints: agendaGoalFromTasks(LIGHT_TASKS),
    estimatedMinutes: 20,
  },
};

function agendaGoalFromTasks(tasks: StudyAgendaTask[]): number {
  return tasks.reduce((sum, t) => sum + studyActivityPoints(t.activity, t.targetCount), 0);
}

export function loadStudyPlanMode(): StudyPlanMode {
  if (typeof window === "undefined") return "standard";
  try {
    const raw = localStorage.getItem(PLAN_MODE_KEY);
    return raw === "light" ? "light" : "standard";
  } catch {
    return "standard";
  }
}

export function saveStudyPlanMode(mode: StudyPlanMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAN_MODE_KEY, mode);
  window.dispatchEvent(new Event(STUDY_PLAN_CHANGE_EVENT));
}

export function dateFromKey(key: string): Date {
  return new Date(`${key}T12:00:00`);
}

export function weekdayFromKey(key: string): number {
  return dateFromKey(key).getDay();
}

export function isWeekend(weekday: number): boolean {
  return weekday === 0 || weekday === 6;
}

function lightAgendaDay(date: string, weekday: number): StudyAgendaDay {
  const goalPoints = agendaGoalFromTasks(LIGHT_TASKS);
  return {
    date,
    weekday,
    mode: "light",
    title: "Plano leve — meta alcançável",
    subtitle: `~${goalPoints} pts em ~20 min`,
    tasks: LIGHT_TASKS,
    goalPoints,
    estimatedMinutes: 20,
  };
}

export function buildStudyAgenda(date = todayKey(), mode = loadStudyPlanMode()): StudyAgendaDay {
  const weekday = weekdayFromKey(date);

  if (mode === "light") {
    return lightAgendaDay(date, weekday);
  }

  const plan = WEEKDAY_PLANS[weekday];
  return {
    date,
    weekday,
    mode: "standard",
    ...plan,
    goalPoints: agendaGoalFromTasks(plan.tasks),
  };
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
  estimatedMinutes: number;
  remainingMinutes: number;
};

export function getAgendaProgress(
  agenda: StudyAgendaDay,
  day: StudyDayRecord,
): StudyAgendaProgress {
  const tasksDone = agenda.tasks.filter((t) => isAgendaTaskDone(t, day)).length;
  const pointsEarned = agenda.tasks.reduce(
    (sum, t) => sum + studyActivityPoints(t.activity, Math.min(day[t.activity], t.targetCount)),
    0,
  );
  const globalPoints = studyDayPoints(day);
  const doneMinutes = agenda.tasks
    .filter((t) => isAgendaTaskDone(t, day))
    .reduce((sum, t) => sum + t.minutes, 0);

  return {
    tasksDone,
    tasksTotal: agenda.tasks.length,
    pointsEarned,
    goalPoints: agenda.goalPoints,
    globalPoints,
    globalGoal: STUDY_DAILY_GOAL_POINTS,
    globalGoalMet: globalPoints >= STUDY_DAILY_GOAL_POINTS,
    agendaComplete: tasksDone === agenda.tasks.length,
    estimatedMinutes: agenda.estimatedMinutes,
    remainingMinutes: Math.max(0, agenda.estimatedMinutes - doneMinutes),
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
