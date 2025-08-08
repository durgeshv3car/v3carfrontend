import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    token: string
    permissions: string[]
    role: string
  }

  interface Session {
    user: User
  }
}
