import { styled, Heading, Text } from '@ignite-ui/react'

export const Container = styled('div', {
  // Projeto 6 Seção: Cadastro de usuário Aula: Estrutura visual da home  10:00
  // Assim faço que o conteudo da direita, no caso a imagem, venha perdendo tamaho.
  // Enquanto o conteúdo da esquerda não em telas menores
  maxWidth: 'calc(100vw - (100vw - 1160px) / 2)', // Aqui vejo o espaçamento que terei com calc
  marginLeft: 'auto', // Com o espaçamento descoberto acima, dando um margin left, então o espamento aplicando a esquerda, enpurando o conteúdo para direita.
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  gap: '$20',
})

export const Hero = styled('div', {
  maxWidth: 480,
  padding: '0 $10',

  // [`${Heading}`]: { // Assim aplica para dentro do Hero para o primeiro nivel e para os compnents Como Box, caso tenha Heading dentro dele.
  [`> ${Heading}`]: {
    // Com > aplica apenas no primeiro NIVEL
    '@media(max-width: 600px)': {
      fontSize: '$6xl',
    },
  },

  [`> ${Text}`]: {
    maskType: '$2',
    color: '$gray200',
  },
})

export const Preview = styled('div', {
  paddingRight: '$8',
  overflow: 'hidden',

  '@media(max-width: 600px)': {
    display: 'none',
  },
})
