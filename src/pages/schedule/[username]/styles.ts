import { Heading, styled, Text } from '@ignite-ui/react'

export const Container = styled('div', {
  maxWidth: 852,
  padding: '0 $4',
  margin: '$20 auto $4',
})

export const UserHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  [`> ${Heading}`]: {
    // Assim estiliza apenas o heading interno, não aplica em Heading que pode ter dentro de um compenent importado que esteja dentro do UserHeader e tenha Heading
    lineHeight: '$base',
    marginTop: '$2',
  },

  [`> ${Text}`]: {
    // Assim estiliza apenas o Text interno, não aplica em Text que pode ter dentro de um compenent importado que esteja dentro do UserHeader e tenha Text
    color: '$gray200',
  },
})
