export interface Account {
  id: number;
  name: string;
  email: string;
  password: string;
  streakGrade: number;
}

export const ACCOUNTS_MOCK_DATA: Account[] = [
  {
    id: 0,
    email: "test@test.com",
    password: "Test1234!@#$",
    name: "테스트 계정",
    streakGrade: 0,
  },
];

export const TEST_ACCOUNT = ACCOUNTS_MOCK_DATA[0];
