import { globalCss } from '@ignite-ui/react' // O  do globalCss vem do @ignite-ui/react, que por baixo dos panos esta usando o stitches do ignite-ui/react

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    backgroundColor: '$gray900',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
  },
})
