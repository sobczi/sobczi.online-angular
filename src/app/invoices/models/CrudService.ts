import { Observable } from 'rxjs'

export interface CrudService<T> {
  read: () => Observable<T[]>
  create: (element: T) => Observable<T>
  update: (element: T, elementId: string) => Observable<T>
  delete: (elementId: string) => Observable<boolean>
}
