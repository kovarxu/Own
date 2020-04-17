
interface ImageContext {
  readonly url: string,
  readonly id: string
}

interface SaveContext {
  readonly bufs: Array<Buffer>,
  readonly fileLength: number
}
