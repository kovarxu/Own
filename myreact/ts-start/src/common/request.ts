export function double<T, U> (source: T, target: U): (T|U)[] {
  return [source, target]
}

// export function double (source: any, target: any) {
//   return [source, target]
// }

double<string, number>('string', 1)
