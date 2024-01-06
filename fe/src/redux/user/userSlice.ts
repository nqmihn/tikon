import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface UserPayload {
    email: string;
    name: string;
    role: string;
    id: string,
    avatar: string
}
interface UsersState {
    isAuthenticated: boolean,
    isLoading: boolean,
    user: UserPayload
}

// Define the initial state using that type
const initialState: UsersState = {
    isAuthenticated: false,
    isLoading: true,
    user: {
        email: "",
        name: "",
        role: "",
        id: "",
        avatar: ""
    }
}

export const userSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        doLogin: (state, action: PayloadAction<UserPayload>) => {
            state.isAuthenticated = true,
                state.user = action.payload

        },
        doLogout: (state) => {
            state.isAuthenticated = false,
                state.user = {
                    email: "",
                    name: "",
                    role: "",
                    id: "",
                    avatar: ""
                }
        },
        setLoading: (state) => {
            state.isLoading = false
        }

    },
})

export const { doLogin, doLogout, setLoading } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type


export default userSlice.reducer