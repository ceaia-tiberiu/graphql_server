export default `

type Subscription {
    userRegistred: User! 
}


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
    email: String!,
    createdAt: String!,
    updatedAt: String!,
    boards: [Board!]!,
    suggestions: [Suggestion!]!
} 

type Query {
    allUsers: [User!]!,
    me: User,
    userBoards(owner: String!): [Board!]!,
    userSuggestions(creatorId: String!): [Suggestion!]!
}

type Mutation {
    updateUser(id: Int!, newUsername: String!): [Int!]!,
    deleteUser(id: Int!): Int!,
    createBoard( name: String, owner: Int!): Board!,
    createSuggestion(text: String, creatorId: Int!,boardId: Int!): Suggestion!
    register(username: String!, email: String, password: String!): User!
    login(email: String, password: String): String!
}

schema {
    query: Query,
    mutation: Mutation,
    subscription: Subscription
}
`;
