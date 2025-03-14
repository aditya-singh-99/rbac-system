# Role-Based Access Control (RBAC) API

## 🚀 Overview
This is a **GraphQL API** with **Role-Based Access Control (RBAC)** implemented using **Apollo Server**. It supports three roles:
- **ADMIN**: Full access to user management and data.
- **BUSINESS**: Can manage their own business details.
- **USER**: Can view and edit their personal details.

The API handles **authentication (login/signup)** and **authorization (role-based access)** securely with **JWT tokens**.

---

## 📁 Project Setup

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Environment Setup
Create a `.env` file in the root directory, or copy the provided `.env.sample`:
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/rbac
JWT_SECRET=secret
```

### 3️⃣ Run the Server
```bash
npm start
```
API will be available at `http://localhost:4000/graphql`.

### 🔹 **Initial Admin Setup**
By default, newly created accounts will have the **USER** role. To create the first **ADMIN**, manually update a user’s role via **MongoDB Compass**:

1. Open your MongoDB Compass and connect to `mongodb://localhost:27017/rbac`.
2. Go to the `users` collection.
3. Find your desired user and update their `role` to `ADMIN`.

Example update:
```json
{
  "role": "ADMIN"
}
```

---

## 🔐 Roles & Permissions

| **Role**     | **Permissions** |
|--------------|-----------------|
| **ADMIN**    | Can manage all users, set roles, edit any user, and delete users. |
| **BUSINESS** | Can view and edit their own business details. |
| **USER**     | Can view and edit their own personal details. |

---

## 🔧 Authentication & Authorization

- **Signup/Login** returns a **JWT token**.
- **Authorization** checks `Authorization: Bearer <token>` in headers.
- **Context** extracts and decodes the token to attach user info.

✅ If the user lacks permission, they receive an **Unauthorized** error.

---

## 🔍 Schema Overview

### 🔹 User Type
```graphql
type User {
  id: ID!
  email: String!
  role: Role!
  userDetails: UserDetails
  businessDetails: BusinessDetails
}
```

### 🔹 Role Enum
```graphql
enum Role {
  ADMIN
  BUSINESS
  USER
}
```

### 🔹 Queries
```graphql
type Query {
  users: [User]            # Admin only
  me: User                 # Authenticated users
  myBusiness: BusinessDetails # Business role only
  anyUser(id: ID!): User   # Admin only
}
```

### 🔹 Mutations
```graphql
type Mutation {
  signup(email: String!, password: String!): Auth
  login(email: String!, password: String!): Auth
  setRole(id: ID!, role: Role!): User  # Admin only
  editMyDetails(userDetails: UserInput): User
  editMyBusiness(businessDetails: BusinessInput): BusinessDetails # Business only
  editAnyUser(id: ID!, userDetails: UserInput, businessDetails: BusinessInput): User  # Admin only
  deleteAnyUser(id: ID!): User  # Admin only
}
```

---

## 🧪 Testing (Not yet configured)

🚧 **Testing setup is currently not implemented.**

For manual testing, use Apollo Sandbox or Postman:
- **Login & Signup** → Get the token.
- **Set Authorization Header:**
  ```bash
  Authorization: Bearer <your_token_here>
  ```
- **Try Queries/Mutations** based on roles.

---


