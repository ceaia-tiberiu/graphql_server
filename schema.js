export default `
type User {
    id: Int!,
    username: String!,
    createdAt: String!,
    updatedAt: String!
}

type Query {
    allUsers: [User!]!,
    getUser(username: String!): User
}

type Mutation {
    createUser(username: String!): User,
    updateUser(id: Int!, newUsername: String!): [Int!]!,
    deleteUser(id: Int!): Int!
}
`;
