import type { Transaction } from "./transaction"

export interface User {
    id: number
    name: string
    birthdate: Date
    email: string
    password: string
    phone: string
    dni: string
    nationality: string
    cash: number
    wallet: number
    profit: number
    lastBalance: number
    creationDate: Date
    transactions: Transaction[]
    role: string
}