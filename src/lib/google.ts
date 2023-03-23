import dayjs from 'dayjs'
import { google } from 'googleapis'
import { prisma } from './prisma'

/* Essa função sempre vai ser chamada quando nós comunicarmos com a API do google
 Sempre que Chamarmos a função getGoogleOAuthToken passando um userId, ele vai
Fazer todo o processo de se autenticar com o google, caso não por o token estar expirado
irá  fazer o refesh do token */
// Projeto: 6 Seção: Agendamento Aula: Configurando API do Google
export async function getGoogleOAuthToken(userId: string) {
  const account = await prisma.account.findFirstOrThrow({
    where: {
      provider: 'google',
      user_id: userId,
    },
  })

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )

  auth.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at ? account.expires_at * 1000 : null,
  })

  if (!account.expires_at) {
    // Aqui se não tiver data da expiração, significa que o token, não expira nunca
    return auth
  }

  const isTokenExpired = dayjs(account.expires_at * 1000).isBefore(new Date())
  // Se tiver expirado entra aqui e faz o refresh do tolen com o metodo refreshAccessToken
  if (isTokenExpired) {
    const { credentials } = await auth.refreshAccessToken() // Função usado para atualizar o token
    const {
      access_token,
      expiry_date,
      id_token,
      refresh_token,
      scope,
      token_type,
    } = credentials

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        access_token,
        expires_at: expiry_date ? Math.floor(expiry_date / 1000) : null,
        id_token,
        refresh_token,
        scope,
        token_type,
      },
    })

    // Seta as informações para a comunicação com a API porém com as informações atualizadas do refreshAccessToken
    auth.setCredentials({
      access_token,
      refresh_token,
      expiry_date,
    })
  }

  // No Final de tudo retorno o auth obj de autenticação
  return auth
}
