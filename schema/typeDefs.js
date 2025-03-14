
const typeDefs = `#graphql
    type User{
        id:ID!
        email:String!
        role:Role!
        userDetails:UserDetails
        businessDetails:BusinessDetails
    }
    enum Role{
        ADMIN
        BUSINESS
        USER
    }
    type UserDetails{
        name:String
        address:String
        phone:String
    }
    type BusinessDetails{
        details:String
        website:String
        products:[String!]
    }
    type Auth{
        token:String!
        user:User!
    }
    input UserInput{
        name:String
        address:String
        phone:String
    }
    input BusinessInput{
        details:String
        website:String
        products:[String!]
    }
    type Query{
        users:[User],
        me:User,
        myBusiness:BusinessDetails
        anyUser(id:ID!):User
    }
    type Mutation{
        signup(email:String!,password:String!):Auth
        login(email:String!,password:String!):Auth
        setRole(id:ID!,role:Role!):User
        editMyDetails(userDetails:UserInput):User
        editMyBusiness(businessDetails:BusinessInput):BusinessDetails
        editAnyUser(id:ID!,userDetails:UserInput,businessDetails:BusinessInput):User
        deleteAnyUser(id:ID!):User
    }
`

export default typeDefs