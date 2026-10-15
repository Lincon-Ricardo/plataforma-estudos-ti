export interface DayPlan { day: string; items: { lessonId: string; minutes: number }[]; total: number; }

// Encaixa a fila de aulas pendentes (em ordem de pré-requisito) nos dias.
// Preenche dia a dia em sequência; o que não couber vai para a fila.
// Ordem nunca é quebrada: prefere deixar minuto livre a adiantar aula futura.
export function buildWeek(days: string[], dailyMinutes: number, pending: { id: string; minutes: number }[]): { week: DayPlan[]; queue: { id: string; minutes: number }[] } {
  if (!days.length || dailyMinutes <= 0) return { week: [], queue: [...pending] };
  const week: DayPlan[] = days.map((day) => ({ day, items: [], total: 0 }));
  const queue: { id: string; minutes: number }[] = [];
  let di = 0;
  for (const item of pending) {
    while (di < week.length && week[di].total + item.minutes > dailyMinutes && week[di].items.length > 0) di++;
    if (di >= week.length) { queue.push(item); continue; }
    week[di].items.push({ lessonId: item.id, minutes: item.minutes });
    week[di].total += item.minutes;
  }
  return { week: week.filter((d) => d.items.length > 0), queue };
}
