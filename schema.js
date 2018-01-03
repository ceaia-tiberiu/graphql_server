export default `

type Suggestion {
    id: Int!,
    text: String!,
    creatorUsername: String,
    boardId: Int!
}

type Board {
    id: Int!,
    name: String!,
    owner: Int!,
    suggestions: [Suggestion!]!,
}

type User {
    id: Int!,
    username: String!,
    createdAt: String!,
    updatedAt: String!,
    boards: [Board!]!,
    suggestions: [Suggestion!]!
} 

type Query {
    allUsers: [User!]!,
    getUser(username: String!): User!,
    userBoards(owner: String!): [Board!]!,
    userSuggestions(creatorId: String!): [Suggestion!]!
}

type Mutation {
    createUser(username: String!): User,
    updateUser(id: Int!, newUsername: String!): [Int!]!,
    deleteUser(id: Int!): Int!,
    createBoard( name: String, owner: Int!): Board!,
    createSuggestion(text: String, creatorId: Int!,boardId: Int!): Suggestion!
}
`;
