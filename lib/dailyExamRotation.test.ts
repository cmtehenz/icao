import { getTodayExamVersion, weekdayIndex, DAILY_EXAM_ROTATION } from "@/lib/dailyExamRotation";
import { describe, expect, it } from "vitest";

describe("daily exam rotation by weekday", () => {
  it("maps Mon→23C, Tue→24C, Wed→25C, Thu→26C", () => {
    expect(weekdayIndex("2026-07-06")).toBe(0);
    expect(getTodayExamVersion("2026-07-06")).toBe("23C");
    expect(getTodayExamVersion("2026-07-07")).toBe("24C");
    expect(getTodayExamVersion("2026-07-08")).toBe("25C");
    expect(getTodayExamVersion("2026-07-09")).toBe("26C");
  });

  it("repeats the four-exam cycle through the weekend", () => {
    expect(getTodayExamVersion("2026-07-10")).toBe("23C");
    expect(getTodayExamVersion("2026-07-11")).toBe("24C");
    expect(getTodayExamVersion("2026-07-12")).toBe("25C");
  });

  it("covers all exam versions in the rotation", () => {
    expect(DAILY_EXAM_ROTATION).toEqual(["23C", "24C", "25C", "26C"]);
  });
});
