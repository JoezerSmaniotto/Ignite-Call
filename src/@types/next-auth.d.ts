import NextAuth from 'next-auth'
// Projeto: 6 Seção: Conexão Com Calendário Aula:Criando Adapter do Prisma 3:00
// Criando uma tipagem para sobrescrever o tipo user padrão do prisma, para o que crei no banco de dados diferente do padrão.
declare module 'next-auth' {
  export interface User {
    id: string
    name: string
    email: string
    username: string
    avatar_url: string
  }
}
