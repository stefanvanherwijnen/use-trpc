import type { AnyRouter, ProcedureType, AnyProcedure, Procedure } from '@trpc/server/unstable-core-do-not-import/index'
export type Fn<T = any> = () => T
export type MaybeAsyncFn<T = any> = () => T | Promise<T>

type ProcedurePathsInternal<
  T,
  Method extends ProcedureType,
  K extends keyof T = keyof T,
  P extends string = ''
> = K extends string
  ? K extends '_def'
    ? never
    : T[K] extends Procedure<Method, any>
    ? `${P}${K}`
    : T[K] extends object
    ? ProcedurePathsInternal<T[K], Method, keyof T[K], `${P}${K}.`>
    : never
  : never

type ProcedurePaths<T, Method extends ProcedureType> = Exclude<ProcedurePathsInternal<T, Method>, undefined>

export type inferProcedureNames<R extends any, T extends ProcedureType> = ProcedurePaths<R, T>

export type inferProcedureValues<
  T extends AnyRouter,
  P extends inferProcedureNames<T, ProcedureType>
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? T[K] extends AnyRouter
      ? Rest extends inferProcedureNames<T[K], ProcedureType>
        ? inferProcedureValues<T[K], Rest>
        : never
      : never
    : never
  : P extends keyof T
  ? T[P] extends AnyProcedure
    ? T[P]
    : never
  : never
