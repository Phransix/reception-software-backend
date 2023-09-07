export type JwtPayload = {
    email: string;
    sub: string;
    scopes : string;
    role: string
  };