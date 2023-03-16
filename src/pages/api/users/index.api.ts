import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    // Pode ser chamada se for POST
    return res.status(405).end() // Caso contrario retorna 405, Method Not Allowed, ERROR
  }

  const { name, username } = req.body

  // Verifica se já existe usuário com aquele username
  // Projeto: 6 Seção: Cadastro de Usuário Aula: Manipulando cookies no Next
  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExists) {
    return res.status(400).json({
      message: 'Username already taken.',
    })
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days tempo de expiração tem que ter
    path: '/', // Eles cookies podem estar disponiveis por rotas, neste caso esta para toda a aplicação
  })

  return res.status(201).json(user)
}
