export interface CommonPaginationInformationResponse {
  nextCursor: number;
  totalCount: number;
  hasNext: boolean;
}

export interface CommonResponseError {
  code: string;
  message: string;
}
