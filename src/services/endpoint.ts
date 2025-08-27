const PREFIX = `/api/v1`;

export const ENDPOINT = {
  AUTH: {
    LOGIN: `${PREFIX}/auth/login`,
    LOGOUT: `${PREFIX}/auth/logout`,
    SIGNUP: `${PREFIX}/auth/signup`,
    TOKEN_VALIDATION: `${PREFIX}/auth/token`,
    SET_COOKIE: `${PREFIX}/auth/set-cookie`,
  },
  GOAL: {
    GET_ALL: `${PREFIX}/goals`,
    GET_BY_ID: (id: number) => `${PREFIX}/goals/${id}`,
    CREATE: `${PREFIX}/goals`,
    UPDATE: (id: number) => `${PREFIX}/goals/${id}`,
    DELETE: (id: number) => `${PREFIX}/goals/${id}`,
    GET_PROGRESS: `${PREFIX}/goals/progress`,
  },
  TODO: {
    GET_ALL: `${PREFIX}/todos`,
    GET_BY_ID: (id: number) => `${PREFIX}/todos/${id}`,
    CREATE: `${PREFIX}/todos`,
    UPDATE: (id: number) => `${PREFIX}/todos/${id}`,
    POST: `${PREFIX}/todos`,
    DELETE: (id: number) => `${PREFIX}/todos/${id}`,
    GET_INFO: `${PREFIX}/todos/info/status`,
  },
  DASHBOARD: {
    GET_TODOS: `${PREFIX}/dashboard/todos/recent`,
    PROGRESS: `${PREFIX}/dashboard/todos/progress`,
    GET_TODO_STREAK: `${PREFIX}/dashboard/todos/streak`,
  },
  NOTES: {
    GET_BY_ID: (noteId: number) => `${PREFIX}/notes/${noteId}`,
    UPDATE: (noteId: number) => `${PREFIX}/notes/${noteId}`,
    DELETE: (noteId: number) => `${PREFIX}/notes/${noteId}`,
    CREATE: `${PREFIX}/notes`,
    LIST: `${PREFIX}/notes`,
  },
  FILE: {
    GET: (prefix: string, fileName: string) =>
      `${PREFIX}/file/presigned-url/${prefix}/${fileName}`,
    DASHBOARD: {
      GET_TODOS: `${PREFIX}/dashboard/todos/recent`,
    },
  },
  PROFILE_CARD: {
    GET: `${PREFIX}/dashboard/shared/profile`,
  },
  PUSH: {
    REGISTER_TOKEN: `${PREFIX}/push/token`,
    SEND: `${PREFIX}/push/send`,
    SETTING: `${PREFIX}/push`,
    GET_SETTING: `${PREFIX}/member/push/settings`,
  },
} as const;
