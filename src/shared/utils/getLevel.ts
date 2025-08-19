export const getLevel = (accidentCount: number): number => {
  if (accidentCount < 3) return 0
  if (accidentCount < 7) return 1
  return 2
}