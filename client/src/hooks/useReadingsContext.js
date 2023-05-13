import { ReadingsContext } from "../context/ReadingContext";
import { useContext } from "react";


export const useReadingsContext = () => {
    const context = useContext(ReadingsContext)

    if (!context) {
        throw Error('useReadingsContext must be used inside a ReadingContextProvider')
    }

    return context
}