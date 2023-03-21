import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import Schedule from '../../../schedule/[username]/index.page'
// Projeto: 6 Seção: Configuração de disponibilidade Aula: Rota de horários disponíveis
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  // http://localhost:3000/api/users/joezer/availability?data=2023-03-21
  const { date } = req.query

  if (!date) {
    // Se não for informado a data retorna erro, pq assim não tem como marcar um hoário, pq não tem data
    return res.status(400).json({ message: 'Date no provided.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    // Se user existe no banco de dados, retorna erro
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    // Se a data já sou, caso tentem alterar os dados no url para tentar zuar os dados já retorno erro
    return res.json({ availability: [] })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    // Se ele não selecionou aquele dia como disponivel já retorna como indisponivel para agendamento
    return res.json({ availability: [] })
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability

  const startHour = time_start_in_minutes / 60 // 60  pq é agendamento de hora em hora, lembrando que os dados goram salvos em minutos por isso dividir por 60
  const endHour = time_end_in_minutes / 60 // 60  pq é agendamento de hora em hora

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    },
  )

  // Projeto: 6 Seção: Configuração de disponibilidade Aula: Carregando horários disponíveis
  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  const availableTimes = possibleTimes.filter((time) => {
    return !blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === time,
    )
  })

  return res.json({ possibleTimes, availableTimes })
}
