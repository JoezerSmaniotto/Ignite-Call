import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
})
/* Não preciso especificar a API "http:localhost:3000/api", 
Porque  o front o back estão no mesmo projeto, eles estao na mesma API
Asim ele pega o rost do front URL http:localhost:3000 e só acrescenta o API, que vai 
entender como sendo as rodas API da Aplicação */
