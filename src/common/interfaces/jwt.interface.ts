export interface JwtPayload {
  userId: number;
}
export interface JwtResponse {
  id: string;
  email: string;
  iat: number;
  exp: number;
}