// user data 
// const users = [
//   {
//     name: "dashcode",
//     email: "dashcode@codeshaper.net",
//     password: "password",
//     image: '/images/users/user-1.jpg',
//   },
  
// ]

const users = [
  {
    name: "dashcode",
    username: "emilys",
    password: "emilyspass",
    image: '/images/users/user-1.jpg',
  },
  
]

export type User = (typeof users)[number]

// export const getUserByEmail = (email: string) => {
//   return users.find((user) => user.email === email)
// }

export const getUserByEmail = (username: string) => {
  console.log(username)
  return users.find((user) => user.username === username)
}