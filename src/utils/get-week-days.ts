interface GetWeekDaysParams {
  short?: boolean
}

export function getWeekDays({ short = false }: GetWeekDaysParams = {}) {
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }) // Aqui eu pego o dia da semana por extenso

  /* Aqui crio um array com Array(7) campos Undefined, porém acesso as Key / Indice, 
    das posições, 0,1,2,3 ate  6, apos Aplico o om Array.from para converter o retorno
    do Array(7).keys() em uma estrutura de arrays */
  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekDay) => {
      if (short) {
        return weekDay.substring(0, 3).toUpperCase()
      }

      return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1))
    })
}
