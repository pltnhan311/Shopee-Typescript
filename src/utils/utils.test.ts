import { rateSale } from './utils'

test('rateSale should return the correct percentage', () => {
  expect(rateSale(100, 20)).toBe('80%')
  expect(rateSale(50, 10)).toBe('80%')
  expect(rateSale(200, 50)).toBe('75%')
})

test('rateSale should handle zero values', () => {
  expect(rateSale(0, 0)).toBe('0%')
  expect(rateSale(100, 0)).toBe('0%')
  expect(rateSale(0, 50)).toBe('100%')
})

test('rateSale should handle negative values', () => {
  expect(rateSale(-100, -20)).toBe('80%')
  expect(rateSale(-50, -10)).toBe('80%')
  expect(rateSale(-200, -50)).toBe('75%')
})
