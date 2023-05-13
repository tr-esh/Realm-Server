import { createContext, useReducer } from "react";

export const ReadingsContext = createContext()

export const readingsReducer = (state, action) => {
    switch (action.type){
        case 'SET_READINGS':
            return {
                readings: action.payload
            }
        case 'CREATE_READING':
                return {
                    readings: [action.payload]
            }
    
        default:
            return state
    }
}



export const ReadingsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(readingsReducer, {
        readings: null
    })
    

    return (
        <ReadingsContext.Provider value={{...state, dispatch}}>
            { children }
        </ReadingsContext.Provider>
    )
}