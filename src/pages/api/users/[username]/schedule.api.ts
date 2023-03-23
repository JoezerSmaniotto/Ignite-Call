import dayjs from 'dayjs'
import { google } from 'googleapis'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { getGoogleOAuthToken } from '../../../../lib/google'
import { prisma } from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const username = String(req.query.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const createSchedulingBody = z.object({
    name: z.string(),
    email: z.string().email(),
    observations: z.string(),
    date: z.string().datetime(),
  })

  const { name, email, observations, date } = createSchedulingBody.parse(
    req.body,
  )

  const schedulingDate = dayjs(date).startOf('hour')

  if (schedulingDate.isBefore(new Date())) {
    // Verifica se o agendamento já passou
    return res.status(400).json({
      message: 'Date is in the past.',
    })
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  })

  if (conflictingScheduling) {
    // Verifica com a conflictingScheduling, se já tem algum agendamento no mesmo horário
    return res.status(400).json({
      message: 'There is another scheduling at at the same time.',
    })
  }

  const scheduling = await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
      user_id: user.id,
    },
  })

  // Comunicação com API do Google
  // Projeto: 6 Seção: Agendamento Aula: Criação do evento no Google
  const calendar = google.calendar({
    version: 'v3',
    auth: await getGoogleOAuthToken(user.id),
  })

  // API de Calendario
  await calendar.events.insert({
    calendarId: 'primary', // Seleciona o calendario padrão primary
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Ignite Call: ${name}`, // TItulo do evento
      description: observations, // Descrição
      start: {
        // horário de inicio
        dateTime: schedulingDate.format(),
      },
      end: {
        // horário de termino, lembrando o termino é sempre uma hora a mais
        dateTime: schedulingDate.add(1, 'hour').format(),
      },
      attendees: [{ email, displayName: name }], // usuário convidado
      conferenceData: {
        // Usa a chamada do google meet, para criar o evento
        createRequest: {
          requestId: scheduling.id,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    },
  })

  return res.status(201).end()
}
