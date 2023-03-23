import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'
import { PrismaAdapter } from '../../../lib/auth/prisma-adapter'

export function buildNextAuthOptions(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res'],
): NextAuthOptions {
  return {
    adapter: PrismaAdapter(req, res),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
            scope:
              'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar',
          },
        },
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            name: profile.name,
            username: '',
            email: profile.email,
            avatar_url: profile.picture,
          }
        },
      }),
    ],
    callbacks: {
      /* Funções que são chamadas em momentos oportunos 
      Projeto: 6 Seção: Conexão Com Calendário Aula: Permissão de acesso ao calendário
      */
      async signIn({ account }) {
        /* signIn é chamada no momento que o usuário logou no aplicação */
        if (
          !account?.scope?.includes('https://www.googleapis.com/auth/calendar')
        ) {
          /* Dentro de scope tenho acesso as permissões que usuário deu, caso ele não tenha
          dado acesso ao calendar(Verificado pela url no if), eu não uso posso continuar nesta aplicação */
          return '/register/connect-calendar?error=permissions'
          /* Se isso  não tiver permissão, returno ele para a página '/register/connect-calendar?error=permissions'
          assim não com a mensagem de erro de permissão
          */
        }
        return true
      },
      async session({ session, user }) {
        /* Tudo o que o q retornar desta função é o que terei acesso no front-end
        pois estou passando para session */
        return {
          ...session,
          user,
        }
      },
    },
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOptions(req, res))
}
